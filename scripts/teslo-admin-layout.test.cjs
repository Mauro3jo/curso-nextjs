const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');

// Exercise the real layout with synthetic sessions; no database or login provider.
function layoutFor(session) {
  const root = path.resolve(__dirname, '../apps/teslo-shop');
  const appRequire = createRequire(path.join(root, 'package.json'));
  const ts = appRequire('typescript');
  const filename = path.join(root, 'src/app/(shop)/admin/layout.tsx');
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
    },
    fileName: filename,
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(source, {
    module, exports: module.exports,
    require(id) {
      if (id === '@/auth.config') return { auth: async () => session };
      if (id === 'next/navigation') return {
        redirect(destination) { throw new Error(`redirect:${destination}`); },
      };
      return appRequire(id);
    },
  }, { filename });
  return module.exports.default;
}

for (const [label, session] of [
  ['anonymous', null],
  ['non-admin', { user: { id: 'synthetic-user', role: 'user' } }],
]) {
  test(`admin layout sends ${label} visitors to the existing sign-in route`, async () => {
    await assert.rejects(layoutFor(session)({ children: 'restricted content' }),
      { message: 'redirect:/auth/login' });
  });
}

test('admin layout preserves content for an administrator', async () => {
  const result = await layoutFor({ user: { id: 'synthetic-admin', role: 'admin' } })({ children: 'restricted content' });
  assert.equal(result.props.children, 'restricted content');
});
