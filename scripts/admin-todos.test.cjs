const test = require('node:test');
const assert = require('node:assert/strict');
const loadTs = require('./load-ts.cjs');

function fixture(user = { id: 'alice' }) {
  const state = { todos: [{ id: 'a', userId: 'alice' }, { id: 'b', userId: 'bob' }], users: ['alice', 'bob'] };
  const prisma = {
    todo: {
      findMany: async ({ where, skip, take }) => state.todos.filter(todo => !where || todo.userId === where.userId).slice(skip, skip + take),
      deleteMany: async () => { state.todos = []; },
    },
    user: {
      deleteMany: async () => { state.users = []; },
      create: async () => { state.users.push('seed'); return {}; },
    },
  };
  return { state, mocks: { '@/lib/prisma': prisma, '@/auth/actions/auth-actions': { getUserSessionServer: async () => user } } };
}

test('HTTP seed is unavailable and cannot erase existing data', async () => {
  const { state, mocks } = fixture();
  const { GET } = loadTs('admin-todos', 'src/app/api/seed/route.ts', mocks);
  const response = await GET(new Request('http://localhost/api/seed'));
  assert.equal(response.status, 404);
  assert.equal(state.todos.length, 2);
  assert.deepEqual(state.users, ['alice', 'bob']);
});

test('anonymous requests cannot list tasks', async () => {
  const { mocks } = fixture(null);
  const { GET } = loadTs('admin-todos', 'src/app/api/todos/route.ts', mocks);
  const response = await GET(new Request('http://localhost/api/todos'));
  assert.equal(response.status, 401);
});

test('a task list contains only the authenticated owner data', async () => {
  const { mocks } = fixture();
  const { GET } = loadTs('admin-todos', 'src/app/api/todos/route.ts', mocks);
  const response = await GET(new Request('http://localhost/api/todos'));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), [{ id: 'a', userId: 'alice' }]);
});

for (const query of ['take=-1', 'take=1.5', 'take=101', 'take=Infinity', 'skip=-1']) {
  test(`invalid pagination is rejected: ${query}`, async () => {
    const { mocks } = fixture();
    const { GET } = loadTs('admin-todos', 'src/app/api/todos/route.ts', mocks);
    const response = await GET(new Request(`http://localhost/api/todos?${query}`));
    assert.equal(response.status, 400);
  });
}
