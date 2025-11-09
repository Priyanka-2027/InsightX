# 🏥 InsightX AI - Medical Imaging Analysis Platform

> An AI-powered web application for analyzing medical imaging scans including Brain MRI, Chest X-rays, Kidney CT scans, and Bone fracture detection.

🌐 **Live Demo:** [InsightX](https://chanu716.github.io/InsightX/)

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Model Information](#model-information)
- [API Documentation](#api-documentation)
- [Technologies Used](#technologies-used)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Disclaimer](#disclaimer)
- [Team](#team)

---

## 🎯 Overview

**InsightX AI** is a comprehensive medical imaging analysis platform that leverages deep learning models to assist in the detection and classification of various medical conditions from imaging scans. The platform provides an intuitive web interface where users can upload medical images and receive AI-powered predictions with confidence scores.

### Supported Analysis Types:
- 🧠 **Brain Tumor Detection** - MRI scan analysis for tumor classification
- 🫁 **Chest X-ray Analysis** - Detection of multiple pulmonary conditions
- 🩺 **Kidney Stone Detection** - CT scan analysis for kidney abnormalities
- 🦴 **Bone Fracture Detection** - X-ray analysis for fracture identification

---

## ✨ Features

- **Multi-Model Architecture**: Four specialized deep learning models for different body parts
- **Real-time Predictions**: Fast inference with confidence scores and probabilities
- **Modern UI/UX**: Responsive design with light/dark mode support
- **RESTful API**: Well-documented API endpoints for integration
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Model Health Monitoring**: Built-in endpoint to check model loading status

---

## 📁 Project Structure

```
InsightX/
│
├── app.py                      # Flask backend server
├── index.html                  # Main frontend interface
├── script.js                   # Frontend JavaScript logic
├── styles.css                  # UI styling
├── requirements.txt            # Python dependencies
├── README.md                   # Project documentation
│
├── Brain/                      # Brain tumor detection
│   ├── brain_model.h5         # Trained Keras model
│   ├── brain-tumor-mri.ipynb  # Training notebook
│   ├── Dataset/               # Training & testing data
│   │   ├── Training/          # (glioma, meningioma, notumor, pituitary)
│   │   └── Testing/
│   └── logs/                  # TensorBoard logs
│
├── Chest/                      # Chest X-ray analysis
│   ├── chest.ipynb            # Training notebook
│   ├── models/
│   │   └── densenet121_rsna.pth  # PyTorch model weights
│   └── data/                  # Sample X-ray images
│
├── Kidney/                     # Kidney stone detection
│   ├── kidney_test.ipynb      # Testing notebook
│   ├── mobilenet_kidney_classifier.pth  # PyTorch model
│   └── data/                  # Test images
│
├── Bone/                       # Bone fracture detection
│   ├── bone_model.h5          # Trained Keras model
│   ├── bone_fracture_detector.ipynb
│   ├── train_fracture_model.ipynb
│   ├── test_fracture_models.ipynb
│   ├── train_combined_datasets.ipynb
│   ├── Dataset/               # Fracture/Normal images
│   └── test_images/           # Sample test images
│
└── logos/                      # UI icons and images
    ├── brain.png
    ├── chest.png
    ├── kidney.png
    └── bones.png
```

---

## 🚀 Installation

### Prerequisites
- Python 3.8 or higher
- pip package manager
- 8GB+ RAM recommended
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Step 1: Clone the Repository
```bash
git clone https://github.com/Chanu716/InsightX.git
cd InsightX
```

### Step 2: Install Python Dependencies
```bash
pip install -r requirements.txt
```

**Required Packages:**
- `flask==3.0.0` - Web framework
- `flask-cors==4.0.0` - Cross-Origin Resource Sharing
- `tensorflow-cpu==2.20.0` - Brain & Bone models (CPU-optimized)
- `torch==2.6.0+cpu` - Chest & Kidney models (CPU-optimized)
- `torchvision==0.21.0+cpu` - Image transformations
- `torchxrayvision==1.2.0` - Chest X-ray preprocessing
- `scikit-image==0.21.0` - Image processing
- `Pillow==10.1.0` - Image handling
- `numpy==1.24.3` - Numerical operations
- `gunicorn==21.2.0` - Production WSGI server

### Step 3: Verify Model Files

Ensure all model files are present:
```bash
# Check model files exist
Brain/brain_model.h5                    # ~500MB
Chest/densenet121_rsna.pth              # ~28MB
Kidney/mobilenet_kidney_classifier.pth  # ~9MB
Bone/bone_model.h5                      # ~100MB
```

---

## 🎮 Usage

### Starting the Backend Server

1. **Start Flask Backend:**
```bash
python app.py
```

The server will start on `http://localhost:5000`

You should see:
```
Initializing models...
Brain model loaded successfully
Chest model loaded successfully
Kidney model loaded successfully
Bone model loaded successfully
Starting Flask server...
 * Running on http://0.0.0.0:5000
```

2. **Verify Models are Loaded:**

Open your browser and visit:
```
http://localhost:5000/api/models/status
```

Expected response:
```json
{
  "brain": "loaded",
  "chest": "loaded",
  "kidney": "loaded",
  "bone": "loaded"
}
```

### Starting the Frontend

**Option 1: Python HTTP Server**
```bash
python -m http.server 8000
```

**Option 2: Live Server (VS Code Extension)**
- Right-click on `index.html`
- Select "Open with Live Server"

**Option 3: Direct File Access**
- Simply open `index.html` in your browser

### Using the Application

1. **Open the Web Interface:**
   - Navigate to `http://localhost:8000` (or your frontend URL)

2. **Select Body Part:**
   - Click on one of the four cards: Brain, Chest, Kidney, or Bone

3. **Upload Medical Image:**
   - Click "Choose File" or drag and drop
   - Supported formats: JPEG, PNG, JPG

4. **Get Prediction:**
   - Click "Analyze Scan"
   - View results with confidence scores and probabilities

---

## 🧠 Model Information

### Brain Tumor Model (`brain_model.h5`)
- **Architecture**: EfficientNetB0 (Custom)
- **Input Size**: 299x299 pixels
- **Classes**: 
  - Glioma
  - Meningioma
  - No Tumor
  - Pituitary
- **Framework**: TensorFlow/Keras
- **Training Dataset**: Brain MRI images from Kaggle

### Chest X-ray Model (`densenet121_rsna.pth`)
- **Architecture**: DenseNet121 with torchxrayvision
- **Input Size**: 224x224 pixels
- **Classes** (18 conditions):
  - Atelectasis, Consolidation, Infiltration, Pneumothorax
  - Edema, Emphysema, Fibrosis, Effusion, Pneumonia
  - Pleural Thickening, Cardiomegaly, Nodule, Mass, Hernia
  - Lung Lesion, Fracture, Lung Opacity, Enlarged Cardiomediastinum
- **Framework**: PyTorch
- **Pretrained**: RSNA Pneumonia Detection Challenge

### Kidney Stone Model (`mobilenet_kidney_classifier.pth`)
- **Architecture**: MobileNetV2
- **Input Size**: 224x224 pixels
- **Classes**:
  - Normal
  - Kidney Stone
- **Framework**: PyTorch
- **Optimization**: Lightweight for mobile deployment

### Bone Fracture Model (`bone_model.h5`)
- **Architecture**: ResNet50 (Custom)
- **Input Size**: 224x224 pixels
- **Classes**:
  - Fractured
  - Normal
- **Framework**: TensorFlow/Keras
- **Training**: Combined multiple fracture datasets

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "message": "InsightX AI Backend is running"
}
```

#### 2. Model Status
```http
GET /api/models/status
```

**Response:**
```json
{
  "brain": "loaded",
  "chest": "loaded",
  "kidney": "loaded",
  "bone": "loaded"
}
```

#### 3. Predict
```http
POST /api/predict
Content-Type: application/json
```

**Request Body:**
```json
{
  "bodyPart": "brain",
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Parameters:**
- `bodyPart` (string): One of `"brain"`, `"chest"`, `"kidney"`, `"bone"`
- `image` (string): Base64 encoded image with data URL prefix

**Response:**
```json
{
  "success": true,
  "bodyPart": "brain",
  "prediction": "glioma",
  "confidence": 92.5,
  "probabilities": {
    "glioma": 92.5,
    "meningioma": 4.2,
    "notumor": 2.1,
    "pituitary": 1.2
  }
}
```

**Error Response:**
```json
{
  "error": "Model for brain not loaded"
}
```

---

## 🛠️ Technologies Used

### Backend
- **Flask** - Python web framework
- **TensorFlow 2.15** - Deep learning framework (Brain, Bone models)
- **PyTorch 2.1** - Deep learning framework (Chest, Kidney models)
- **torchxrayvision** - Medical imaging library
- **NumPy** - Numerical computing
- **Pillow** - Image processing

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with animations
- **Vanilla JavaScript** - Logic and API integration
- **Google Fonts** - Typography (Space Grotesk, Playfair Display)

### Machine Learning
- **EfficientNet** - Brain tumor classification
- **DenseNet121** - Chest X-ray analysis
- **MobileNetV2** - Kidney stone detection
- **ResNet50** - Bone fracture detection

---

## 🌐 Deployment

**Ready to deploy?** We've got you covered!

InsightX is deployed on **Railway** (backend) + **GitHub Pages** (frontend) for optimal performance.

### 🚀 Current Setup

- **Frontend:** GitHub Pages (Free, Global CDN, automatic deployment)
- **Backend:** Railway ($5/month after free trial, always-on, fast)

### 📖 Deployment Guide

See **[DEPLOY.md](DEPLOY.md)** for complete step-by-step instructions.

**Quick Deploy:**
1. Deploy backend on [Railway](https://railway.app) (~10 minutes)
2. Update `config.js` with Railway URL
3. Deploy frontend on [GitHub Pages](https://pages.github.com) (~2 minutes)

### Deployment Files Included:
- ✅ `railway.json` - Railway configuration
- ✅ `Procfile` - Process definition
- ✅ `runtime.txt` - Python version (3.11.9)
- ✅ `config.js` - Environment-aware API setup
- ✅ `.gitignore` & `.gitattributes` - Git LFS for models (277MB)

### Model Files Handling:
- Using **Git LFS** (Large File Storage)
- Models (277MB) automatically deployed with your code
- Already configured - just push and deploy!
---

## 🔧 Troubleshooting

### Models Not Loading

**Issue**: Models fail to load on startup

**Solutions:**
1. **Check model file paths:**
   ```python
   # Verify in app.py MODEL_PATHS dictionary
   'brain': 'Brain/brain_model.h5'
   'chest': 'Chest/densenet121_rsna.pth'
   'kidney': 'Kidney/mobilenet_kidney_classifier.pth'
   'bone': 'Bone/bone_model.h5'
   ```

2. **Verify file existence:**
   ```bash
   ls -la Brain/brain_model.h5
   ls -la Chest/densenet121_rsna.pth
   ls -la Kidney/mobilenet_kidney_classifier.pth
   ls -la Bone/bone_model.h5
   ```

3. **Check RAM availability:**
   - Models require ~2-3GB RAM total
   - Close other applications if low on memory

4. **Reinstall dependencies:**
   ```bash
   pip install --force-reinstall tensorflow torch torchvision
   ```

### CORS Errors

**Issue**: Cross-Origin Request Blocked

**Solutions:**
1. Ensure Flask-CORS is installed:
   ```bash
   pip install flask-cors
   ```

2. Check CORS is enabled in `app.py`:
   ```python
   from flask_cors import CORS
   CORS(app)
   ```

3. Run frontend and backend on proper ports (frontend: 8000, backend: 5000)

### Prediction Errors

**Issue**: Predictions fail or return errors

**Solutions:**
1. **Check image format:**
   - Supported: JPEG, PNG, JPG
   - Max size: 10MB recommended

2. **Verify image encoding:**
   - Must be base64 encoded
   - Include data URL prefix: `data:image/jpeg;base64,`

3. **Check backend logs:**
   - Look for error messages in Flask terminal
   - Enable debug mode: `app.run(debug=True)`

4. **Test with API directly:**
   ```bash
   curl -X POST http://localhost:5000/api/predict \
     -H "Content-Type: application/json" \
     -d '{"bodyPart":"brain","image":"data:image/jpeg;base64,..."}'
   ```

### Performance Issues

**Issue**: Slow predictions

**Solutions:**
1. **Use GPU acceleration:**
   - Install CUDA-enabled TensorFlow/PyTorch
   - Verify GPU availability:
   ```python
   import torch
   print(torch.cuda.is_available())
   ```

2. **Reduce image size:**
   - Frontend automatically resizes
   - Ensure images aren't unnecessarily large

3. **Enable model caching:**
   - Models are loaded once at startup
   - Restart server if memory issues occur

### Frontend Issues

**Issue**: UI not loading or displaying incorrectly

**Solutions:**
1. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

2. **Check browser console:**
   - F12 → Console tab
   - Look for JavaScript errors

3. **Verify file structure:**
   - Ensure `styles.css` and `script.js` are in root directory
   - Check logos folder has all images

---

## ⚠️ Disclaimer

**IMPORTANT MEDICAL DISCLAIMER:**

This application is a **demonstration project** and is intended for:
- Educational purposes
- Research and development
- Proof-of-concept demonstrations

**DO NOT USE FOR CLINICAL DIAGNOSIS OR TREATMENT DECISIONS**

- The AI models are not FDA-approved medical devices
- Results should not replace professional medical advice
- Always consult qualified healthcare professionals for medical decisions
- The models may produce false positives or false negatives
- Accuracy varies based on image quality and patient-specific factors

**Data Privacy:**
- No medical images are stored on the server
- All processing is done in-memory
- No patient data is logged or transmitted
- Use appropriate data protection measures if deploying

---

## 👥 Team

| Name                | Role                  | GitHub                                              | Gmail                       |
|---------------------|-----------------------|-----------------------------------------------------|-----------------------------|
| Priyanka J          | Data Scientist        | [@Priyanka-2027](https://github.com/Priyanka-2027)  | priyankaj1703@gmail.com     |
| Venkata Dinesh K    | Full Stack Developer  | [@venkatadinesh](https://github.com/venkatadinesh)  | venkatadineshk01@gmail.com  |
| Balaji M            | ML Engineer           | [@balajim701](https://github.com/balajim701)        | balajim701@gmail.com        |
| Chanikya K          | Data Scientist        | [@Chanu716](https://github.com/Chanu716)            | chanikyakorrakuti@gmail.com |

---

## � Model Improvement & Contributions

### Current Model Status

The models in this project are **functional but not perfect**. They serve as a proof-of-concept and baseline implementation for medical imaging analysis. We acknowledge that there is significant room for improvement in terms of:

- **Accuracy**: Models can benefit from more diverse training data
- **Robustness**: Performance may vary with different imaging conditions
- **Generalization**: Models trained on specific datasets may not generalize well to all scenarios
- **Edge Cases**: Some rare conditions or unusual presentations may not be detected accurately

### We Welcome Contributions! 🤝

If you're interested in improving these models, **you are welcome and encouraged to contribute!** Here's how you can help:

#### 1. **Model Improvements**
- Fine-tune existing models with additional datasets
- Experiment with different architectures
- Implement data augmentation techniques
- Optimize hyperparameters for better performance
- Add ensemble methods for improved accuracy

#### 2. **Dataset Enhancement**
- Contribute additional training data (while respecting privacy laws)
- Create balanced datasets to reduce bias
- Add diverse imaging conditions (different equipment, protocols)
- Include more edge cases and rare conditions

#### 3. **Code Optimization**
- Improve inference speed
- Reduce model size for deployment
- Add GPU acceleration support
- Implement batch processing
- Optimize preprocessing pipelines

#### 4. **Feature Additions**
- Add explainability features (Grad-CAM, attention maps)
- Implement confidence thresholds and uncertainty quantification
- Add model versioning and A/B testing
- Create automated model evaluation pipelines
- Develop comprehensive testing suites

### How to Contribute

1. **Fork the Repository**
   ```bash
   git clone https://github.com/Chanu716/InsightX.git
   cd InsightX
   ```

2. **Create a New Branch**
   ```bash
   git checkout -b feature/model-improvement
   ```

3. **Make Your Changes**
   - Train improved models
   - Update model files and paths
   - Document your changes and improvements
   - Include performance metrics comparison

4. **Test Thoroughly**
   - Validate on test datasets
   - Check for regressions
   - Ensure API compatibility

5. **Submit a Pull Request**
   - Describe your improvements
   - Include before/after metrics
   - Document any new dependencies
   - Add usage examples if applicable

### Contribution Guidelines

- **Document Everything**: Explain your approach, methodology, and results
- **Include Metrics**: Provide accuracy, precision, recall, F1-score comparisons
- **Maintain Compatibility**: Ensure changes don't break existing functionality
- **Follow Best Practices**: Use clean code, proper naming conventions
- **Test Extensively**: Include unit tests and integration tests
- **Respect Privacy**: Never commit real patient data or PHI

### Areas Needing Improvement

Priority areas where contributions would be most valuable:

1. **Brain Model**: Improve multi-class tumor classification accuracy
2. **Chest Model**: Better handling of subtle findings and overlapping conditions
3. **Kidney Model**: Expand classification beyond stones (add cysts, tumors)
4. **Bone Model**: Improve fracture localization and type classification
5. **General**: Add model interpretability and visualization features

---

## �📝 License

This project is for educational purposes. Please ensure compliance with medical data regulations (HIPAA, GDPR, etc.) if using with real patient data.

---


## 🙏 Acknowledgments

- Brain tumor dataset from Kaggle
- RSNA Pneumonia Detection Challenge
- PyTorch torchxrayvision library
- TensorFlow and Keras teams
- Medical imaging community

---

## 📮 Support

For issues, questions, or contributions:
1. Open an issue on GitHub
2. Submit a pull request
3. Contact via GitHub profile

---

**Last Updated**: November 9, 2025  
**Version**: 1.0.0
