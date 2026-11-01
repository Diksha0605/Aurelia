
import './App.css'

const stays = [
  {
    name: 'Cozy Mountain Retreat',
    location: 'Manali, Himachal Pradesh',
    price: 2400,
    rating: 4.92,
    image:
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=900&q=80',
    type: 'Mountain stay',
  },
  {
    name: 'Modern Villa with a Pool',
    location: 'Lonavala, Maharashtra',
    price: 3800,
    rating: 4.88,
    image:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80',
    type: 'Private villa',
  },
  {
    name: 'Peaceful Beach Escape',
    location: 'North Goa, Goa',
    price: 3200,
    rating: 4.95,
    image:
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=900&q=80',
    type: 'Beach stay',
  },
  {
    name: 'A Little Home in the Hills',
    location: 'Munnar, Kerala',
    price: 2100,
    rating: 4.85,
    image:
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=900&q=80',
    type: 'Nature retreat',
  },
]

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#">
          <span className="brand-icon">a.</span>
          <span>Aurelia</span>
        </a>

        <nav className="nav-links">
          <a href="#stays">Explore stays</a>
          <a href="#about">About us</a>
        </nav>

        <div className="nav-actions">
          <a className="host-link" href="#host">
            Become a host
          </a>
          <button className="login-button" type="button">
            ☰ &nbsp; Log in
          </button>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>

            <h1>
              Find a place
              <br />
              that feels like <span>you.</span>
            </h1>

            <p className="hero-description">
              Discover beautiful stays, plan smarter trips, and find a place
              that fits your style and budget.
            </p>

            <form className="search-bar" onSubmit={(event) => {
              event.preventDefault()
              document.getElementById('stays')?.scrollIntoView({
                behavior: 'smooth',
              })
            }}>
              <label className="search-field">
                <span>Where to?</span>
                <input type="text" placeholder="Explore destinations" />
              </label>

              <label className="search-field">
                <span>Check in</span>
                <input type="date" />
              </label>

              <label className="search-field">
                <span>Check out</span>
                <input type="date" />
              </label>

              <button className="search-button" type="submit" aria-label="Search stays">
                ↗
              </button>
            </form>

            <div className="hero-note">
              <span>✦</span> Thoughtful stays. Smarter budgets. Better journeys.
            </div>
          </div>

          <div className="hero-visual">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
              alt="Beautiful modern holiday home surrounded by greenery"
            />
            <div className="image-caption">
              <div>
                <span className="caption-label">A PLACE TO UNWIND</span>
                <h3>Slow mornings, beautiful views.</h3>
              </div>
              <span className="caption-star">✦</span>
            </div>
            <div className="floating-note">
              <span className="sparkle">✧</span>
              <div>
                <strong>Stay within your budget</strong>
                <p>Let your next trip cost less.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="stays-section" id="stays">
          <div className="section-heading">
            <div>
              <span className="eyebrow">HANDPICKED FOR YOU</span>
              <h2>Places worth staying for.</h2>
              <p>Find your kind of getaway, from mountain mornings to coastal sunsets.</p>
            </div>
            <a href="#stays" className="view-all">
              Explore stays <span>↗</span>
            </a>
          </div>

          <div className="stays-grid">
            {stays.map((stay) => (
              <article className="stay-card" key={stay.name}>
                <div className="stay-image">
                  <img src={stay.image} alt={stay.name} />
                  <span className="stay-type">{stay.type}</span>
                  <button
                    className="heart-button"
                    type="button"
                    aria-label={`Save ${stay.name} to favourites`}
                    onClick={(event) => {
                      const button = event.currentTarget
                      button.classList.toggle('saved')
                      button.textContent = button.classList.contains('saved')
                        ? '♥'
                        : '♡'
                    }}
                  >
                    ♡
                  </button>
                </div>

                <div className="stay-details">
                  <div className="stay-title-row">
                    <h3>{stay.name}</h3>
                    <span className="rating">★ {stay.rating}</span>
                  </div>
                  <p>{stay.location}</p>
                  <div className="stay-price">
                    <strong>₹{stay.price.toLocaleString('en-IN')}</strong>
                    <span> / night</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="budget-banner" id="about">
          <div className="budget-symbol">✳</div>
          <div>
            <span className="eyebrow">TRAVEL A LITTLE SMARTER</span>
            <h2>Your budget deserves a better stay.</h2>
            <p>
              Aurelia is being built to help you discover stays that match
              your preferences without stretching your budget.
            </p>
          </div>
          <a href="#stays" className="budget-link">
            Find your stay ↗
          </a>
        </section>

        <footer className="footer" id="host">
          <a className="brand" href="#">
            <span className="brand-icon">a.</span>
            <span>Aurelia</span>
          </a>
          <p>Made for the way you want to travel.</p>
          <span>© 2026 Aurelia</span>
        </footer>
      </main>
    </div>
  )
}

export default App
