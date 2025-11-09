#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Optional: Download models from cloud storage
# Uncomment the line below if you've configured download_models.py
# python download_models.py

# Note: Model files should be uploaded separately or downloaded from cloud storage
# Due to their large size (277MB total), they cannot be included in git repository
echo "Backend build completed. Ensure model files are available in the correct directories."
