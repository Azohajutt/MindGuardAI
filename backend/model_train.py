import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from imblearn.over_sampling import SMOTE
import joblib
import warnings
import os
warnings.filterwarnings('ignore')

# Load dataset - Try multiple possible paths
print("Loading dataset...")

possible_paths = [
    '../data/mental_health_risk_dataset.csv',  # Your file
    '../data/mental_health_data.csv',
    '../data/mental_health_disorder_risk_assessment_dataset.csv',
    'C:/Zoha WorkSpace/Running_Codes/Mental-Health-Risk-Classifier/data/mental_health_risk_dataset.csv'
]

df = None
for path in possible_paths:
    if os.path.exists(path):
        print(f"Found dataset at: {path}")
        df = pd.read_csv(path)
        break

if df is None:
    raise FileNotFoundError(f"Dataset not found! Tried paths: {possible_paths}")

print(f"Dataset shape: {df.shape}")
print(f"Columns in dataset: {df.columns.tolist()}")
print(f"\nFirst few rows:\n{df.head()}")

# Check if target column exists (might have different name)
target_column = None
possible_targets = ['mental_health_risk', 'risk_level', 'target', 'Mental_Health_Risk']
for col in possible_targets:
    if col in df.columns:
        target_column = col
        break

if target_column is None:
    print(f"\nAvailable columns: {df.columns.tolist()}")
    raise ValueError(f"Target column not found! Please check column names in your dataset")

print(f"\nUsing target column: '{target_column}'")
print(f"Target distribution:\n{df[target_column].value_counts()}")

# Identify categorical columns (exclude target and numeric columns)
categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
if target_column in categorical_cols:
    categorical_cols.remove(target_column)

print(f"\nCategorical columns to encode: {categorical_cols}")

# Encode categorical variables
label_encoders = {}
for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col].astype(str))
    label_encoders[col] = le
    print(f"Encoded {col}: {dict(zip(le.classes_, range(len(le.classes_))))}")

# Separate features and target
X = df.drop(target_column, axis=1)
y = df[target_column]

# Ensure y is numeric
if y.dtype == 'object':
    le_target = LabelEncoder()
    y = le_target.fit_transform(y)
    print(f"\nEncoded target: {dict(zip(le_target.classes_, range(len(le_target.classes_))))}")

print(f"\nFeatures shape: {X.shape}")
print(f"Target shape: {y.shape}")
print(f"Unique target values: {np.unique(y)}")

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Scale numerical features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Handle class imbalance with SMOTE
print("\nApplying SMOTE to handle class imbalance...")
smote = SMOTE(random_state=42)
X_train_balanced, y_train_balanced = smote.fit_resample(X_train_scaled, y_train)
print(f"After SMOTE - Training shape: {X_train_balanced.shape}")
print(f"Balanced target distribution:\n{pd.Series(y_train_balanced).value_counts()}")

# Train Random Forest with optimized parameters
print("\nTraining Random Forest Classifier...")
rf_model = RandomForestClassifier(
    n_estimators=200,
    max_depth=15,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    class_weight='balanced',
    n_jobs=-1
)

rf_model.fit(X_train_balanced, y_train_balanced)

# Cross-validation
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(rf_model, X_train_balanced, y_train_balanced, cv=cv, scoring='accuracy')
print(f"\nCross-validation scores: {cv_scores}")
print(f"Mean CV accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")

# Evaluate on test set
y_pred = rf_model.predict(X_test_scaled)
y_pred_proba = rf_model.predict_proba(X_test_scaled)

print("\n" + "="*50)
print("CLASSIFICATION REPORT")
print("="*50)
target_names = [f'Class {i}' for i in range(len(np.unique(y)))]
print(classification_report(y_test, y_pred, target_names=target_names))

# Feature importance
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': rf_model.feature_importances_
}).sort_values('importance', ascending=False)

print("\n" + "="*50)
print("TOP 10 IMPORTANT FEATURES")
print("="*50)
print(feature_importance.head(10))

# Calculate ROC-AUC for multi-class
if len(np.unique(y)) > 2:
    roc_auc = roc_auc_score(y_test, y_pred_proba, multi_class='ovr')
    print(f"\nROC-AUC Score: {roc_auc:.4f}")

# Save model and preprocessors
print("\nSaving model and preprocessors...")
joblib.dump(rf_model, 'mental_health_model.pkl')
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(label_encoders, 'label_encoders.pkl')
joblib.dump(list(X.columns), 'feature_columns.pkl')

print("\n✅ Model training complete! Files saved successfully.")
print("\nSaved files:")
print("  - mental_health_model.pkl")
print("  - scaler.pkl")
print("  - label_encoders.pkl")
print("  - feature_columns.pkl")

# Make a sample prediction
sample = X_test.iloc[0].values.reshape(1, -1)
sample_scaled = scaler.transform(sample)
prediction = rf_model.predict(sample_scaled)[0]
proba = rf_model.predict_proba(sample_scaled)[0]
print(f"\nSample prediction: Risk Level {prediction}")
print(f"Probabilities: {[f'{p:.2%}' for p in proba]}")