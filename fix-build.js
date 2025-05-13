// This script creates a browser-compatible wrapper for istextorbinary
const fs = require('fs');
const path = require('path');

// Create directory if it doesn't exist
const utilsDir = path.join(__dirname, 'app', 'utils');
if (!fs.existsSync(utilsDir)) {
  fs.mkdirSync(utilsDir, { recursive: true });
}

// Create a browser-compatible wrapper for istextorbinary
const textBinaryContent = `// Browser-compatible wrapper for istextorbinary
export function isText(buffer) {
  // Simple implementation that works in browser
  if (typeof buffer === 'string') return true;
  
  // Check for common binary file signatures
  if (buffer instanceof ArrayBuffer || buffer instanceof Uint8Array) {
    const view = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer;
    const firstBytes = view.slice(0, 8);
    
    // Check for common binary file signatures (PDF, PNG, JPG, etc.)
    const binarySignatures = [
      [0x25, 0x50, 0x44, 0x46], // PDF
      [0x89, 0x50, 0x4E, 0x47], // PNG
      [0xFF, 0xD8, 0xFF],       // JPG
      [0x47, 0x49, 0x46, 0x38], // GIF
      [0x50, 0x4B, 0x03, 0x04], // ZIP
    ];
    
    return !binarySignatures.some(sig => 
      sig.every((byte, i) => firstBytes[i] === byte)
    );
  }
  
  return true;
}

export function isBinary(buffer) {
  return !isText(buffer);
}
`;

fs.writeFileSync(path.join(utilsDir, 'textBinary.ts'), textBinaryContent);

// Create a patch for vite.config.ts
const viteConfigPatch = `
// Add this to vite.config.ts plugins array
{
  name: 'istextorbinary-patch',
  transform(code, id) {
    if (id.includes('istextorbinary')) {
      return {
        code: \`import { isText, isBinary } from '~/utils/textBinary';\nexport { isText, isBinary };\`,
        map: null,
      };
    }
    return null;
  },
},
`;

console.log('Created browser-compatible wrapper for istextorbinary at app/utils/textBinary.ts');
console.log('Add the following to your vite.config.ts plugins array:');
console.log(viteConfigPatch);

// Create a .env file with NODE_OPTIONS to increase memory limit
const envContent = `NODE_OPTIONS=--max-old-space-size=8192`;
fs.writeFileSync('.env', envContent);

console.log('Created .env file with NODE_OPTIONS to increase memory limit');

// Create a package.json update script
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = require(packageJsonPath);

// Add @iconify-json/si dependency
if (!packageJson.devDependencies['@iconify-json/si']) {
  packageJson.devDependencies['@iconify-json/si'] = '^1.1.9';
}

// Update build script
packageJson.scripts.build = 'cross-env NODE_OPTIONS=--max-old-space-size=8192 remix vite:build';

// Add cross-env if not present
if (!packageJson.devDependencies['cross-env']) {
  packageJson.devDependencies['cross-env'] = '^7.0.3';
}

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('Updated package.json with @iconify-json/si dependency and modified build script');
console.log('Run the following commands to apply the fixes:');
console.log('1. pnpm install');
console.log('2. Update vite.config.ts with the patch above');
console.log('3. pnpm build');
