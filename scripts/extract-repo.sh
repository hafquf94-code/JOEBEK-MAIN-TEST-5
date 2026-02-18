#!/bin/bash

# Find the ZIP file
ZIP_FILE=$(find / -name "Joebek-Auto-mart-pos-mvp-main.zip" -type f 2>/dev/null | head -1)

if [ -z "$ZIP_FILE" ]; then
    echo "[v0] ERROR: ZIP file not found"
    exit 1
fi

echo "[v0] Found ZIP: $ZIP_FILE"

# Get the directory containing the ZIP
PROJECT_ROOT=$(dirname "$ZIP_FILE")
echo "[v0] Project root: $PROJECT_ROOT"

# Extract
echo "[v0] Extracting..."
cd "$PROJECT_ROOT"
unzip -q "$ZIP_FILE"

if [ $? -ne 0 ]; then
    echo "[v0] ERROR: Extraction failed"
    exit 1
fi

echo "[v0] Extraction complete"

# Find the extracted directory
EXTRACTED_DIR=$(find "$PROJECT_ROOT" -maxdepth 1 -type d -name "*Joebek*" ! -name ".git" | head -1)

if [ -z "$EXTRACTED_DIR" ]; then
    echo "[v0] ERROR: Extracted directory not found"
    exit 1
fi

echo "[v0] Found extracted dir: $EXTRACTED_DIR"

# Move contents
echo "[v0] Moving files..."
for item in "$EXTRACTED_DIR"/*; do
    item_name=$(basename "$item")
    dst="$PROJECT_ROOT/$item_name"
    
    if [ -e "$dst" ]; then
        echo "[v0]   Removing existing $item_name"
        rm -rf "$dst"
    fi
    
    echo "[v0]   Moving $item_name"
    mv "$item" "$dst"
done

# Cleanup
echo "[v0] Cleaning up..."
rmdir "$EXTRACTED_DIR" 2>/dev/null || rm -rf "$EXTRACTED_DIR"
rm "$ZIP_FILE"

echo "[v0] Done! Repository extracted successfully."
