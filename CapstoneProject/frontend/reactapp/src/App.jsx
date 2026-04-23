// App Component
// Main app shell for the Australian adventure website.
// Uses internal API fetch calls, routing, sorting, cart management, and comments.
// Manages all state and orchestrates communication between child components and backend API.

/**
 * IMPORTS
 * Load React hooks, routing, component imports, and styling
 */

// Import React hooks for state management, side effects, and optimization
import { useEffect, useMemo, useState } from 'react'
// Import React Router components for navigation and page routing
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
// Import child components for the application UI
import AddAdventureForm from './components/AddAdventureForm.jsx'
import AdventureCard from './components/AdventureCard.jsx'
import CartSummary from './components/CartSummary.jsx'
import Footer from './components/Footer.jsx'
// Import CSS styling for the application
import './App.css'

/**
 * App Component
 * Main application component that handles all state, API communication, and routing
 * Manages adventures list, shopping cart, sorting, comments, and user feedback messages
 * 
 * @returns {JSX.Element} Complete application structure with routing and all features
 */
function App() {
  /**
   * STATE MANAGEMENT
   * Initialize all state variables for managing application data and UI
   */

  // Array of adventure objects fetched from the API
  const [adventures, setAdventures] = useState([])
  // Array of adventure objects currently in the user's shopping cart
  const [cart, setCart] = useState([])
  // Current sorting mode: 'letters-asc', 'letters-desc', 'price-asc', or 'price-desc'
  const [sortMode, setSortMode] = useState('letters-asc')
  // ID of the adventure whose comments panel is currently open (null if none)
  const [selectedAdventure, setSelectedAdventure] = useState(null)
  // Object storing comment form inputs for each adventure: { adventureId: { name: '', text: '' } }
  const [commentInputs, setCommentInputs] = useState({})
  // Success message to display to the user (cleared after operation)
  const [statusMessage, setStatusMessage] = useState('')
  // Error message to display to the user (cleared when new operation starts)
  const [errorMessage, setErrorMessage] = useState('')
  // Loading state while fetching data from the API
  const [loading, setLoading] = useState(false)

  /**
   * SIDE EFFECTS - useEffect Hook
   * Run the fetchAdventures function when component mounts
   */
  useEffect(() => {
    // Fetch all adventures from the API on component mount
    fetchAdventures()
  }, [])
  // Empty dependency array means this effect runs only once on mount

  /**
   * API COMMUNICATION FUNCTIONS
   * Handle all async operations with the backend API
   */

  /**
   * fetchAdventures - Retrieves all adventures from the backend API
   * Called on component mount and after add/delete/comment operations
   * Updates the adventures state with the fetched data
   * 
   * @async
   */
  async function fetchAdventures() {
    // Set loading state to true to show loading indicator
    setLoading(true)
    // Clear any previous error messages
    setErrorMessage('')
    try {
      // Make GET request to fetch all adventures from the API
      const response = await fetch('/api/adventures')
      // Check if the response was successful
      if (!response.ok) {
        throw new Error('Unable to load adventures')
      }
      // Parse the JSON response body
      const data = await response.json()
      // Update state with the fetched adventures
      setAdventures(data)
    } catch (error) {
      // Set error message if the fetch fails
      setErrorMessage(error.message)
    } finally {
      // Set loading state to false after operation completes (success or error)
      setLoading(false)
    }
  }

  /**
   * handleAddAdventure - Creates a new adventure via the API
   * Called when user submits the AddAdventureForm
   * Sends POST request to create the adventure and refreshes the list
   * 
   * @async
   * @param {Object} adventure - Adventure object containing title, location, summary, price, image, icon
   */
  async function handleAddAdventure(adventure) {
    // Display status message while saving
    setStatusMessage('Saving adventure...')
    try {
      // Make POST request to create a new adventure
      const response = await fetch('/api/adventures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adventure)
      })
      // Check if the response was successful
      if (!response.ok) {
        throw new Error('Could not save adventure')
      }
      // Refresh the adventures list to include the newly created adventure
      await fetchAdventures()
      // Display success message
      setStatusMessage('New adventure added successfully')
    } catch (error) {
      // Display error message if creation fails
      setErrorMessage(error.message)
    }
  }

  /**
   * handleDeleteAdventure - Deletes an adventure via the API
   * Called when user clicks delete button on an adventure card
   * Sends DELETE request and updates local state
   * 
   * @async
   * @param {string} adventureId - MongoDB ID of the adventure to delete
   */
  async function handleDeleteAdventure(adventureId) {
    // Display status message while deleting
    setStatusMessage('Deleting adventure...')
    try {
      // Make DELETE request to remove the adventure
      const response = await fetch(`/api/adventures/${adventureId}`, {
        method: 'DELETE'
      })
      // Check if the response was successful
      if (!response.ok) {
        throw new Error('Could not delete adventure')
      }
      // Remove the deleted adventure from the local adventures array
      setAdventures(adventures.filter((item) => item._id !== adventureId))
      // If the deleted adventure's comment panel was open, close it
      if (selectedAdventure === adventureId) {
        setSelectedAdventure(null)
      }
      // Display success message
      setStatusMessage('Adventure removed from the list')
    } catch (error) {
      // Display error message if deletion fails
      setErrorMessage(error.message)
    }
  }

  /**
   * handleAddComment - Adds a comment to an adventure via the API
   * Called when user submits the comment form
   * Sends POST request and updates the adventure with the new comment
   * 
   * @async
   * @param {string} adventureId - MongoDB ID of the adventure to comment on
   * @param {Object} comment - Comment object containing { name, text }
   */
  async function handleAddComment(adventureId, comment) {
    // Display status message while sending comment
    setStatusMessage('Sending comment...')
    try {
      // Make POST request to add a comment to the adventure
      const response = await fetch(`/api/adventures/${adventureId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment)
      })
      // Check if the response was successful
      if (!response.ok) {
        throw new Error('Could not save comment')
      }
      // Get the updated adventure with the new comment
      const updatedAdventure = await response.json()
      // Update the adventures list with the updated adventure
      setAdventures((prev) =>
        prev.map((item) => (item._id === adventureId ? updatedAdventure : item))
      )
      // Clear the comment form inputs for this adventure
      setCommentInputs((prev) => ({ ...prev, [adventureId]: { name: '', text: '' } }))
      // Display success message
      setStatusMessage('Comment added successfully')
    } catch (error) {
      // Display error message if comment submission fails
      setErrorMessage(error.message)
    }
  }

  /**
   * CART MANAGEMENT FUNCTIONS
   * Handle adding and removing items from the shopping cart
   */

  /**
   * addToCart - Adds an adventure to the shopping cart
   * Prevents duplicate items by checking if adventure is already in cart
   * Updates cart state and displays feedback message
   * 
   * @param {Object} adventure - Adventure object to add to cart
   */
  function addToCart(adventure) {
    // Check if the adventure is already in the cart
    if (cart.some((item) => item._id === adventure._id)) {
      // Display message if adventure is already in cart
      setStatusMessage('This adventure is already in your cart')
      return
    }
    // Add the adventure to the cart array
    setCart((prev) => [...prev, adventure])
    // Display confirmation message with adventure title
    setStatusMessage(`${adventure.title} added to cart`)
  }

  /**
   * removeFromCart - Removes an adventure from the shopping cart
   * Called when user clicks remove button on cart item
   * 
   * @param {string} adventureId - MongoDB ID of the adventure to remove from cart
   */
  function removeFromCart(adventureId) {
    // Filter out the adventure with the matching ID from the cart
    setCart((prev) => prev.filter((item) => item._id !== adventureId))
  }

  /**
   * UI INTERACTION FUNCTIONS
   * Handle user interactions for showing/hiding comment panels and updating forms
   */

  /**
   * toggleSelectedAdventure - Toggles the comment panel visibility for an adventure
   * If the adventure is already selected, closes the panel (set to null)
   * If a different adventure is selected, opens its panel
   * 
   * @param {string} adventureId - MongoDB ID of the adventure to toggle
   */
  function toggleSelectedAdventure(adventureId) {
    // Toggle the selected adventure - open if not selected, close if already selected
    setSelectedAdventure((prev) => (prev === adventureId ? null : adventureId))
  }

  /**
   * handleCommentInputChange - Updates comment form input values for a specific adventure
   * Called when user types in comment form name or text fields
   * Maintains separate form state for each adventure
   * 
   * @param {string} adventureId - MongoDB ID of the adventure
   * @param {string} field - Form field to update: 'name' or 'text'
   * @param {string} value - New value for the form field
   */
  function handleCommentInputChange(adventureId, field, value) {
    // Update the specific field for the specific adventure's comment form
    setCommentInputs((prev) => ({
      ...prev,
      [adventureId]: {
        ...prev[adventureId],
        [field]: value
      }
    }))
  }

  /**
   * SORTING FUNCTIONS
   * Handle sorting adventures by title or price
   */

  /**
   * sortAdventures - Sorts the adventures list based on current sortMode
   * Creates a new array copy to avoid mutating the original
   * Supports four sort modes: title ascending/descending and price ascending/descending
   * 
   * @param {Array} list - Array of adventure objects to sort
   * @returns {Array} New sorted array of adventures
   */
  function sortAdventures(list) {
    // Create a shallow copy of the list to avoid mutating the original
    return [...list].sort((a, b) => {
      // Sort by title alphabetically ascending (A → Z)
      if (sortMode === 'letters-asc') {
        return a.title.localeCompare(b.title)
      }
      // Sort by title alphabetically descending (Z → A)
      if (sortMode === 'letters-desc') {
        return b.title.localeCompare(a.title)
      }
      // Sort by price numerically ascending (low → high)
      if (sortMode === 'price-asc') {
        return a.price - b.price
      }
      // Sort by price numerically descending (high → low)
      if (sortMode === 'price-desc') {
        return b.price - a.price
      }
      // Default: no sorting
      return 0
    })
  }

  /**
   * useMemo Hook - Optimization for sorted adventures list
   * Recomputes only when adventures or sortMode changes
   * Prevents unnecessary re-sorting on every render
   */
  const sortedAdventures = useMemo(() => sortAdventures(adventures), [adventures, sortMode])

  /**
   * COMPONENT RENDER
   * Return the complete application JSX structure with routing
   */
  return (
    // BrowserRouter - Enables routing functionality for the entire application
    <BrowserRouter>
      {/* Main application container */}
      <div className="app-shell">
        
        {/* HEADER - Hero Panel with navigation */}
        <header className="hero-panel">
          {/* Header content section */}
          <div>
            {/* Small eyebrow text above main heading */}
            <p className="eyebrow">Adventure Australia</p>
            {/* Main page heading */}
            <h1>20 Iconic Australian Adventures</h1>
            {/* Hero description text explaining the app functionality */}
            <p className="hero-copy">
              Browse curated outdoor journeys, add trips to your cart, leave a comment, and
              manage your own adventure collection with the internal API.
            </p>
          </div>
          
          {/* Navigation bar with routing links */}
          <nav className="top-nav">
            {/* Link to home page - 'end' prop matches exact path */}
            <NavLink to="/" end>
              Home
            </NavLink>
            {/* Link to about page */}
            <NavLink to="/about">About</NavLink>
          </nav>
        </header>

        {/* STATUS PANEL - Display messages to user */}
        <section className="status-panel">
          {/* Loading indicator shown while fetching adventures */}
          {loading && <p className="status-message">Loading adventures...</p>}
          {/* Success message displayed after successful operations */}
          {statusMessage && <p className="status-message success">{statusMessage}</p>}
          {/* Error message displayed if an operation fails */}
          {errorMessage && <p className="status-message error">{errorMessage}</p>}
        </section>

        {/* ROUTES - Define different pages and content */}
        <Routes>
          
          {/* HOME PAGE ROUTE */}
          <Route
            path="/"
            element={
              <main className="page-content">
                
                {/* CONTROLS GRID - Sorting and cart sections */}
                <section className="controls-grid">
                  
                  {/* SORT CONTROL CARD */}
                  <div className="filter-card">
                    <h2>Sort adventures</h2>
                    {/* Sort mode dropdown selector */}
                    <label>
                      Sort by
                      {/* Select dropdown to change sort mode */}
                      <select value={sortMode} onChange={(event) => setSortMode(event.target.value)}>
                        {/* Sort by title ascending option */}
                        <option value="letters-asc">Title A → Z</option>
                        {/* Sort by title descending option */}
                        <option value="letters-desc">Title Z → A</option>
                        {/* Sort by price ascending option */}
                        <option value="price-asc">Price low → high</option>
                        {/* Sort by price descending option */}
                        <option value="price-desc">Price high → low</option>
                      </select>
                    </label>
                    {/* Button to refresh adventures from the API */}
                    <button className="seed-button" onClick={fetchAdventures}>
                      Refresh adventures
                    </button>
                  </div>

                  {/* CART SUMMARY CARD */}
                  <div className="filter-card">
                    <h2>Your cart</h2>
                    {/* CartSummary component showing cart items */}
                    <CartSummary cart={cart} onRemoveFromCart={removeFromCart} />
                  </div>
                </section>

                {/* ADVENTURE CARDS GRID */}
                <section className="cards-grid">
                  {/* Show empty state if no adventures are available */}
                  {sortedAdventures.length === 0 ? (
                    <div className="empty-state">
                      <h2>No adventures found</h2>
                      <p>Use the form below to add your first Australian adventure.</p>
                    </div>
                  ) : (
                    /* Map through sorted adventures and render a card for each */
                    sortedAdventures.map((adventure) => (
                      // AdventureCard component for each adventure
                      <AdventureCard
                        // Unique key for React list rendering
                        key={adventure._id}
                        // Adventure data object
                        adventure={adventure}
                        // Whether the comment panel is open for this adventure
                        isActive={selectedAdventure === adventure._id}
                        // Callback to toggle comment panel visibility
                        onToggle={() => toggleSelectedAdventure(adventure._id)}
                        // Callback to delete the adventure
                        onDelete={() => handleDeleteAdventure(adventure._id)}
                        // Callback to add adventure to cart
                        onAddToCart={() => addToCart(adventure)}
                        // Callback to submit a new comment
                        onAddComment={(comment) => handleAddComment(adventure._id, comment)}
                        // Current comment form inputs for this adventure
                        commentInput={commentInputs[adventure._id] || { name: '', text: '' }}
                        // Callback to update comment form inputs
                        onCommentInputChange={handleCommentInputChange}
                      />
                    ))
                  )}
                </section>

                {/* ADD ADVENTURE FORM SECTION */}
                <section className="form-section">
                  {/* AddAdventureForm component for creating new adventures */}
                  <AddAdventureForm onAddAdventure={handleAddAdventure} />
                </section>
              </main>
            }
          />
          
          {/* ABOUT PAGE ROUTE */}
          <Route
            path="/about"
            element={
              <main className="page-content about-page">
                {/* About section with company and feature information */}
                <div className="about-copy">
                  <h2>About Adventure Australia</h2>
                  {/* Company description */}
                  <p>
                    This travel website is built with a clean React front-end, a JavaScript
                    back-end, MongoDB persistence, and internal API routes for adventures.
                    It includes card actions, cart functionality, comment posting, and a simple
                    routing layout.
                  </p>
                  
                  {/* Features list heading */}
                  <h3>Features included</h3>
                  {/* List of application features */}
                  <ul>
                    {/* Internal API feature */}
                    <li>Internal API with fetch to /api/adventures</li>
                    {/* Add and delete adventure feature */}
                    <li>Add new adventure form and delete action</li>
                    {/* Comments feature */}
                    <li>Adventure comments inside each card</li>
                    {/* Sorting feature */}
                    <li>Sort by letters or price</li>
                    {/* Responsive design feature */}
                    <li>Responsive layout, same-size images, icon badges</li>
                  </ul>
                </div>
              </main>
            }
          />
          
          {/* CATCH-ALL ROUTE - 404 Not Found page */}
          <Route
            path="*"
            element={
              <main className="page-content not-found">
                {/* Page not found heading */}
                <h2>Page not found</h2>
                {/* Navigation instruction */}
                <p>Use the menu to navigate back to the home page.</p>
              </main>
            }
          />
        </Routes>

        {/* FOOTER - Company information and links */}
        <Footer />
      </div>
    </BrowserRouter>
  )
}

// Export the App component as the default export
// This is the main component that gets rendered in the application
export default App
