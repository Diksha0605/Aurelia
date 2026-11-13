
import pandas as pd
import joblib

from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Project paths
BASE_DIR = Path(__file__).resolve().parent

DATA_PATH = BASE_DIR / "aurelia_training_data.csv"
MODEL_PATH = BASE_DIR / "aurelia_price_model.pkl"

# Load dataset
df = pd.read_csv(DATA_PATH)

print("Dataset loaded:", len(df), "records")

# Input features and target
X = df[
    ["location", "property_type", "guests", "bedrooms", "rating"]
]

y = df["price_per_night"]

# Identify categorical and numerical columns
categorical_features = ["location", "property_type"]
numerical_features = ["guests", "bedrooms", "rating"]

# Encode text columns
preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_features
        ),
        (
            "numerical",
            "passthrough",
            numerical_features
        )
    ]
)

# Build ML pipeline
model = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        (
            "regressor",
            RandomForestRegressor(
                n_estimators=200,
                random_state=42,
                max_depth=15
            )
        )
    ]
)

# Split training and testing data
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42
)

# Train model
print("\nTraining Aurelia price prediction model...")

model.fit(X_train, y_train)

# Evaluate model
predictions = model.predict(X_test)

mae = mean_absolute_error(y_test, predictions)
rmse = mean_squared_error(y_test, predictions) ** 0.5
r2 = r2_score(y_test, predictions)

print("\nModel Evaluation Results")
print("------------------------")
print(f"Mean Absolute Error: ₹{mae:.2f}")
print(f"Root Mean Squared Error: ₹{rmse:.2f}")
print(f"R2 Score: {r2:.4f}")

# Save trained model
joblib.dump(model, MODEL_PATH)

print("\nModel trained and saved successfully!")
print("Saved at:", MODEL_PATH)
