#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const sourceDir = '/home/user';
const targetDir = '/vercel/share/v0-project';

console.log('[v0] Moving extracted files to v0 project directory...');
console.log('[v0] Source:', sourceDir);
console.log('[v0] Target:', targetDir);

try {
  // Get list of files to move (exclude node_modules, .git, and scripts folder)
  const items = fs.readdirSync(sourceDir).filter(item => {
    return !['node_modules', '.git', 'scripts', 'package-lock.json', 'Joebek-Auto-mart-pos-mvp-main-copy.zip', 'Joebek-Auto-mart-pos-mvp-main.zip'].includes(item);
  });
  
  console.log('[v0] Moving', items.length, 'items...');
  
  for (const item of items) {
    const src = path.join(sourceDir, item);
    const dst = path.join(targetDir, item);
    
    // Remove existing
    if (fs.existsSync(dst)) {
      console.log('[v0] Removing existing', item);
      if (fs.statSync(dst).isDirectory()) {
        fs.rmSync(dst, { recursive: true });
      } else {
        fs.unlinkSync(dst);
      }
    }
    
    // Copy instead of move to preserve source
    console.log('[v0] Copying', item);
    if (fs.statSync(src).isDirectory()) {
      execSync(`cp -r "${src}" "${dst}"`);
    } else {
      execSync(`cp "${src}" "${dst}"`);
    }
  }
  
  console.log('[v0] Done! Files are now in v0 project directory.');
  console.log('[v0] New files in v0 project:', fs.readdirSync(targetDir).filter(f => !f.startsWith('.')).slice(0, 15));
} catch (e) {
  console.error('[v0] Error:', e.message);
  process.exit(1);
}
