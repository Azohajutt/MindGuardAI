from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
import traceback

app = Flask(__name__)
CORS(app, origins=["http://localhost:5500", "http://127.0.0.1:5500", "*"])

# Load models and preprocessors
print("Loading models...")
try:
    model = joblib.load('mental_health_model.pkl')
    scaler = joblib.load('scaler.pkl')
    label_encoders = joblib.load('label_encoders.pkl')
    feature_columns = joblib.load('feature_columns.pkl')
    print("✅ Models loaded successfully!")
except Exception as e:
    print(f"Error loading models: {e}")
    traceback.print_exc()

# Mapping for categorical variables
GENDER_MAP = {'Male': 0, 'Female': 1, 'Other': 2}
MARITAL_STATUS_MAP = {'Single': 0, 'Married': 1, 'Divorced': 2}
EDUCATION_MAP = {'High School': 0, 'Bachelor': 1, 'Master': 2, 'PhD': 3}
EMPLOYMENT_MAP = {'Student': 0, 'Employed': 1, 'Self-Employed': 2, 'Unemployed': 3}

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'model_loaded': model is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Make prediction from input features"""
    try:
        data = request.json
        
        # Extract features from request
        features = {
            'age': float(data.get('age', 25)),
            'gender': GENDER_MAP.get(data.get('gender', 'Male'), 0),
            'marital_status': MARITAL_STATUS_MAP.get(data.get('marital_status', 'Single'), 0),
            'education_level': EDUCATION_MAP.get(data.get('education_level', 'Bachelor'), 1),
            'employment_status': EMPLOYMENT_MAP.get(data.get('employment_status', 'Employed'), 1),
            'sleep_hours': float(data.get('sleep_hours', 7)),
            'physical_activity_hours_per_week': float(data.get('physical_activity_hours_per_week', 5)),
            'screen_time_hours_per_day': float(data.get('screen_time_hours_per_day', 5)),
            'social_support_score': int(data.get('social_support_score', 7)),
            'work_stress_level': int(data.get('work_stress_level', 5)),
            'academic_pressure_level': int(data.get('academic_pressure_level', 5)),
            'job_satisfaction_score': int(data.get('job_satisfaction_score', 7)),
            'financial_stress_level': int(data.get('financial_stress_level', 5)),
            'working_hours_per_week': int(data.get('working_hours_per_week', 40)),
            'anxiety_score': int(data.get('anxiety_score', 5)),
            'depression_score': int(data.get('depression_score', 5)),
            'stress_level': int(data.get('stress_level', 5)),
            'mood_swings_frequency': int(data.get('mood_swings_frequency', 5)),
            'concentration_difficulty_level': int(data.get('concentration_difficulty_level', 5)),
            'panic_attack_history': int(data.get('panic_attack_history', 0)),
            'family_history_mental_illness': int(data.get('family_history_mental_illness', 0)),
            'previous_mental_health_diagnosis': int(data.get('previous_mental_health_diagnosis', 0)),
            'therapy_history': int(data.get('therapy_history', 0)),
            'substance_use': int(data.get('substance_use', 0))
        }
        
        # Create DataFrame with correct column order
        input_df = pd.DataFrame([features])[feature_columns]
        
        # Scale features
        input_scaled = scaler.transform(input_df)
        
        # Make prediction
        prediction = model.predict(input_scaled)[0]
        probabilities = model.predict_proba(input_scaled)[0]
        
        # Risk level mapping
        risk_levels = ['Low Risk', 'Moderate Risk', 'High Risk']
        risk_colors = {
            'Low Risk': '#28a745',
            'Moderate Risk': '#ffc107', 
            'High Risk': '#dc3545'
        }
        
        # Generate recommendations based on prediction and features
        recommendations = generate_recommendations(prediction, features)
        
        return jsonify({
            'success': True,
            'prediction': int(prediction),
            'risk_level': risk_levels[prediction],
            'color': risk_colors[risk_levels[prediction]],
            'probabilities': {
                'low': float(probabilities[0]),
                'moderate': float(probabilities[1]),
                'high': float(probabilities[2])
            },
            'confidence': float(max(probabilities) * 100),
            'recommendations': recommendations,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"Error in prediction: {e}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

def generate_recommendations(prediction, features):
    """Generate personalized recommendations"""
    recommendations = []
    
    if prediction == 2:  # High Risk
        recommendations.append("🚨 Consider consulting a mental health professional as soon as possible")
        recommendations.append("📞 You can call mental health helplines for immediate support")
    
    if features['sleep_hours'] < 6:
        recommendations.append("😴 Increase your sleep duration to 7-9 hours per night for better mental health")
    elif features['sleep_hours'] > 10:
        recommendations.append("⏰ Try to maintain consistent sleep patterns; oversleeping can affect mental health")
    
    if features['physical_activity_hours_per_week'] < 2:
        recommendations.append("🏃‍♀️ Add regular physical activity - even 30 minutes daily can improve mental wellbeing")
    
    if features['social_support_score'] < 5:
        recommendations.append("👥 Build a stronger support network - connect with friends, family, or support groups")
    
    if features['work_stress_level'] > 7:
        recommendations.append("💼 Practice stress management techniques like deep breathing or meditation")
    
    if features['anxiety_score'] > 7:
        recommendations.append("🧘 Consider mindfulness practices or cognitive behavioral therapy techniques")
    
    if features['screen_time_hours_per_day'] > 8:
        recommendations.append("📱 Reduce screen time and take regular digital breaks")
    
    if not recommendations:
        recommendations.append("✅ Your lifestyle factors look good! Keep maintaining healthy habits")
        recommendations.append("🌟 Regular check-ins with yourself can help maintain mental wellness")
    
    return recommendations[:5]

@app.route('/model-info', methods=['GET'])
def model_info():
    """Get model information and feature importance"""
    try:
        feature_importance = model.feature_importances_
        top_features = sorted(zip(feature_columns, feature_importance), 
                            key=lambda x: x[1], reverse=True)[:10]
        
        return jsonify({
            'success': True,
            'model_type': 'Random Forest Classifier',
            'n_estimators': model.n_estimators,
            'max_depth': model.max_depth,
            'n_features': len(feature_columns),
            'feature_importance': [{'feature': f, 'importance': imp} for f, imp in top_features]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)