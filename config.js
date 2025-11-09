// API Configuration
const API_CONFIG = {
    // Use environment-specific API URL
    // In production, this will be set to your Render backend URL
    // In development, it uses localhost
    BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : 'https://insightx-backend.onrender.com', // Replace with your actual Render backend URL
    
    ENDPOINTS: {
        HEALTH: '/api/health',
        PREDICT: '/api/predict',
        MODEL_STATUS: '/api/models/status'
    }
};

// Helper function to get full API URL
function getApiUrl(endpoint) {
    return API_CONFIG.BASE_URL + endpoint;
}
