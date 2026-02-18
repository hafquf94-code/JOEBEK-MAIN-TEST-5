#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import https from 'https';

const projectRoot = process.cwd();
console.log('[v0] Current dir:', projectRoot);

const zipUrl = 'https://v0chat-agent-data-prod.s3.us-east-1.amazonaws.com/vm-binary/aOJUZBPBhNf/49cb824703d81447313b3be873f42e677c5723f4208ec81b28e35f72c384ecdf.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA52KF4VHQDTZ5RDMT%2F20260218%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260218T052547Z&X-Amz-Expires=3600&X-Amz-Signature=1aa844b53546e67e5537f74cf18a52fe4dc532daff2b716f2502124010190521&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject';
const zipPath = path.join(projectRoot, 'Joebek-Auto-mart-pos-mvp-main.zip');

async function main() {
  try {
    // Download the ZIP file
    console.log('[v0] Downloading ZIP from S3...');
    
    const file = fs.createWriteStream(zipPath);
    await new Promise((resolve, reject) => {
      https.get(zipUrl, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on('error', reject);
    });
    
    console.log('[v0] Download complete');
    
    // Extract the ZIP
    console.log('[v0] Extracting...');
    execSync(`unzip -q "${zipPath}" -d "${projectRoot}"`, { stdio: 'inherit' });
    console.log('[v0] Extraction complete');
    
    // Find the extracted folder
    const files = fs.readdirSync(projectRoot);
    const extractedDir = files.find(f => f.includes('Joebek') && fs.statSync(path.join(projectRoot, f)).isDirectory());
    
    if (!extractedDir) {
      throw new Error('Could not find extracted directory');
    }
    
    console.log('[v0] Found extracted dir:', extractedDir);
    
    // Move files from extracted directory to project root
    const extractedPath = path.join(projectRoot, extractedDir);
    const contents = fs.readdirSync(extractedPath);
    console.log('[v0] Moving', contents.length, 'items...');
    
    for (const item of contents) {
      const src = path.join(extractedPath, item);
      const dst = path.join(projectRoot, item);
      
      // Remove existing files/directories
      if (fs.existsSync(dst)) {
        if (fs.statSync(dst).isDirectory()) {
          fs.rmSync(dst, { recursive: true });
        } else {
          fs.unlinkSync(dst);
        }
      }
      
      // Move the file
      fs.renameSync(src, dst);
      console.log('[v0] Moved:', item);
    }
    
    // Cleanup empty directory and ZIP file
    fs.rmSync(extractedPath, { recursive: true });
    fs.unlinkSync(zipPath);
    
    console.log('[v0] Done! Repository extracted successfully.');
    const finalFiles = fs.readdirSync(projectRoot).filter(f => !f.startsWith('.'));
    console.log('[v0] New files in project root:', finalFiles.slice(0, 15));
  } catch (e) {
    console.error('[v0] Error:', e.message);
    process.exit(1);
  }
}

main();
