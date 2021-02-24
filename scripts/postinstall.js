const fs = require('fs');
const path = require('path');

function loadModule(name) {
  try {
    return require(name);
  } catch (e) {
    return undefined;
  }
}
const Vue = loadModule('vue');
if (Vue.version.startsWith('3.')) {
  switchV3();
}

function switchV3() {
  const routerDs = path.resolve(__dirname, '..', 'dist/route.d.ts');
  let content = fs.readFileSync(routerDs, 'utf-8');

  content = content.replace(
    "import Router, { Route } from 'vue-router';",
    "import  { Router, RouteLocationNormalized as Route} from 'vue-router';"
  );

  fs.writeFileSync(routerDs, content, 'utf-8');
}
