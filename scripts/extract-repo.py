#!/usr/bin/env python3

import os
import subprocess
import shutil
from pathlib import Path

# Search for the ZIP file
print("[v0] Searching for Joebek ZIP file...")

zip_file = None

# Check common locations
locations = [
    "/home/user",
    "/vercel/share/v0-project",
    os.getcwd(),
    "/tmp",
]

for loc in locations:
    if os.path.exists(loc):
        for file in os.listdir(loc):
            if file.endswith('.zip') and 'Joebek' in file:
                zip_file = os.path.join(loc, file)
                print(f"[v0] Found ZIP: {zip_file}")
                break
    if zip_file:
        break

if not zip_file:
    # Search more broadly
    for root, dirs, files in os.walk("/"):
        # Skip certain directories
        if any(skip in root for skip in ['/sys', '/proc', '/dev', '.git']):
            continue
        
        for file in files:
            if file == 'Joebek-Auto-mart-pos-mvp-main.zip':
                zip_file = os.path.join(root, file)
                print(f"[v0] Found ZIP: {zip_file}")
                break
        
        if zip_file:
            break

if not zip_file:
    print("[v0] ERROR: ZIP file not found!")
    exit(1)

print(f"[v0] ZIP found at: {zip_file}")

# Get the directory containing the ZIP
project_root = os.path.dirname(zip_file)
print(f"[v0] Project root: {project_root}")

# Extract
print(f"[v0] Extracting...")
os.chdir(project_root)
result = subprocess.run(['unzip', '-q', zip_file], capture_output=True, text=True)

if result.returncode != 0:
    print(f"[v0] Unzip error: {result.stderr}")
    exit(1)

print("[v0] Extraction complete")

# Find the extracted directory
extracted_dir = None
for item in os.listdir(project_root):
    full_path = os.path.join(project_root, item)
    if os.path.isdir(full_path) and 'Joebek' in item:
        extracted_dir = full_path
        print(f"[v0] Found extracted dir: {item}")
        break

if not extracted_dir:
    print("[v0] ERROR: Could not find extracted directory!")
    exit(1)

# Move contents
print(f"[v0] Moving files...")
for item in os.listdir(extracted_dir):
    src = os.path.join(extracted_dir, item)
    dst = os.path.join(project_root, item)
    
    if os.path.exists(dst):
        print(f"[v0]   Removing {item}")
        if os.path.isdir(dst):
            shutil.rmtree(dst)
        else:
            os.remove(dst)
    
    print(f"[v0]   Moving {item}")
    shutil.move(src, dst)

# Cleanup
print("[v0] Cleaning up...")
shutil.rmtree(extracted_dir)
os.remove(zip_file)

print("[v0] Done! Repository extracted successfully.")
