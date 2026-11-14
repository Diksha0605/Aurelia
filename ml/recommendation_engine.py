
import json
import os


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "properties.json")

with open(DATA_PATH, "r", encoding="utf-8") as file:
    properties = json.load(file)


def recommend_stays(
    destination,
    total_budget,
    nights,
    guests,
    min_rating=0,
    preferred_bedrooms=1
):
    recommendations = []

    for property in properties:

        # 1. Match destination
        if destination.lower() not in property["location"].lower():
            continue

        # 2. Check guest capacity
        if property["guests"] < guests:
            continue

        # 3. Calculate total stay cost
        total_cost = property["pricePerNight"] * nights

        if total_cost > total_budget:
            continue

        # 4. Check minimum rating
        if property["rating"] < min_rating:
            continue

        # 5. Calculate recommendation scores
        budget_score = max(
            0,
            100 * (1 - total_cost / total_budget)
        )

        rating_score = (property["rating"] / 5) * 100

        bedroom_difference = abs(
            property["bedrooms"] - preferred_bedrooms
        )

        bedroom_score = max(
            0,
            100 - (bedroom_difference * 25)
        )

        # Weighted recommendation score
        final_score = (
            budget_score * 0.35
            + rating_score * 0.40
            + bedroom_score * 0.25
        )

        recommendations.append({
            "property_id": property["_id"],
            "title": property["title"],
            "location": property["location"],
            "price_per_night": property["pricePerNight"],
            "total_cost": total_cost,
            "remaining_budget": total_budget - total_cost,
            "rating": property["rating"],
            "bedrooms": property["bedrooms"],
            "guests": property["guests"],
            "recommendation_score": round(final_score, 2)
        })

    # Rank highest recommendation score first
    recommendations.sort(
        key=lambda item: item["recommendation_score"],
        reverse=True
    )

    return recommendations


if __name__ == "__main__":

    results = recommend_stays(
        destination="Manali",
        total_budget=20000,
        nights=4,
        guests=4,
        min_rating=4.5,
        preferred_bedrooms=2
    )

    print("\nPERSONALIZED STAY RECOMMENDATIONS")
    print("----------------------------------")

    if not results:
        print("No matching properties found.")

    for index, stay in enumerate(results, start=1):
        print(f"\n{index}. {stay['title']}")
        print(f"   Rating: {stay['rating']}")
        print(f"   Price per night: Rs. {stay['price_per_night']}")
        print(f"   Total cost: Rs. {stay['total_cost']}")
        print(f"   Remaining budget: Rs. {stay['remaining_budget']}")
        print(f"   Recommendation score: {stay['recommendation_score']}/100")
