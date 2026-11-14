from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pandas as pd
import joblib
import json
from recommendation_engine import recommend_stays
import os

app = FastAPI(title="Aurelia AI API")

# Allow the React frontend to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model and property data
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "aurelia_price_model.pkl")
DATA_PATH = os.path.join(BASE_DIR, "properties.json")

model = joblib.load(MODEL_PATH)

with open(DATA_PATH, "r", encoding="utf-8") as file:
    properties = json.load(file)


# Request format for price prediction
class PriceRequest(BaseModel):
    location: str
    property_type: str
    guests: int = Field(gt=0)
    bedrooms: int = Field(gt=0)
    rating: float = Field(ge=0, le=5)


# Request format for budget optimization
class BudgetRequest(BaseModel):
    destination: str
    total_budget: float = Field(gt=0)
    nights: int = Field(gt=0)
    guests: int = Field(gt=0)

class RecommendationRequest(BaseModel):
    destination: str
    total_budget: float = Field(gt=0)
    nights: int = Field(gt=0)
    guests: int = Field(gt=0)
    min_rating: float = Field(ge=0, le=5)
    preferred_bedrooms: int = Field(gt=0)

@app.get("/health")
def health_check():
    return {
        "success": True,
        "message": "Aurelia AI API is running!"
    }


@app.post("/predict-price")
def predict_price(request: PriceRequest):
    try:
        input_data = pd.DataFrame([{
            "location": request.location,
            "property_type": request.property_type,
            "guests": request.guests,
            "bedrooms": request.bedrooms,
            "rating": request.rating
        }])

        prediction = model.predict(input_data)[0]

        return {
            "success": True,
            "predicted_price_per_night": round(float(prediction), 2)
        }

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@app.post("/optimize-budget")
def optimize_budget(request: BudgetRequest):
    matching_properties = []

    for property in properties:
        location = property.get("location", "")

        if request.destination.lower() not in location.lower():
            continue

        price = property.get("pricePerNight", 0)
        capacity = property.get("guests", 0)
        rating = property.get("rating", 0)

        total_cost = price * request.nights

        if capacity >= request.guests and total_cost <= request.total_budget:
            matching_properties.append({
                "property_id": str(property.get("_id", "")),
                "title": property.get("title", ""),
                "location": location,
                "price_per_night": price,
                "total_cost": total_cost,
                "remaining_budget": request.total_budget - total_cost,
                "rating": rating
            })

    # Best-rated properties first; lower cost breaks rating ties
    matching_properties.sort(
        key=lambda item: (-item["rating"], item["total_cost"])
    )

    return {
        "success": True,
        "count": len(matching_properties),
        "recommendations": matching_properties
    }

@app.post("/personalized-recommendations")
def personalized_recommendations(request: RecommendationRequest):
    try:
        results = recommend_stays(
            destination=request.destination,
            total_budget=request.total_budget,
            nights=request.nights,
            guests=request.guests,
            min_rating=request.min_rating,
            preferred_bedrooms=request.preferred_bedrooms
        )

        return {
            "success": True,
            "count": len(results),
            "recommendations": results
        }

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))