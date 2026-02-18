import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const zipPath = '/vercel/share/v0-project/Joebek-Auto-mart-pos-mvp-main.zip';
const projectRoot = '/vercel/share/v0-project';

try {
  console.log('[v0] Starting extraction of repository...');
  
  // Extract the ZIP file
  execSync(`cd ${projectRoot} && unzip -q Joebek-Auto-mart-pos-mvp-main.zip`, { stdio: 'inherit' });
  
  console.log('[v0] ZIP extraction complete');
  
  // Find the extracted directory
  const files = fs.readdirSync(projectRoot);
  const extractedDir = files.find(f => f.includes('Joebek') && fs.statSync(path.join(projectRoot, f)).isDirectory());
  
  if (extractedDir) {
    const extractedPath = path.join(projectRoot, extractedDir);
    console.log(`[v0] Found extracted directory: ${extractedDir}`);
    
    // Move all contents from extracted directory to project root
    const contents = fs.readdirSync(extractedPath);
    for (const item of contents) {
      const source = path.join(extractedPath, item);
      const destination = path.join(projectRoot, item);
      
      if (fs.existsSync(destination)) {
        console.log(`[v0] Removing existing ${item}...`);
        if (fs.statSync(destination).isDirectory()) {
          execSync(`rm -rf ${destination}`);
        } else {
          fs.unlinkSync(destination);
        }
      }
      
      console.log(`[v0] Moving ${item}...`);
      execSync(`mv ${source} ${destination}`);
    }
    
    // Remove the now-empty extracted directory
    execSync(`rm -rf ${extractedPath}`);
    
    // Remove the ZIP file
    fs.unlinkSync(zipPath);
    
    console.log('[v0] Repository extraction complete! All files have been extracted to the project root.');
  } else {
    console.log('[v0] No extracted directory found');
  }
} catch (error) {
  console.error('[v0] Error during extraction:', error.message);
  process.exit(1);
}
