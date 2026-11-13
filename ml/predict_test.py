
import joblib
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

# Load the trained model
model = joblib.load(BASE_DIR / "aurelia_price_model.pkl")

# Sample property details
sample_property = pd.DataFrame([{
    "location": "Manali, Himachal Pradesh",
    "property_type": "Villa",
    "guests": 4,
    "bedrooms": 2,
    "rating": 4.8
}])

# Predict nightly price
predicted_price = model.predict(sample_property)[0]

print("\nAURELIA - AI PRICE PREDICTION")
print("----------------------------")
print("Destination: Manali")
print("Property Type: Villa")
print("Guests: 4")
print("Bedrooms: 2")
print("Rating: 4.8")
print(f"\nEstimated Price Per Night: Rs. {predicted_price:,.2f}")
