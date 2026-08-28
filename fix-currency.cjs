const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      
      content = content.replace(/'NGN'/g, "'USD'");
      content = content.replace(/"NGN"/g, '"USD"');
      content = content.replace(/'en-NG'/g, "'en-US'");
      content = content.replace(/"en-NG"/g, '"en-US"');
      content = content.replace(/₦/g, '$');
      content = content.replace(/\(NGN\)/g, '(USD)');
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

replaceInDir(path.join(__dirname, 'apps/auth-frontend/src'));
