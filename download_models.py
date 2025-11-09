"""
Model downloader for InsightX deployment
This script downloads model files from cloud storage on first run
"""
import os
import requests
from pathlib import Path

# Configure your model URLs here
MODEL_URLS = {
    'brain': 'YOUR_CLOUD_STORAGE_URL/brain_model.h5',
    'chest': 'YOUR_CLOUD_STORAGE_URL/densenet121_rsna.pth',
    'kidney': 'YOUR_CLOUD_STORAGE_URL/mobilenet_kidney_classifier.pth',
    'bone': 'YOUR_CLOUD_STORAGE_URL/bone_model.h5'
}

# Model paths (same as in app.py)
MODEL_PATHS = {
    'brain': 'Brain/brain_model.h5',
    'chest': 'Chest/models/densenet121_rsna.pth',
    'kidney': 'Kidney/mobilenet_kidney_classifier.pth',
    'bone': 'Bone/bone_model.h5'
}

def download_file(url, destination, chunk_size=8192):
    """Download a file from URL to destination with progress"""
    if url.startswith('YOUR_'):
        print(f"⚠️  Skipping {destination} - Please configure MODEL_URLS in download_models.py")
        return False
    
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        total_size = int(response.headers.get('content-length', 0))
        
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(destination), exist_ok=True)
        
        print(f"📥 Downloading {destination}... ({total_size / 1024 / 1024:.2f} MB)")
        
        downloaded = 0
        with open(destination, 'wb') as f:
            for chunk in response.iter_content(chunk_size=chunk_size):
                if chunk:
                    f.write(chunk)
                    downloaded += len(chunk)
                    if total_size > 0:
                        progress = (downloaded / total_size) * 100
                        print(f"\rProgress: {progress:.1f}%", end='', flush=True)
        
        print(f"\n✅ Downloaded {destination}")
        return True
        
    except Exception as e:
        print(f"\n❌ Error downloading {destination}: {e}")
        return False

def main():
    """Download all models if they don't exist"""
    print("🚀 InsightX Model Downloader")
    print("=" * 50)
    
    all_exist = True
    for model_name, path in MODEL_PATHS.items():
        if not os.path.exists(path):
            all_exist = False
            break
    
    if all_exist:
        print("✅ All model files already exist!")
        return
    
    print("\n⚠️  IMPORTANT: Configure MODEL_URLS in download_models.py first!")
    print("Upload your model files to cloud storage and add the URLs.\n")
    
    success_count = 0
    for model_name, path in MODEL_PATHS.items():
        if os.path.exists(path):
            print(f"✅ {model_name}: Already exists at {path}")
            success_count += 1
        else:
            url = MODEL_URLS.get(model_name)
            if url and download_file(url, path):
                success_count += 1
    
    print("\n" + "=" * 50)
    print(f"Downloaded {success_count}/{len(MODEL_PATHS)} models")
    
    if success_count == len(MODEL_PATHS):
        print("✅ All models ready!")
    else:
        print("⚠️  Some models are missing. Please check the URLs and try again.")

if __name__ == '__main__':
    main()
