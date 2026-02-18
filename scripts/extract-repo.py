#!/usr/bin/env python3

# This script will be executed in /home/user but needs to extract from v0's context
# The zip file was copied to ensure it's accessible
# We'll extract it in place within the v0 project directory

import zipfile
import shutil
import os

# The v0 project context path - even though it's not directly accessible to this script,
# we can work with files v0 has copied into the execution environment
# Let's check if the zip was placed in home directory or if we need to work with a symlink

zip_paths_to_try = [
    '/vercel/share/v0-project/Joebek-Auto-mart-pos-mvp-main-copy.zip',
    '/home/user/Joebek-Auto-mart-pos-mvp-main.zip',
    '/tmp/Joebek-Auto-mart-pos-mvp-main.zip',
]

zip_file = None
for path in zip_paths_to_try:
    if os.path.exists(path):
        zip_file = path
        print(f"[v0] Found ZIP at: {zip_file}")
        break

if not zip_file:
    print("[v0] ERROR: Could not find ZIP file at any known location")
    print(f"[v0] Current directory: {os.getcwd()}")
    print(f"[v0] Files: {os.listdir('.')}")
    exit(1)

project_root = os.path.dirname(zip_file) if '/vercel' in zip_file else os.getcwd()
print(f"[v0] Using project root: {project_root}")

# Extract
print(f"[v0] Extracting {os.path.basename(zip_file)}...")
with zipfile.ZipFile(zip_file, 'r') as zip_ref:
    zip_ref.extractall(project_root)

print("[v0] Extraction complete")

# Find extracted directory
extracted_dir = None
for item in os.listdir(project_root):
    full_path = os.path.join(project_root, item)
    if os.path.isdir(full_path) and 'Joebek' in item:
        extracted_dir = full_path
        print(f"[v0] Found extracted: {item}")
        break

if not extracted_dir:
    print("[v0] ERROR: No extracted directory!")
    exit(1)

# Move contents
print(f"[v0] Moving files...")
for item in os.listdir(extracted_dir):
    src = os.path.join(extracted_dir, item)
    dst = os.path.join(project_root, item)
    
    if os.path.exists(dst):
        if os.path.isdir(dst):
            shutil.rmtree(dst)
        else:
            os.remove(dst)
    
    shutil.move(src, dst)
    print(f"[v0]   Moved: {item}")

# Cleanup
shutil.rmtree(extracted_dir)
os.remove(zip_file)
print("[v0] Success! Repository extracted.")
