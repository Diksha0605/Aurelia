
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [stays, setStays] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [destination, setDestination] = useState('')
  const [searchDestination, setSearchDestination] = useState('')
  const [guests, setGuests] = useState(2)
  const [searchGuests, setSearchGuests] = useState(2)
  const [maxPrice, setMaxPrice] = useState(5000)
  const [searchMaxPrice, setSearchMaxPrice] = useState(5000)
  const [myTrips, setMyTrips] = useState([])
  const [tripsLoading, setTripsLoading] = useState(false)
  const [tripsError, setTripsError] = useState('')

    // AI Price Prediction states
  const [predictionForm, setPredictionForm] = useState({
    location: 'Manali, Himachal Pradesh',
    property_type: 'Villa',
    guests: 4,
    bedrooms: 2,
    rating: 4.8,
  })

  const [predictedPrice, setPredictedPrice] = useState(null)
  const [predictionLoading, setPredictionLoading] = useState(false)
  const [predictionError, setPredictionError] = useState('')

  // Smart Budget Optimizer states
  const [budgetForm, setBudgetForm] = useState({
    destination: 'Manali',
    total_budget: 20000,
    nights: 4,
    guests: 4,
  })

  const [recommendations, setRecommendations] = useState([])
  const [budgetLoading, setBudgetLoading] = useState(false)
  const [budgetError, setBudgetError] = useState('')

    // Call the AI Price Prediction API
  async function handlePredictPrice(event) {
    event.preventDefault()

    try {
      setPredictionLoading(true)
      setPredictionError('')
      setPredictedPrice(null)

      const response = await fetch('http://127.0.0.1:8000/predict-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...predictionForm,
          guests: Number(predictionForm.guests),
          bedrooms: Number(predictionForm.bedrooms),
          rating: Number(predictionForm.rating),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.detail || 'Price prediction failed')
      }

      setPredictedPrice(result.predicted_price_per_night)

    } catch (err) {
      console.error('Price prediction error:', err)
      setPredictionError(err.message || 'Unable to predict price.')
    } finally {
      setPredictionLoading(false)
    }
  }


  // Call the Smart Budget Optimizer API
  async function handleOptimizeBudget(event) {
    event.preventDefault()

    try {
      setBudgetLoading(true)
      setBudgetError('')
      setRecommendations([])

      const response = await fetch('http://127.0.0.1:8000/optimize-budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...budgetForm,
          total_budget: Number(budgetForm.total_budget),
          nights: Number(budgetForm.nights),
          guests: Number(budgetForm.guests),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.detail || 'Budget optimization failed')
      }

      setRecommendations(result.recommendations || [])

    } catch (err) {
      console.error('Budget optimization error:', err)
      setBudgetError(err.message || 'Unable to optimize your budget.')
    } finally {
      setBudgetLoading(false)
    }
  }

  // Booking states
  const [selectedStay, setSelectedStay] = useState(null)
  const [bookingForm, setBookingForm] = useState({
    guestName: '',
    guestEmail: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  })
  
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingMessage, setBookingMessage] = useState('')
  const [bookingError, setBookingError] = useState('')

  // Check property availability
// Create a new booking
async function handleCreateBooking(event) {
  event.preventDefault()

  try {
    setBookingLoading(true)
    setBookingError('')
    setBookingMessage('')

    const response = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        propertyId: selectedStay._id,
        guestName: bookingForm.guestName,
        guestEmail: bookingForm.guestEmail,
        checkIn: bookingForm.checkIn,
        checkOut: bookingForm.checkOut,
        guests: Number(bookingForm.guests),
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Booking failed')
    }

    setBookingMessage(
      `Booking confirmed! Total price: ₹${result.data.totalPrice}`
    )

    await fetchMyTrips()

  } catch (err) {
    console.error('Booking error:', err)
    setBookingError(err.message || 'Unable to complete booking.')
  } finally {
    setBookingLoading(false)
  }
}

// Fetch bookings for My Trips
async function fetchMyTrips() {
  try {
    setTripsLoading(true)
    setTripsError('')

    const response = await fetch('http://localhost:5000/api/bookings')
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch trips')
    }

    setMyTrips(result.data)

  } catch (error) {
    console.error('My Trips error:', error)
    setTripsError(error.message || 'Unable to load trips')
  } finally {
    setTripsLoading(false)
  }
}

useEffect(() => {
  fetchMyTrips()
}, [])
  
  useEffect(() => {
    async function fetchStays() {
      try {
        setLoading(true)
        setError('')

       const params = new URLSearchParams()
       
       if (searchDestination.trim()) {
        params.set('destination', searchDestination.trim())
       }
       
       params.set('guests', String(searchGuests))
       params.set('maxPrice', String(searchMaxPrice))
       
       const url = `http://localhost:5000/api/properties?${params.toString()}`

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Failed to load stays')
        }

        const result = await response.json()
        setStays(result.data || [])
        } catch (err) {
          console.error(err)
          setError('Unable to load stays. Please check the backend.')
        } finally {
          setLoading(false)
        }
      }
      fetchStays()
    }, [searchDestination, searchGuests, searchMaxPrice])


  return (
    <div className="app">
      {/* Navbar */}
      <header className="navbar">
        <a href="/" className="brand">
          <span className="brand-icon">a</span>
          aurelia
        </a>

        <nav className="nav-links">
          <a href="#stays">Explore stays</a>
          <a href="#my-trips">My Trips</a>
          <a href="#budget">Budget planner</a>
        </nav>

        <div className="nav-actions">
          <a href="#stays" className="host-link">Find your stay</a>
          <a href="#stays" className="login-button">Explore now ↗</a>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="eyebrow">
            YOUR NEXT GETAWAY STARTS HERE
          </span>

          <h1>
            Find a place
            <br />
            that feels like <span>you.</span>
          </h1>

          <p className="hero-description">
            Discover beautiful stays, explore new places, and plan
            your next trip within your budget.
          </p>

          <div className="search-bar">
            <div className="search-field">
              <span>WHERE</span>
              <input
              type="text"
              placeholder="Explore destinations"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              />
            </div>

            <div className="search-field">
              <span>CHECK IN</span>
              <input type="date" aria-label="Check in date" />
            </div>

            <div className="search-field">
              <span>GUESTS</span>
              <input
              type="number"
              min="1"
              value={guests}
              onChange={(event) => {
                setGuests(Math.max(1, Number(event.target.value) || 1))
              }}
              aria-label="Number of guests"
            />
            </div>
            
            <div className="search-field">
              <span>MAX PRICE / NIGHT (₹)</span>
              <input
              type="number"
              min="1"
              value={maxPrice}
              onChange={(event) => {
                setMaxPrice(Math.max(1, Number(event.target.value) || 1))
              }}
              aria-label="Maximum price per night in rupees"
             />
           </div>
            
            <button
            type="button"
            className="search-button"
            onClick={() => {
              setSearchDestination(destination)
              setSearchGuests(guests)
              setSearchMaxPrice(maxPrice)
              document.getElementById('stays')?.scrollIntoView({
                behavior: 'smooth',
              })
            }}
          >
            ↗
            </button>

          </div>

          <p className="hero-note">
            <span>✦</span>
            Find your next favourite place to stay.
          </p>
        </div>

        <div className="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1000&q=85"
            alt="Beautiful holiday accommodation surrounded by nature"
          />

          <div className="image-caption">
            <div>
              <span className="caption-label">
                YOUR NEXT ESCAPE
              </span>
              <h3>Somewhere beautiful.</h3>
            </div>
            <span className="caption-star">✳</span>
          </div>

          <div className="floating-note">
            <span className="sparkle">✦</span>
            <div>
              <strong>Find your happy place</strong>
              <p>Discover stays worth remembering.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Properties from MongoDB */}
      <section className="stays-section" id="stays">
        <div className="section-heading">
          <div>
            <span className="eyebrow">HANDPICKED FOR YOU</span>
            <h2>Places worth staying for.</h2>
          </div>
          <p>Find your kind of escape.</p>
        </div>

        {loading ? (
          <p>Loading beautiful stays...</p>
        ) : error ? (
          <p>{error}</p>
        ) : stays.length === 0 ? (
          <p>No stays available yet. Please check back soon.</p>
        ) : (
          <div className="stays-grid">
            {stays.map((stay) => (
              <article className="stay-card" key={stay._id}>
                <div className="stay-image">
                  <img
                    src={
                      stay.image ||
                      'https://placehold.co/600x400?text=Aurelia+Stay'
                    }
                    alt={stay.title}
                  />

                  <span className="stay-type">Featured stay</span>

                  <button
                    className="heart-button"
                    type="button"
                    aria-label={`Save ${stay.title} to favourites`}
                    onClick={(event) => {
                      const button = event.currentTarget
                      button.classList.toggle('saved')
                      button.textContent =
                        button.classList.contains('saved') ? '♥' : '♡'
                    }}
                  >
                    ♡
                  </button>
                </div>

                <div className="stay-details">
                  <div className="stay-title-row">
                    <h3>{stay.title}</h3>
                    <span className="rating">
                      ★ {stay.rating || 'New'}
                    </span>
                  </div>

                  <p>{stay.location}</p>

                  <div className="stay-price">
                    <strong>
                      ₹{Number(stay.pricePerNight).toLocaleString('en-IN')}
                    </strong>
                    <span> / night</span>
                  </div>

                  <button
                  className="book-now-btn"
                  onClick={() => {
                    setSelectedStay(stay)
                    setBookingForm({
                      guestName: '',
                      guestEmail: '',
                      checkIn: '',
                      checkOut: '',
                      guests: 1,
                    })
                    setBookingMessage('')
                    setBookingError('')
                  }}
                  >
                  Book Now
                </button>

                </div>
              </article>
            ))}
          </div>
        )}
      </section>

            {/* My Trips Section */}
      <section className="my-trips-section" id="my-trips">
        <div className="section-heading">
          <div>
            <span className="eyebrow">YOUR TRAVEL JOURNEY</span>
            <h2>My Trips.</h2>
          </div>

          <p>All your bookings in one place.</p>
        </div>

        {tripsLoading ? (
          <p>Loading your trips...</p>
        ) : tripsError ? (
          <p>{tripsError}</p>
        ) : myTrips.length === 0 ? (
          <p>You haven't booked any stays yet. Your next adventure awaits!</p>
        ) : (
          <div className="my-trips-grid">
            {myTrips.map((booking) => (
              <article className="trip-card" key={booking._id}>
                <div className="trip-image">
                  <img
                    src={
                      booking.property?.image ||
                      'https://placehold.co/600x400?text=Aurelia+Stay'
                    }
                    alt={booking.property?.title || 'Booked stay'}
                  />
                </div>

                <div className="trip-details">
                  <div className="trip-title-row">
                    <h3>{booking.property?.title || 'Property'}</h3>

                    <span className={`trip-status ${booking.status}`}>
                      {booking.status}
                    </span>
                  </div>

                  <p className="trip-location">
                    {booking.property?.location || 'Location unavailable'}
                  </p>

                  <div className="trip-info">
                    <div>
                      <span>CHECK-IN</span>
                      <strong>
                        {new Date(booking.checkIn).toLocaleDateString('en-IN')}
                      </strong>
                    </div>

                    <div>
                      <span>CHECK-OUT</span>
                      <strong>
                        {new Date(booking.checkOut).toLocaleDateString('en-IN')}
                      </strong>
                    </div>

                    <div>
                      <span>GUESTS</span>
                      <strong>{booking.guests}</strong>
                    </div>
                  </div>

                  <div className="trip-footer">
                    <div>
                      <span>Total price</span>
                      <strong>
                        ₹{Number(booking.totalPrice).toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

            {/* Booking Modal */}
      {selectedStay && (
        <div className="booking-overlay">
          <div className="booking-modal">
            <button
              type="button"
              className="booking-close"
              onClick={() => setSelectedStay(null)}
            >
              ×
            </button>

            <span className="eyebrow">COMPLETE YOUR STAY</span>

            <h2>Book your escape.</h2>

            <div className="booking-property">
              <h3>{selectedStay.title}</h3>
              <p>{selectedStay.location}</p>
              <strong>
                ₹{Number(selectedStay.pricePerNight).toLocaleString('en-IN')}
              </strong>
              <span> / night</span>
            </div>

            <form onSubmit={handleCreateBooking}>
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={bookingForm.guestName}
                onChange={(event) =>
                  setBookingForm({
                    ...bookingForm,
                    guestName: event.target.value,
                  })
                }
                required
              />

              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={bookingForm.guestEmail}
                onChange={(event) =>
                  setBookingForm({
                    ...bookingForm,
                    guestEmail: event.target.value,
                  })
                }
                required
              />

              <div className="booking-date-row">
                <div>
                  <label>Check-in</label>
                  <input
                    type="date"
                    value={bookingForm.checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(event) =>
                      setBookingForm({
                        ...bookingForm,
                        checkIn: event.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label>Check-out</label>
                  <input
                    type="date"
                    value={bookingForm.checkOut}
                    min={bookingForm.checkIn || new Date().toISOString().split('T')[0]}
                    onChange={(event) =>
                      setBookingForm({
                        ...bookingForm,
                        checkOut: event.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <label>Number of Guests</label>
              <input
                type="number"
                min="1"
                max={selectedStay.guests}
                value={bookingForm.guests}
                onChange={(event) =>
                  setBookingForm({
                    ...bookingForm,
                    guests: Number(event.target.value),
                  })
                }
                required
              />

              <button
              type="submit"
              className="booking-submit"
              disabled={bookingLoading}
              >
                {bookingLoading ? 'Confirming...' : 'Confirm Booking'}
              </button>

              {bookingMessage && (
                <p style={{ color: 'green', marginTop: '12px' }}>
                  {bookingMessage}
                </p>
              )}
              
              {bookingError && (
                <p style={{ color: 'red', marginTop: '12px' }}>
                  {bookingError}
                </p>
              )}
            </form>
          </div>
        </div>
      )}


      {/* Budget Banner */}
            {/* AI Features Section */}
      <section className="ai-section" id="budget">
        <div className="section-heading">
          <div>
            <span className="eyebrow">POWERED BY ARTIFICIAL INTELLIGENCE</span>
            <h2>Travel smarter with Aurelia AI.</h2>
          </div>
          <p>Make better travel decisions with intelligent recommendations.</p>
        </div>

        <div className="ai-features-grid">

          {/* AI Price Predictor */}
          <div className="ai-card">
            <span className="ai-label">✦ MACHINE LEARNING</span>
            <h3>AI Price Predictor</h3>
            <p>Estimate the nightly price of an accommodation using our trained Random Forest model.</p>

            <form onSubmit={handlePredictPrice}>
              <label>Destination</label>
              <select
                value={predictionForm.location}
                onChange={(event) =>
                  setPredictionForm({
                    ...predictionForm,
                    location: event.target.value,
                  })
                }
              >
                {[
                  'Manali, Himachal Pradesh',
                  'North Goa, Goa',
                  'Lonavala, Maharashtra',
                  'Munnar, Kerala',
                  'Jaipur, Rajasthan',
                  'Shimla, Himachal Pradesh',
                  'Rishikesh, Uttarakhand',
                  'Udaipur, Rajasthan',
                ].map((place) => (
                  <option key={place} value={place}>{place}</option>
                ))}
              </select>

              <label>Property Type</label>
              <select
                value={predictionForm.property_type}
                onChange={(event) =>
                  setPredictionForm({
                    ...predictionForm,
                    property_type: event.target.value,
                  })
                }
              >
                {['Villa', 'Cottage', 'Apartment', 'Homestay', 'Retreat', 'Hotel', 'Suite', 'Chalet', 'Lodge', 'Haveli', 'Residence', 'Other'].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <div className="ai-input-row">
                <div>
                  <label>Guests</label>
                  <input
                    type="number"
                    min="1"
                    value={predictionForm.guests}
                    onChange={(event) =>
                      setPredictionForm({
                        ...predictionForm,
                        guests: event.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label>Bedrooms</label>
                  <input
                    type="number"
                    min="1"
                    value={predictionForm.bedrooms}
                    onChange={(event) =>
                      setPredictionForm({
                        ...predictionForm,
                        bedrooms: event.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <label>Property Rating (0–5)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={predictionForm.rating}
                onChange={(event) =>
                  setPredictionForm({
                    ...predictionForm,
                    rating: event.target.value,
                  })
                }
                required
              />

              <button
                type="submit"
                className="ai-submit-btn"
                disabled={predictionLoading}
              >
                {predictionLoading ? 'Predicting...' : '✦ Predict Price'}
              </button>
            </form>

            {predictedPrice !== null && (
              <div className="ai-result">
                <span>Estimated Price Per Night</span>
                <h3>₹{Number(predictedPrice).toLocaleString('en-IN')}</h3>
                <p>Predicted by Aurelia's Random Forest model.</p>
              </div>
            )}

            {predictionError && (
              <p className="ai-error">{predictionError}</p>
            )}
          </div>


          {/* Smart Budget Optimizer */}
          <div className="ai-card">
            <span className="ai-label">✦ SMART RECOMMENDATIONS</span>
            <h3>Budget Optimizer</h3>
            <p>Discover highly rated stays that fit your total travel budget.</p>

            <form onSubmit={handleOptimizeBudget}>
              <label>Destination</label>
              <select
                value={budgetForm.destination}
                onChange={(event) =>
                  setBudgetForm({
                    ...budgetForm,
                    destination: event.target.value,
                  })
                }
              >
                {['Manali', 'North Goa', 'Lonavala', 'Munnar', 'Jaipur', 'Shimla', 'Rishikesh', 'Udaipur'].map((place) => (
                  <option key={place} value={place}>{place}</option>
                ))}
              </select>

              <label>Total Budget (₹)</label>
              <input
                type="number"
                min="1"
                value={budgetForm.total_budget}
                onChange={(event) =>
                  setBudgetForm({
                    ...budgetForm,
                    total_budget: event.target.value,
                  })
                }
                required
              />

              <div className="ai-input-row">
                <div>
                  <label>Number of Nights</label>
                  <input
                    type="number"
                    min="1"
                    value={budgetForm.nights}
                    onChange={(event) =>
                      setBudgetForm({
                        ...budgetForm,
                        nights: event.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label>Guests</label>
                  <input
                    type="number"
                    min="1"
                    value={budgetForm.guests}
                    onChange={(event) =>
                      setBudgetForm({
                        ...budgetForm,
                        guests: event.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="ai-submit-btn"
                disabled={budgetLoading}
              >
                {budgetLoading ? 'Finding stays...' : '✦ Find Best Stays'}
              </button>
            </form>

            {budgetError && (
              <p className="ai-error">{budgetError}</p>
            )}

            {recommendations.length > 0 && (
              <div className="ai-result-list">
                <h4>{recommendations.length} Recommended Stays</h4>

                {recommendations.map((stay) => (
                  <div className="ai-recommendation" key={stay.property_id}>
                    <div>
                      <strong>{stay.title}</strong>
                      <p>{stay.location}</p>
                      <span>★ {stay.rating} Rating</span>
                    </div>

                    <div className="ai-recommendation-price">
                      <strong>
                        ₹{Number(stay.total_cost).toLocaleString('en-IN')}
                      </strong>
                      <span>{budgetForm.nights} nights</span>
                      <span>
                        ₹{Number(stay.remaining_budget).toLocaleString('en-IN')} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {recommendations.length === 0 && !budgetLoading && !budgetError && (
              <p className="ai-helper-text">
                Your recommended stays will appear here.
              </p>
            )}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <a href="/" className="brand">
          <span className="brand-icon">a</span>
          aurelia
        </a>

        <p>Find your place in the world.</p>
        <span>© 2026 Aurelia. Made for curious travellers.</span>
      </footer>
    </div>
  )
}

export default App
