
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/tasks",
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/users"
  },
  {
    "renderMode": 2,
    "route": "/tasks"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 23569, hash: 'dc5a3efe7a2dcd8923726906bc91230e887941b0dbb218b351c77386b98bddbf', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17143, hash: 'c9071515f12637b0d68056f3bc83a79661b2ec5481b496ce697f77fbe453697b', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'tasks/index.html': {size: 63330, hash: '186fc6263bef1b9683e7bd141f21ece3ba658a1b5e9de8896d5873531a67e1d9', text: () => import('./assets-chunks/tasks_index_html.mjs').then(m => m.default)},
    'users/index.html': {size: 62465, hash: '6b2b9de802d1875da8b585b4f25d11cafc1647840f0dd89b411d2b6b20c6b246', text: () => import('./assets-chunks/users_index_html.mjs').then(m => m.default)},
    'styles-36AW6TKX.css': {size: 6979, hash: 'vY6tjD/ce7M', text: () => import('./assets-chunks/styles-36AW6TKX_css.mjs').then(m => m.default)}
  },
};
