const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');

// Use each app's existing compiler; replace only external side effects in tests.
module.exports = function loadTs(app, file, mocks = {}, globals = {}) {
  const root = path.resolve(__dirname, '..', 'apps', app);
  const appRequire = createRequire(path.join(root, 'package.json'));
  const ts = appRequire('typescript');
  const filename = path.join(root, file);
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
    fileName: filename,
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(source, {
    module, exports: module.exports,
    require: id => Object.hasOwn(mocks, id) ? mocks[id] : appRequire(id),
    URL, URLSearchParams, Request, Response, Headers, FormData, Buffer,
    process: { env: {} }, console: { log() {}, error() {} },
    fetch: async () => { throw new Error('Unexpected external request in unit test'); },
    ...globals,
  }, { filename });
  return module.exports;
};
