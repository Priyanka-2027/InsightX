// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    
    // Recreate charts with updated theme colors
    if (typeof createMetricCharts === 'function') {
        createMetricCharts();
    }
    if (typeof createComparisonChart === 'function') {
        createComparisonChart();
    }
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
}

// Hero CTA Button
const heroCTA = document.querySelector('.hero-cta');
if (heroCTA) {
    heroCTA.addEventListener('click', () => {
        const bodyPartSelection = document.getElementById('bodyPartSelection');
        if (bodyPartSelection) {
            // Scroll with offset to show the title
            const yOffset = -100; // Adjust this value to show more/less space above
            const y = bodyPartSelection.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    });
}

// Navigation
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        
        // Update active states
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Show target section
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetId) {
                section.classList.add('active');
            }
        });
        
        // Scroll to top when changing sections
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Reset home section to initial state when navigating to it
        if (targetId === 'home') {
            const heroSection = document.querySelector('.hero');
            const howItWorks = document.querySelector('.how-it-works');
            const bodyPartSelection = document.getElementById('bodyPartSelection');
            const whyChoose = document.querySelector('.why-choose');
            const uploadSection = document.getElementById('uploadSection');
            const resultsSection = document.getElementById('resultsSection');
            
            heroSection.classList.remove('hidden');
            howItWorks.classList.remove('hidden');
            bodyPartSelection.classList.remove('hidden');
            whyChoose.classList.remove('hidden');
            uploadSection.classList.add('hidden');
            resultsSection.classList.add('hidden');
        }
    });
});

// Body Part Selection
const bodyCards = document.querySelectorAll('.body-card');
const bodyPartSelection = document.getElementById('bodyPartSelection');
const uploadSection = document.getElementById('uploadSection');
const uploadTitle = document.getElementById('uploadTitle');
const howItWorks = document.querySelector('.how-it-works');
const whyChoose = document.querySelector('.why-choose');
const heroSection = document.querySelector('.hero');
let selectedBodyPart = '';

bodyCards.forEach(card => {
    card.addEventListener('click', () => {
        selectedBodyPart = card.dataset.part;
        const partName = card.querySelector('h3').textContent;
        uploadTitle.textContent = `Upload ${partName} X-ray Scan`;
        
        // Hide all initial sections
        heroSection.classList.add('hidden');
        howItWorks.classList.add('hidden');
        bodyPartSelection.classList.add('hidden');
        whyChoose.classList.add('hidden');
        
        // Show upload section
        uploadSection.classList.remove('hidden');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Back Button
document.getElementById('backBtn').addEventListener('click', () => {
    uploadSection.classList.add('hidden');
    
    // Show all initial sections
    heroSection.classList.remove('hidden');
    howItWorks.classList.remove('hidden');
    bodyPartSelection.classList.remove('hidden');
    whyChoose.classList.remove('hidden');
    
    resetUpload();
});

document.getElementById('resultsBackBtn').addEventListener('click', () => {
    document.getElementById('resultsSection').classList.add('hidden');
    
    // Show all initial sections
    heroSection.classList.remove('hidden');
    howItWorks.classList.remove('hidden');
    bodyPartSelection.classList.remove('hidden');
    whyChoose.classList.remove('hidden');
    
    resetUpload();
});

// File Upload
const fileInput = document.getElementById('fileInput');
const uploadZone = document.getElementById('uploadZone');
const previewZone = document.getElementById('previewZone');
const previewImage = document.getElementById('previewImage');
const removeBtn = document.getElementById('removeBtn');
const predictBtn = document.getElementById('predictBtn');

uploadZone.addEventListener('click', () => fileInput.click());

uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = 'var(--text-primary)';
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.style.borderColor = 'var(--border)';
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = 'var(--border)';
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFile(file);
    }
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
});

function handleFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        uploadZone.classList.add('hidden');
        previewZone.classList.remove('hidden');
        predictBtn.disabled = false;
    };
    reader.readAsDataURL(file);
}

removeBtn.addEventListener('click', () => {
    resetUpload();
});

function resetUpload() {
    fileInput.value = '';
    previewImage.src = '';
    uploadZone.classList.remove('hidden');
    previewZone.classList.add('hidden');
    predictBtn.disabled = true;
}

// Predict Button
predictBtn.addEventListener('click', async () => {
    predictBtn.textContent = 'Analyzing...';
    predictBtn.disabled = true;
    
    try {
        // Get the image data from the preview
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = previewImage;
        
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        
        // Convert to base64
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        
        // Call the backend API
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PREDICT), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bodyPart: selectedBodyPart,
                image: imageData
            })
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        
        const apiResult = await response.json();
        
        if (!apiResult.success) {
            throw new Error(apiResult.error || 'Prediction failed');
        }
        
        // Map body part to icon
        const iconMap = {
            chest: '🫁',
            brain: '🧠',
            kidney: '🩺',
            bone: '🦴'
        };
        
        // Generate analysis text based on prediction
        const analysisTexts = {
            chest: {
                'Atelectasis': 'The chest X-ray shows atelectasis (partial collapse of the lung). This may indicate airway obstruction or compression.',
                'Consolidation': 'The chest X-ray shows consolidation in the lung tissue, suggesting infection or inflammation.',
                'Infiltration': 'The chest X-ray reveals infiltration patterns in the lung fields, which may indicate infection or inflammation.',
                'Pneumothorax': 'The chest X-ray shows pneumothorax (collapsed lung). Air in the pleural space is detected.',
                'Edema': 'The chest X-ray shows pulmonary edema with fluid accumulation in the lungs.',
                'Emphysema': 'The chest X-ray demonstrates findings consistent with emphysema and chronic lung disease.',
                'Fibrosis': 'The chest X-ray shows pulmonary fibrosis with scarring of lung tissue.',
                'Effusion': 'The chest X-ray reveals pleural effusion with fluid accumulation around the lungs.',
                'Pneumonia': 'The chest X-ray shows infiltrates consistent with pneumonia. Increased opacity detected.',
                'Pleural_Thickening': 'The chest X-ray shows pleural thickening, which may indicate chronic inflammation.',
                'Cardiomegaly': 'The chest X-ray demonstrates cardiomegaly (enlarged heart). Further cardiac evaluation recommended.',
                'Nodule': 'The chest X-ray shows a pulmonary nodule. Follow-up imaging may be required.',
                'Mass': 'The chest X-ray reveals a mass in the lung field requiring further evaluation.',
                'Hernia': 'The chest X-ray shows findings consistent with a hiatal hernia.',
                'Lung Lesion': 'The chest X-ray reveals a lung lesion requiring additional investigation.',
                'Fracture': 'The chest X-ray shows evidence of rib or chest wall fracture.',
                'Lung Opacity': 'The chest X-ray demonstrates lung opacity that requires clinical correlation.',
                'Enlarged Cardiomediastinum': 'The chest X-ray shows enlargement of the cardiomediastinal silhouette.'
            },
            brain: {
                'glioma': 'MRI scan reveals findings consistent with glioma. The lesion shows irregular borders with surrounding edema.',
                'meningioma': 'MRI scan shows findings consistent with meningioma. Well-circumscribed mass with characteristic enhancement pattern.',
                'notumor': 'MRI scan appears normal. No masses, lesions, or abnormal enhancement patterns detected.',
                'pituitary': 'MRI scan shows findings in the pituitary region consistent with pituitary adenoma.'
            },
            kidney: {
                'Normal': 'The imaging appears normal. Both kidneys show normal size, shape, and position. No masses or stones detected.',
                'Kidney Stone': 'Imaging reveals a kidney stone (calculus). The stone is visible in the renal collecting system.'
            },
            bone: {
                'fractured': 'X-ray reveals a fracture. The fracture line is clearly visible with possible displacement noted.',
                'normal': 'X-ray appears normal. No fracture lines, dislocations, or significant bone abnormalities detected.'
            }
        };
        
        // Prepare result object
        const result = {
            diagnosis: apiResult.prediction,
            confidence: apiResult.confidence,
            analysis: analysisTexts[selectedBodyPart][apiResult.prediction] || 'Analysis completed. Please consult with a healthcare professional for detailed interpretation.',
            icon: iconMap[selectedBodyPart],
            probabilities: apiResult.probabilities
        };
        
        showResults(result);
        
    } catch (error) {
        console.error('Prediction error:', error);
        alert(`Error during prediction: ${error.message}\n\nPlease make sure:\n1. The Flask backend is running\n2. The server is accessible at ${API_CONFIG.BASE_URL}\n3. All models are loaded successfully`);
        predictBtn.textContent = 'Analyze Scan';
        predictBtn.disabled = false;
    }
});

function showResults(result) {
    // Hide upload, show results
    uploadSection.classList.add('hidden');
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.classList.remove('hidden');
    
    // Set diagnosis
    document.getElementById('diagnosisIcon').textContent = result.icon;
    document.getElementById('diagnosisName').textContent = result.diagnosis;
    
    // Set confidence
    const confidenceFill = document.getElementById('confidenceFill');
    const confidenceValue = document.getElementById('confidenceValue');
    confidenceFill.style.width = result.confidence + '%';
    confidenceValue.textContent = result.confidence + '%';
    
    // Set analysis
    document.getElementById('analysisText').textContent = result.analysis;
    
    // Set analyzed image
    document.getElementById('analyzedImage').src = previewImage.src;
    
    // Create probability chart
    createProbabilityChart(result.probabilities);
    
    predictBtn.textContent = 'Analyze Image';
    predictBtn.disabled = false;
}

function createProbabilityChart(probabilities) {
    const ctx = document.getElementById('resultChart').getContext('2d');
    
    // Destroy existing chart if any
    if (window.probabilityChart) {
        window.probabilityChart.destroy();
    }
    
    const isDark = document.body.classList.contains('dark-mode');
    const textColor = isDark ? '#f5f5f7' : '#1d1d1f';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    window.probabilityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(probabilities),
            datasets: [{
                label: 'Probability (%)',
                data: Object.values(probabilities),
                backgroundColor: [
                    'rgba(52, 199, 89, 0.6)',
                    'rgba(255, 59, 48, 0.6)',
                    'rgba(255, 149, 0, 0.6)',
                    'rgba(90, 200, 250, 0.6)'
                ],
                borderColor: [
                    'rgba(52, 199, 89, 1)',
                    'rgba(255, 59, 48, 1)',
                    'rgba(255, 149, 0, 1)',
                    'rgba(90, 200, 250, 1)'
                ],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            family: 'Barlow'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            family: 'Barlow'
                        }
                    }
                }
            }
        }
    });
}

// Metrics Charts
function createMetricCharts() {
    const metricCharts = document.querySelectorAll('.metric-chart');
    const isDark = document.body.classList.contains('dark-mode');
    const textColor = isDark ? '#f5f5f7' : '#1d1d1f';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    metricCharts.forEach(canvas => {
        const chartType = canvas.dataset.chart;
        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart instance if it exists
        if (canvas.chartInstance) {
            canvas.chartInstance.destroy();
        }
        
        canvas.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Epoch 1', 'Epoch 5', 'Epoch 10', 'Epoch 15', 'Epoch 20'],
                datasets: [{
                    label: 'Training Accuracy',
                    data: [75, 85, 92, 95, 97],
                    borderColor: 'rgba(52, 199, 89, 1)',
                    backgroundColor: 'rgba(52, 199, 89, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Validation Accuracy',
                    data: [73, 83, 90, 93, 96],
                    borderColor: 'rgba(90, 200, 250, 1)',
                    backgroundColor: 'rgba(90, 200, 250, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: {
                            color: textColor,
                            font: {
                                family: 'Barlow'
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: textColor,
                            font: {
                                family: 'Barlow'
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: textColor,
                            font: {
                                family: 'Barlow'
                            }
                        }
                    }
                }
            }
        });
    });
}

// Comparison Chart
function createComparisonChart() {
    const canvas = document.getElementById('comparisonChart');
    if (!canvas) {
        console.error('Comparison chart canvas not found');
        return;
    }
    
    // Ensure canvas is visible
    canvas.style.display = 'block';
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Cannot get canvas context');
        return;
    }
    
    const isDark = document.body.classList.contains('dark-mode');
    const textColor = isDark ? '#f5f5f7' : '#1d1d1f';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    // Destroy existing chart if any
    if (window.comparisonChartInstance) {
        window.comparisonChartInstance.destroy();
    }
    
    console.log('Creating comparison chart...');
    
    window.comparisonChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Accuracy', 'Precision', 'Recall', 'F1-Score', 'Speed'],
            datasets: [{
                label: 'Chest',
                data: [96.5, 95.8, 97.2, 96.5, 92],
                backgroundColor: 'rgba(52, 199, 89, 0.45)',
                borderColor: 'rgba(52, 199, 89, 0.85)',
                borderWidth: 2
            }, {
                label: 'Brain',
                data: [90.0, 89.5, 91.2, 90.3, 88],
                backgroundColor: 'rgba(255, 159, 107, 0.45)',
                borderColor: 'rgba(255, 159, 107, 0.85)',
                borderWidth: 2
            }, {
                label: 'Kidney',
                data: [94.8, 94.2, 95.4, 94.8, 95],
                backgroundColor: 'rgba(255, 214, 102, 0.45)',
                borderColor: 'rgba(255, 214, 102, 0.85)',
                borderWidth: 2
            }, {
                label: 'Bone',
                data: [94.12, 93.8, 94.5, 94.1, 90],
                backgroundColor: 'rgba(90, 200, 250, 0.45)',
                borderColor: 'rgba(90, 200, 250, 0.85)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2.5,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor,
                        font: {
                            family: 'Barlow',
                            size: 14,
                            weight: '500'
                        },
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: isDark ? 'rgba(50, 50, 50, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    titleColor: textColor,
                    bodyColor: textColor,
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            family: 'Barlow',
                            size: 13,
                            weight: '500'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: gridColor,
                        drawBorder: false
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            family: 'Barlow',
                            size: 12
                        },
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Initialize charts when metrics section is active
const metricsLink = document.querySelector('a[href="#metrics"]');
metricsLink.addEventListener('click', () => {
    setTimeout(() => {
        createMetricCharts();
        createComparisonChart();
    }, 100);
});

// Theme change - update charts
themeToggle.addEventListener('click', () => {
    setTimeout(() => {
        if (document.getElementById('metrics').classList.contains('active')) {
            createMetricCharts();
            createComparisonChart();
        }
        if (window.probabilityChart) {
            const result = {
                probabilities: window.probabilityChart.data.datasets[0].data.reduce((acc, val, idx) => {
                    acc[window.probabilityChart.data.labels[idx]] = val;
                    return acc;
                }, {})
            };
            createProbabilityChart(result.probabilities);
        }
    }, 100);
});

// Navigate to Home function
function navigateToHome() {
    // Click the home/predict navigation link
    const homeLink = document.querySelector('.nav-links a[href="#home"]');
    if (homeLink) {
        homeLink.click();
    }
}

// Initialize charts on page load if metrics section is visible
window.addEventListener('load', () => {
    const metricsSection = document.getElementById('metrics');
    if (metricsSection && metricsSection.classList.contains('active')) {
        setTimeout(() => {
            createMetricCharts();
            createComparisonChart();
        }, 200);
    }
});
