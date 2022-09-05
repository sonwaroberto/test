
// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---src-pages-404-tsx": preferDefault(require("/home/sonwa/black-walker/landing-page/www/src/pages/404.tsx")),
  "component---src-pages-index-tsx": preferDefault(require("/home/sonwa/black-walker/landing-page/www/src/pages/index.tsx"))
}

