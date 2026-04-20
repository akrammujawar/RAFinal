const fs = require('fs');
const path = require('path');

const libDir = path.join(__dirname, 'node_modules/@pnp/spfx-controls-react/lib');

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(function(name) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (name.endsWith('.module.scss.css')) {
      const target = full.slice(0, -4); // remove trailing .css
      if (!fs.existsSync(target)) {
        fs.copyFileSync(full, target);
        console.log('Created:', target);
      }
    }
  });
}

walk(libDir);
console.log('fix-pnp-scss: done');
