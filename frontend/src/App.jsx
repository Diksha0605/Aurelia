
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [stays, setStays] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchStays() {
      try {
        const response = await fetch(
          'http://localhost:5000/api/properties'
        )

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
  }, [])

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
                defaultValue="2"
                aria-label="Number of guests"
              />
            </div>

            <a href="#stays" className="search-button">
              ↗
            </a>
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
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Budget Banner */}
      <section className="budget-banner" id="budget">
        <span className="budget-symbol">₹</span>

        <div>
          <span className="eyebrow">TRAVEL SMARTER</span>
          <h2>Beautiful stays. Better budgets.</h2>
          <p>
            We are working on smarter ways to help you discover
            stays that fit your travel budget.
          </p>
        </div>

        <a href="#stays" className="budget-link">
          Explore stays ↗
        </a>
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
