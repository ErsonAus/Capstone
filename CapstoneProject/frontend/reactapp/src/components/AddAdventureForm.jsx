// AddAdventureForm Component
// Form component to add a new adventure to the internal API.
// Handles form state, validation, and submission to create new adventure entries.

/**
 * IMPORTS
 * Load required React hooks and validation library
 */

// Import useState hook to manage form state
import { useState } from 'react'
// Import PropTypes for runtime type checking of component props
import PropTypes from 'prop-types'

/**
 * AddAdventureForm Component
 * Renders a form for creating new adventure entries with fields for:
 * title, location, summary, price, image URL, and icon selection
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onAddAdventure - Callback function to handle adventure creation
 * @returns {JSX.Element} Form component with input fields and submit button
 */
function AddAdventureForm({ onAddAdventure }) {
  /**
   * Form State Management
   * Initialize state with default values for all form fields
   */
  const [formState, setFormState] = useState({
    // Title of the adventure - user input field
    title: '',
    // Location where the adventure takes place - user input field
    location: '',
    // Brief description/summary of the adventure - textarea field
    summary: '',
    // Price of the adventure in dollars - number input field
    price: '',
    // URL to the adventure's image - user input field
    image: '',
    // Icon emoji to represent the adventure - defaults to compass emoji
    icon: '🧭'
  })

  /**
   * handleChange - Updates form state when any input field changes
   * Uses event delegation to update the specific field that changed
   * 
   * @param {Event} event - The change event from an input element
   */
  function handleChange(event) {
    // Destructure the name and value from the input element that triggered the event
    const { name, value } = event.target
    // Update the specific form field while preserving other fields using spread operator
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  /**
   * handleSubmit - Processes form submission and creates a new adventure
   * Converts price to number, calls parent component callback, and resets form
   * 
   * @param {Event} event - The form submission event
   */
  function handleSubmit(event) {
    // Prevent default form submission behavior (page refresh)
    event.preventDefault()
    // Create adventure object with form data, converting price from string to number
    const adventure = {
      ...formState,
      price: Number(formState.price)
    }
    // Call the parent component callback function to add the adventure to the list
    onAddAdventure(adventure)
    // Reset form state to initial values for creating another adventure
    setFormState({
      title: '',
      location: '',
      summary: '',
      price: '',
      image: '',
      icon: '🧭'
    })
  }

  /**
   * COMPONENT RENDER
   * Return the form JSX with all input fields
   */
  return (
    <div>
      {/* Form section heading */}
      <h2>Add a new adventure</h2>
      
      {/* Main form element with onSubmit handler */}
      <form className="adventure-form" onSubmit={handleSubmit}>
        
        {/* First row: Title and Location inputs */}
        <div className="form-row">
          {/* Adventure title input field */}
          <input
            name="title"
            value={formState.title}
            onChange={handleChange}
            placeholder="Adventure title"
            required
          />
          
          {/* Location input field */}
          <input
            name="location"
            value={formState.location}
            onChange={handleChange}
            placeholder="Location"
            required
          />
        </div>
        
        {/* Summary textarea - provides space for longer descriptions */}
        <textarea
          name="summary"
          value={formState.summary}
          onChange={handleChange}
          placeholder="Short summary"
          rows="4"
          required
        />
        
        {/* Second row: Price and Image URL inputs */}
        <div className="form-row">
          {/* Price input field - numeric only, minimum value of 0 */}
          <input
            name="price"
            value={formState.price}
            onChange={handleChange}
            placeholder="Price"
            type="number"
            min="0"
            required
          />
          
          {/* Image URL input field for adventure photo */}
          <input
            name="image"
            value={formState.image}
            onChange={handleChange}
            placeholder="Image URL"
            required
          />
        </div>
        
        {/* Third row: Icon selection dropdown */}
        <div className="form-row">
          {/* Label and select dropdown for icon emoji */}
          <label>
            Icon
            {/* Dropdown menu with predefined emoji options */}
            <select name="icon" value={formState.icon} onChange={handleChange}>
              {/* Compass emoji option - default selection */}
              <option value="🧭">🧭 Compass</option>
              {/* Beach emoji option */}
              <option value="🏖️">🏖️ Beach</option>
              {/* Nature/landscape emoji option */}
              <option value="🏞️">🏞️ Nature</option>
              {/* Desert emoji option */}
              <option value="🏜️">🏜️ Desert</option>
            </select>
          </label>
        </div>
        
        {/* Submit button to create the adventure */}
        <button type="submit" className="button-primary">
          Add adventure
        </button>
      </form>
    </div>
  )
}

/**
 * PROP VALIDATION
 * Define and validate the types of props passed to this component
 * Ensures the parent component passes required props correctly
 */
AddAdventureForm.propTypes = {
  // onAddAdventure must be a function and is required for form submission
  onAddAdventure: PropTypes.func.isRequired
}

// Export the AddAdventureForm component as the default export
export default AddAdventureForm