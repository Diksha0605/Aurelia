
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

# Load actual Aurelia property listings
with open(BASE_DIR / "properties.json", "r", encoding="utf-8") as file:
    properties = json.load(file)


def optimize_budget(destination, total_budget, nights, guests):

    if total_budget <= 0 or nights <= 0 or guests <= 0:
        raise ValueError("Budget, nights and guests must be positive.")

    recommendations = []

    for property in properties:

        location = property.get("location", "")

        # Match destination
        if destination.lower() not in location.lower():
            continue

        price = float(property.get("pricePerNight", 0))
        capacity = int(property.get("guests", 0))
        rating = float(property.get("rating", 0))

        # Calculate total accommodation cost
        total_cost = price * nights

        # Check budget and guest capacity
        if total_cost <= total_budget and capacity >= guests:

            recommendations.append({
                "title": property["title"],
                "location": location,
                "price_per_night": price,
                "total_cost": total_cost,
                "remaining_budget": total_budget - total_cost,
                "rating": rating,
                "guests": capacity
            })

    # Rank by rating, then lower total cost
    recommendations.sort(
        key=lambda item: (-item["rating"], item["total_cost"])
    )

    return recommendations


if __name__ == "__main__":

    destination = "Manali"
    total_budget = 20000
    nights = 4
    guests = 4

    results = optimize_budget(
        destination,
        total_budget,
        nights,
        guests
    )

    print("\nAURELIA - AI BUDGET OPTIMIZER")
    print("----------------------------")
    print("Destination:", destination)
    print("Total Budget: Rs.", total_budget)
    print("Duration:", nights, "nights")
    print("Guests:", guests)

    if results:
        print("\nRecommended Properties:\n")

        for index, item in enumerate(results, start=1):
            print(f"{index}. {item['title']}")
            print("   Price per night: Rs.", item["price_per_night"])
            print("   Total cost: Rs.", item["total_cost"])
            print("   Remaining budget: Rs.", item["remaining_budget"])
            print("   Rating:", item["rating"])
            print()
    else:
        print("\nNo suitable properties found within this budget.")
