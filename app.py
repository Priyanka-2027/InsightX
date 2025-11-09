from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import torch
import torchvision.transforms as transforms
from PIL import Image
import numpy as np
import io
import base64
import os

# Custom object scope for handling old Keras models
def custom_input_layer(*args, **kwargs):
    # Convert batch_shape to shape if present
    if 'batch_shape' in kwargs:
        kwargs['shape'] = kwargs.pop('batch_shape')[1:]  # Remove batch dimension
    return tf.keras.layers.InputLayer(*args, **kwargs)

app = Flask(__name__)
CORS(app)

# Model paths - adjust relative to project root
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

MODEL_PATHS = {
    'brain': os.path.join(PROJECT_ROOT, 'Brain', 'brain_model.h5'),
    'chest': os.path.join(PROJECT_ROOT, 'Chest', 'models', 'densenet121_rsna.pth'),
    'kidney': os.path.join(PROJECT_ROOT, 'Kidney', 'mobilenet_kidney_classifier.pth'),
    'bone': os.path.join(PROJECT_ROOT, 'Bone', 'bone_model.h5')
}

# Store loaded models
models = {}

# Class labels for each model (updated from notebook analysis)
CLASS_LABELS = {
    'brain': ['glioma', 'meningioma', 'notumor', 'pituitary'],
    'chest': [
        'Atelectasis', 'Consolidation', 'Infiltration', 'Pneumothorax', 
        'Edema', 'Emphysema', 'Fibrosis', 'Effusion', 'Pneumonia',
        'Pleural_Thickening', 'Cardiomegaly', 'Nodule', 'Mass', 'Hernia', 
        'Lung Lesion', 'Fracture', 'Lung Opacity', 'Enlarged Cardiomediastinum'
    ],
    'kidney': ['Normal', 'Kidney Stone'],
    'bone': ['fractured', 'normal']
}

def load_brain_model():
    """Load Brain Tumor model (TensorFlow/Keras) - Converted model"""
    try:
        import tensorflow as tf
        # Load converted model (no custom_objects needed)
        model = tf.keras.models.load_model(MODEL_PATHS['brain'], compile=False)
        print("Brain model loaded successfully")
        return model
    except Exception as e:
        print(f"Error loading brain model: {e}")
        return None

def load_chest_model():
    """Load Chest model (PyTorch with torchxrayvision)"""
    try:
        import torchxrayvision as xrv
        
        # Load the pretrained DenseNet121-RSNA model
        model = xrv.models.DenseNet(weights="densenet121-res224-rsna")
        
        # Load custom weights if they exist
        if os.path.exists(MODEL_PATHS['chest']):
            state_dict = torch.load(MODEL_PATHS['chest'], map_location=torch.device('cpu'))
            
            # Remove 'model.' prefix from keys if present
            new_state_dict = {}
            for k, v in state_dict.items():
                if k.startswith('model.'):
                    new_state_dict[k[6:]] = v  # Remove 'model.' prefix
                else:
                    new_state_dict[k] = v
            
            model.load_state_dict(new_state_dict, strict=False)
            print("Loaded custom chest model weights")
        else:
            print("Using pretrained torchxrayvision weights")
        
        model.eval()
        print("Chest model loaded successfully")
        return model
    except Exception as e:
        print(f"Error loading chest model: {e}")
        return None

def load_kidney_model():
    """Load Kidney model (PyTorch)"""
    try:
        import torchvision.models as models
        model = models.mobilenet_v2(pretrained=False)
        # Adjust the classifier for your number of classes
        num_classes = len(CLASS_LABELS['kidney'])
        model.classifier[1] = torch.nn.Linear(model.classifier[1].in_features, num_classes)
        
        # Load state dict and remove 'model.' prefix if present
        state_dict = torch.load(MODEL_PATHS['kidney'], map_location=torch.device('cpu'))
        new_state_dict = {}
        for k, v in state_dict.items():
            if k.startswith('model.'):
                new_state_dict[k[6:]] = v  # Remove 'model.' prefix
            else:
                new_state_dict[k] = v
        
        model.load_state_dict(new_state_dict, strict=False)
        model.eval()
        print("Kidney model loaded successfully")
        return model
    except Exception as e:
        print(f"Error loading kidney model: {e}")
        return None

def load_bone_model():
    """Load Bone Fracture model (TensorFlow/Keras) - Converted model"""
    try:
        import tensorflow as tf
        # Load converted model (no custom_objects needed)
        model = tf.keras.models.load_model(MODEL_PATHS['bone'], compile=False)
        print("Bone model loaded successfully")
        return model
    except Exception as e:
        print(f"Error loading bone model: {e}")
        return None

# Load all models on startup
def initialize_models():
    models['brain'] = load_brain_model()
    models['chest'] = load_chest_model()
    models['kidney'] = load_kidney_model()
    models['bone'] = load_bone_model()

def preprocess_image_tensorflow(image_bytes, target_size=(224, 224)):
    """Preprocess image for TensorFlow models (Brain and Bone)"""
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize(target_size)
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

def preprocess_image_chest(image_bytes, target_size=(224, 224)):
    """Preprocess image for Chest X-ray model (torchxrayvision)"""
    import torchxrayvision as xrv
    import skimage.io
    
    # Load image
    img = Image.open(io.BytesIO(image_bytes))
    
    # Convert to numpy array
    img_array = np.array(img)
    
    # Convert to grayscale if needed
    if len(img_array.shape) == 3:
        img_array = img_array[:, :, 0]
    
    # Normalize using xrv normalization
    img_array = xrv.datasets.normalize(img_array, 255)
    
    # Add channel dimension
    img_array = img_array[None, :, :]
    
    # Apply center crop
    transform = transforms.Compose([xrv.datasets.XRayCenterCrop()])
    img_array = transform(img_array)
    
    # Convert to tensor
    img_tensor = torch.from_numpy(img_array).unsqueeze(0)
    return img_tensor

def preprocess_image_pytorch(image_bytes, target_size=(224, 224)):
    """Preprocess image for PyTorch models (Kidney)"""
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    
    transform = transforms.Compose([
        transforms.Resize(target_size),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    img_tensor = transform(img).unsqueeze(0)
    return img_tensor

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        body_part = data.get('bodyPart')
        image_data = data.get('image')
        
        if not body_part or not image_data:
            return jsonify({'error': 'Missing bodyPart or image data'}), 400
        
        if body_part not in models or models[body_part] is None:
            return jsonify({'error': f'Model for {body_part} not loaded'}), 500
        
        # Remove data URL prefix if present
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # Decode base64 image
        image_bytes = base64.b64decode(image_data)
        
        # Get model and make prediction
        model = models[body_part]
        
        if body_part == 'brain':
            # Brain model - EfficientNetB0 (299x299)
            processed_image = preprocess_image_tensorflow(image_bytes, target_size=(299, 299))
            predictions = model.predict(processed_image, verbose=0)[0]
            
        elif body_part == 'bone':
            # Bone model - ResNet50 (224x224)
            processed_image = preprocess_image_tensorflow(image_bytes, target_size=(224, 224))
            predictions = model.predict(processed_image, verbose=0)[0]
            
        elif body_part == 'chest':
            # Chest X-ray model (torchxrayvision)
            processed_image = preprocess_image_chest(image_bytes)
            with torch.no_grad():
                outputs = model(processed_image).cpu()
                predictions = outputs[0].detach().numpy()
        
        elif body_part == 'kidney':
            # Kidney PyTorch model
            processed_image = preprocess_image_pytorch(image_bytes)
            with torch.no_grad():
                outputs = model(processed_image)
                predictions = torch.nn.functional.softmax(outputs, dim=1)[0].numpy()
        
        # Prepare results
        results = {}
        labels = CLASS_LABELS[body_part]
        
        for i, label in enumerate(labels):
            results[label] = float(predictions[i] * 100)  # Convert to percentage
        
        # Get top prediction
        top_class_idx = np.argmax(predictions)
        top_class = labels[top_class_idx]
        confidence = float(predictions[top_class_idx] * 100)
        
        return jsonify({
            'success': True,
            'bodyPart': body_part,
            'prediction': top_class,
            'confidence': confidence,
            'probabilities': results
        })
        
    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/models/status', methods=['GET'])
def models_status():
    """Check which models are loaded"""
    status = {}
    for part, model in models.items():
        status[part] = 'loaded' if model is not None else 'not loaded'
    return jsonify(status)

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'InsightX AI Backend is running'})

if __name__ == '__main__':
    print("Initializing models...")
    initialize_models()
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=5000, debug=True)
