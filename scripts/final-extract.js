#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const cwd = process.cwd();
console.log('[v0] Working directory:', cwd);
console.log('[v0] Files in cwd:', fs.readdirSync(cwd).slice(0, 20));

const zipFile = 'Joebek-Auto-mart-pos-mvp-main.zip';
const zipPath = path.join(cwd, zipFile);

try {
  if (!fs.existsSync(zipPath)) {
    console.error('[v0] ZIP file not found at:', zipPath);
    console.error('[v0] Available files:', fs.readdirSync(cwd).filter(f => f.includes('zip')));
    process.exit(1);
  }

  console.log('[v0] Extracting:', zipPath);
  execSync(`unzip -q "${zipPath}"`, { cwd, stdio: 'inherit' });
  console.log('[v0] Extraction complete');

  // List files after extraction
  const filesAfter = fs.readdirSync(cwd);
  console.log('[v0] Files after extraction:', filesAfter.filter(f => !f.startsWith('.')).slice(0, 20));

  // Find and move extracted directory contents
  const extractedDir = filesAfter.find(f => f.includes('Joebek') && f !== zipFile && fs.statSync(path.join(cwd, f)).isDirectory());
  
  if (extractedDir) {
    console.log('[v0] Found extracted dir:', extractedDir);
    const extractedPath = path.join(cwd, extractedDir);
    const contents = fs.readdirSync(extractedPath);
    
    console.log('[v0] Moving', contents.length, 'items from', extractedDir);
    
    for (const item of contents) {
      const src = path.join(extractedPath, item);
      const dst = path.join(cwd, item);
      
      // Remove if exists
      if (fs.existsSync(dst) && item !== '.git') {
        if (fs.statSync(dst).isDirectory()) {
          fs.rmSync(dst, { recursive: true });
        } else {
          fs.unlinkSync(dst);
        }
      }
      
      // Move
      fs.renameSync(src, dst);
      console.log('[v0]   Moved:', item);
    }
    
    // Clean up empty directory
    fs.rmSync(extractedPath, { recursive: true });
    console.log('[v0] Cleaned up extracted directory');
  }

  console.log('[v0] Repository extracted successfully!');
  const finalList = fs.readdirSync(cwd).filter(f => !f.startsWith('.')).slice(0, 20);
  console.log('[v0] Final files:', finalList);

} catch (e) {
  console.error('[v0] Error:', e.message);
  process.exit(1);
}
