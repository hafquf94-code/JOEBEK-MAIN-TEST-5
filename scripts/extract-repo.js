#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Simply extract in current directory
console.log('[v0] Current dir:', process.cwd());
console.log('[v0] Files before:', fs.readdirSync('.').filter(f => !f.startsWith('.')).slice(0, 10));

try {
  console.log('[v0] Extracting Joebek-Auto-mart-pos-mvp-main.zip...');
  execSync('unzip -q Joebek-Auto-mart-pos-mvp-main.zip', { stdio: 'inherit' });
  console.log('[v0] Extraction complete');
  
  // Find the extracted folder
  const files = fs.readdirSync('.');
  const extractedDir = files.find(f => f.startsWith('Joebek') && fs.statSync(f).isDirectory());
  
  if (!extractedDir) {
    throw new Error('Could not find extracted directory');
  }
  
  console.log('[v0] Found:', extractedDir);
  
  // Move files
  const contents = fs.readdirSync(extractedDir);
  console.log('[v0] Moving', contents.length, 'items...');
  
  for (const item of contents) {
    const src = path.join(extractedDir, item);
    const dst = item;
    
    if (fs.existsSync(dst)) {
      if (fs.statSync(dst).isDirectory()) {
        fs.rmSync(dst, { recursive: true });
      } else {
        fs.unlinkSync(dst);
      }
    }
    
    fs.renameSync(src, dst);
  }
  
  // Cleanup
  fs.rmSync(extractedDir, { recursive: true });
  fs.unlinkSync('Joebek-Auto-mart-pos-mvp-main.zip');
  
  console.log('[v0] Done! Repository extracted.');
} catch (e) {
  console.error('[v0] Error:', e.message);
  process.exit(1);
}
