# Aurelia – Accommodation Discovery and Budget-Based Recommendations

Aurelia is an accommodation discovery and booking platform that helps users explore stays, manage bookings, and make budget-aware travel decisions with AI-assisted features.

The project combines a React frontend, an Express and MongoDB backend, and a Python-based AI/ML service.

*Homepage*
<img width="749" height="489" alt="Screenshot 2026-11-14 133443" src="https://github.com/user-attachments/assets/e3fd1a63-e45d-4904-b936-d849e67c73f2" />

*Explore stays*
<img width="402" height="359" alt="Screenshot 2026-11-14 133507" src="https://github.com/user-attachments/assets/c00203d2-a8e4-4377-875e-60bd8d133e3b" />

*My Trips*
<img width="397" height="311" alt="Screenshot 2026-11-14 133522" src="https://github.com/user-attachments/assets/2d451697-4c10-41c7-b3a4-88e1e137b41b" />

*AI Price Predictor and Budget Optimizer*
<img width="266" height="308" alt="Screenshot 2026-11-14 133546" src="https://github.com/user-attachments/assets/da08b69e-b3dd-4bb5-bad1-11305907784e" />

*Personalized Stay Recommendations*
<img width="280" height="379" alt="Screenshot 2026-11-14 133557" src="https://github.com/user-attachments/assets/858141f3-2e74-4e77-a876-7ccd29a0826e" />


## Key Features
### Stay discovery
- Browse accommodation listings with property images, locations, ratings, and nightly prices.
- Search and filter stays by destination, guest count, and maximum nightly price.
  
### Booking management
- Submit a booking with guest and date details.
- Check booking availability and prevent overlapping bookings for the same property.
- View booking information in the My Trips section.

### AI travel assistance
- AI Price Predictor: estimates a property's nightly price using a trained Random Forest Regression model.
- Smart Budget Optimizer: filters and ranks stays based on the user's total budget, trip duration, guest count, and property details. This is a rule-based optimization feature.
- Personalized Stay Recommendations: ranks suitable properties using budget suitability, guest rating, and preferred bedroom count. This is a weighted recommendation algorithm, not a separately trained ML model.


## Technology Stack

### Frontend	
- React 
- Vite
- JavaScript
- CSS

### Backend	
- Node.js
- Express.js

### Database	
- MongoDB
- Mongoose

### AI/ML service	
- Python
- FastAPI
- scikit-learn
- pandas
- NumPy

### Machine learning model	
- Random Forest Regressor

### Development tools	
- VS Code
- Git
- GitHub

## Project Structure

```text
Aurelia/
├── backend/
│   ├── models/
│   │   ├── Property.js
│   │   └── Booking.js
│   ├── server.js
│   ├── exportProperties.js
│   ├── seedProperties.js
│   ├── package.json
│   └── .env                  # Local only; do not commit
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── ml/
│   ├── api.py
│   ├── generate_dataset.py
│   ├── train_model.py
│   ├── predict_test.py
│   ├── budget_optimizer.py
│   ├── recommendation_engine.py
│   ├── properties.json
│   ├── aurelia_price_model.pkl
│   └── requirements.txt
│
├── screenshots/
│   ├── 01-homepage.png
│   ├── 02-stays-listing.png
│   ├── 03-my-trips.png
│   ├── 04-ai-price-and-budget.png
│   └── 05-personalized-recommendations.png
│
├── .gitignore
└── README.md
```


## How the AI/ML Components Work
### 1. Price prediction
A Random Forest Regression model is trained using property-related features such as location, property type, guest capacity, bedrooms, and rating. The model returns an estimated nightly price.

The current training dataset is synthetically generated from the available property data. Therefore, the reported evaluation scores describe performance on this generated dataset and should not be interpreted as proof of real-world market-price accuracy.

### 2. Budget optimization
The optimizer calculates the estimated stay cost:

Total stay cost = Price per night × Number of nights

It keeps properties that fit within the user's total budget and ranks the suitable options.

### 3. Personalized recommendations
The recommendation engine assigns a weighted score using:
- Budget suitability — 35%
- Property rating — 40%
- Preferred bedroom match — 25%
It then returns the highest-scoring suitable stays with their estimated total cost and remaining budget.

## Running the Project Locally
You will need Node.js, Python, and access to a MongoDB database.

### 1. Start the backend
cd backend
npm install
Create a backend/.env file with your MongoDB connection string and any required backend configuration. Do not upload this file to GitHub.
node server.js
The Express backend runs at:

http://localhost:5000

### 2. Start the frontend
Open another terminal:
cd frontend
npm install
npm run dev
Open the local URL printed by Vite, usually:

http://localhost:5173

### 3. Start the AI/ML API
Open another terminal:
cd ml
python -m venv venv
Activate the environment:

Windows PowerShell
.\venv\Scripts\Activate.ps1
Install dependencies:
python -m pip install -r requirements.txt
Start FastAPI:
uvicorn api:app --reload --host 127.0.0.1 --port 8000
API documentation:

http://127.0.0.1:8000/docs

Health check:

http://127.0.0.1:8000/health

Run the backend, frontend, and AI/ML API in separate terminals when using the complete application.
Main API Endpoints
### Express backend
- GET /api/health — backend health check
- GET /api/properties — retrieve and filter properties
- GET /api/bookings/availability — check booking availability
- POST /api/bookings — create a booking
- GET /api/bookings — retrieve bookings
### Python AI/ML API
- GET /health — AI service health check
- POST /predict-price — predict nightly price
- POST /optimize-budget — find stays within a budget
- POST /personalized-recommendations — return personalized stay matches
### Environment and Security
- Keep database credentials and API secrets in local .env files.
- Never commit .env, virtual environments, node_modules, or generated cache folders.
- Use .gitignore to exclude local dependencies and secrets.
- Configure environment variables on the deployment platform before deploying.
### Future Improvements
- User authentication and profile management
- Online payment integration
- Maps and location-based discovery
- More extensive real-world accommodation data for model training
- Model evaluation using real market-price data
- Deployment of the frontend, backend, and AI service


##  Author

**Diksha Sahu**

- B.Tech Computer Science Engineering
- DY Patil International University, Pune
- GitHub: [Diksha0605](https://github.com/Diksha0605)
- LinkedIn: [Diksha Sahu](https://www.linkedin.com/in/diksha-sahu-68a84035b/)

