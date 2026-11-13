
import pandas as pd
import numpy as np
import json
import random
from pathlib import Path

# Keep results reproducible
random.seed(42)
np.random.seed(42)

# Load actual Aurelia properties
BASE_DIR = Path(__file__).resolve().parent

with open(BASE_DIR / "properties.json", "r", encoding="utf-8") as file:
    properties = json.load(file)

if not properties:
    raise ValueError("No properties found in properties.json")

def get_property_type(title):
    title = title.lower()

    types = {
        "Villa": ["villa"],
        "Cottage": ["cottage"],
        "Apartment": ["apartment"],
        "Homestay": ["homestay", "guesthouse", "guest house"],
        "Retreat": ["retreat"],
        "Hotel": ["hotel"],
        "Suite": ["suite"],
        "Chalet": ["chalet"],
        "Lodge": ["lodge"],
        "Haveli": ["haveli"],
        "Residence": ["residence"],
    }

    for property_type, keywords in types.items():
        if any(word in title for word in keywords):
            return property_type

    return "Other"


records = []

# Generate 50 variations for every actual property
for property in properties:

    title = property.get("title", "Unknown Property")
    location = property.get("location", "Unknown")
    base_price = float(property.get("pricePerNight", 2000))
    rating = float(property.get("rating", 4.0))
    max_guests = max(1, int(property.get("guests", 2)))
    max_bedrooms = max(1, int(property.get("bedrooms", 1)))

    property_type = get_property_type(title)

    for _ in range(50):

        guests = random.randint(1, max_guests)
        bedrooms = random.randint(1, max_bedrooms)

        # Synthetic price variation based on property capacity
        guest_factor = 0.82 + (0.035 * guests)
        bedroom_factor = 0.92 + (0.04 * bedrooms)
        rating_factor = 1 + ((rating - 4.0) * 0.025)
        random_factor = random.uniform(0.90, 1.10)

        predicted_price = (
            base_price
            * guest_factor
            * bedroom_factor
            * rating_factor
            * random_factor
        )

        records.append({
            "location": location,
            "property_type": property_type,
            "guests": guests,
            "bedrooms": bedrooms,
            "rating": rating,
            "price_per_night": round(predicted_price)
        })


# Create and save dataset
df = pd.DataFrame(records)

output_path = BASE_DIR / "aurelia_training_data.csv"
df.to_csv(output_path, index=False)

print("Aurelia ML dataset generated successfully!")
print("Original properties:", len(properties))
print("Training records:", len(df))
print("\nDataset preview:")
print(df.head(10).to_string(index=False))

print("\nDataset saved at:", output_path)
