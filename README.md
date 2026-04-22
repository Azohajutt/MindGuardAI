# Mental Health Risk Classifier (MindGuardAI)

## Overview
MindGuardAI is an advanced web-based application designed to perform mental health risk assessments. By leveraging machine learning, the application analyzes 24 distinct demographic, lifestyle, and psychological factors to predict mental health risk levels. It provides users with instant, data-driven insights and personalized recommendations.

## Features
* **Comprehensive Risk Assessment:** Evaluates 24 variables including sleep hours, physical activity, academic/work stress, and medical history.
* **Dynamic User Interface:** A responsive and interactive frontend that dynamically adjusts input fields based on user demographics (e.g., employment status).
* **High-Accuracy ML Model:** Utilizes a Random Forest Classifier trained with SMOTE balancing to handle class imbalances, achieving a 94.4% prediction accuracy.
* **Instant Feedback:** Generates visual probability charts and context-aware recommendations based on the predicted risk level.
* **Privacy Focused:** All assessments are processed in real-time without storing personal identifiable information.

## Technology Stack
**Backend:**
* Python 3
* Flask & Flask-CORS (REST API)
* Scikit-learn (Machine Learning)
* Pandas & NumPy (Data Processing)
* Imbalanced-learn (SMOTE balancing)

**Frontend:**
* HTML5 / CSS3 (Custom styling, CSS Grid/Flexbox)
* Vanilla JavaScript (DOM manipulation, API integration)
* Chart.js (Data visualization)

## Project Structure
```text
Mental-Health-Risk-Classifier/
├── backend/
│   ├── app.py                   # Flask server and API endpoints
│   ├── model_train.py           # Script to train and export the ML model
│   ├── requirements.txt         # Python dependencies
│   └── *.pkl                    # Exported model, scaler, and label encoders
├── frontend/
│   ├── index.html               # Landing page and dashboard
│   ├── predict.html             # Risk assessment form
│   ├── about.html               # Project information
│   ├── css/
│   │   └── style.css            # Application styling
│   └── js/
│       └── app.js               # Frontend logic and API communication
└── README.md                    # Project documentation
```

## Prerequisites
* Python 3.8 or higher
* A modern web browser (Chrome, Firefox, Safari, Edge)

## Installation and Setup

1. **Clone or Download the Repository:**
   Navigate to the project directory on your local machine.

2. **Set Up the Backend Environment:**
   Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
   Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. **Train the Model (Optional):**
   If the `.pkl` files are not present or you wish to retrain the model with new data, run the training script:
   ```bash
   python model_train.py
   ```

4. **Start the Flask Server:**
   Run the backend application:
   ```bash
   python app.py
   ```
   The server will start locally at `http://127.0.0.1:5000`.

5. **Launch the Frontend:**
   You do not need a specialized web server for the frontend. Simply open `frontend/index.html` in your web browser. Alternatively, you can use a local static server like Live Server (VS Code extension) or Python's HTTP server:
   ```bash
   cd ../frontend
   python -m http.server 5500
   ```
   Then navigate to `http://localhost:5500` in your browser.

## Usage
1. Open the application and navigate to the **Risk Assessment** tab.
2. Fill out the comprehensive questionnaire. The form will dynamically adapt based on selections such as Employment Status.
3. Submit the form to receive an immediate analysis, complete with a risk probability chart and actionable lifestyle recommendations.

## Disclaimer
MindGuardAI is a screening tool designed for informational purposes only. It is not a diagnostic instrument. Users experiencing mental health challenges should always consult with a qualified healthcare or mental health professional.
