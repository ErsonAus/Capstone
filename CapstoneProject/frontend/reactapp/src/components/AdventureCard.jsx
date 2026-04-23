// AdventureCard Component
// Adventure card component displays a single adventure with comprehensive UI
// Includes image, details, cart button, delete button, and comment functionality.

/**
 * IMPORTS
 * Load required libraries and validation tools
 */

// Import PropTypes for runtime type checking of component props
import PropTypes from 'prop-types'

/**
 * AdventureCard Component
 * Displays a single adventure as a card with full details and interactive features
 * 
 * @param {Object} props - Component props
 * @param {Object} props.adventure - Adventure object containing all adventure data
 * @param {string} props.adventure._id - Unique MongoDB ID of the adventure
 * @param {string} props.adventure.title - Title of the adventure
 * @param {string} props.adventure.location - Location where adventure takes place
 * @param {string} props.adventure.summary - Brief description of the adventure
 * @param {number} props.adventure.price - Price of the adventure
 * @param {string} props.adventure.image - URL to the adventure's image
 * @param {string} props.adventure.icon - Emoji icon representing the adventure
 * @param {Array} props.adventure.comments - Array of comment objects
 * @param {boolean} props.isActive - Whether the comment panel is currently visible
 * @param {Function} props.onToggle - Callback to toggle comment panel visibility
 * @param {Function} props.onDelete - Callback to delete the adventure
 * @param {Function} props.onAddToCart - Callback to add adventure to shopping cart
 * @param {Function} props.onAddComment - Callback to submit a new comment
 * @param {Object} props.commentInput - Current comment form input values
 * @param {Function} props.onCommentInputChange - Callback to update comment form inputs
 * @returns {JSX.Element} Adventure card component with all interactive elements
 */
function AdventureCard({
  adventure,
  isActive,
  onToggle,
  onDelete,
  onAddToCart,
  onAddComment,
  commentInput,
  onCommentInputChange
}) {
  /**
   * DESTRUCTURING
   * Extract adventure properties with default values for optional fields
   */
  const {
    // Unique MongoDB ID for this adventure
    _id,
    // Adventure title
    title,
    // Location of the adventure
    location,
    // Brief summary/description
    summary,
    // Price in dollars
    price,
    // URL to the adventure image
    image,
    // Emoji icon - defaults to compass if not provided
    icon = '🧭',
    // Array of user comments - defaults to empty array if not provided
    comments = []
  } = adventure

  /**
   * COMPONENT RENDER
   * Return the complete adventure card JSX structure
   */
  return (
    // Main article element for semantic HTML - represents a self-contained adventure
    <article className="adventure-card">
      
      {/* IMAGE SECTION */}
      {/* Container for the adventure's main image */}
      <div className="card-media">
        {/* Image element with title as alt text for accessibility */}
        <img src={image} alt={title} />
      </div>

      {/* MAIN CONTENT SECTION */}
      {/* Container for all adventure details and interactive elements */}
      <div className="adventure-card-content">
        
        {/* HEADER SECTION - Icon and Title */}
        {/* Header row displaying the adventure icon and title */}
        <div className="adventure-card-header">
          {/* Icon badge container */}
          <div>
            {/* Display the emoji icon that represents this adventure */}
            <p className="icon-badge">{icon}</p>
          </div>
          {/* Adventure title heading */}
          <h3>{title}</h3>
        </div>

        {/* METADATA SECTION */}
        {/* Container for key adventure information: location, price, comment count */}
        <div className="adventure-meta">
          {/* Location with map pin emoji */}
          <span>📍 {location}</span>
          {/* Price with dollar emoji - formatted to whole number */}
          <span>💲{price.toFixed(0)}</span>
          {/* Number of comments posted on this adventure */}
          <span>{comments.length} comments</span>
        </div>

        {/* DESCRIPTION SECTION */}
        {/* Detailed summary/description of the adventure */}
        <p className="adventure-card-details">{summary}</p>

        {/* ACTION BUTTONS SECTION */}
        {/* Row of interactive buttons for user actions */}
        <div className="adventure-actions">
          {/* Button to add this adventure to the user's shopping cart */}
          <button className="button-primary" onClick={onAddToCart}>
            Add to cart
          </button>
          
          {/* Button to toggle visibility of the comment panel */}
          <button className="button-secondary" onClick={onToggle}>
            {/* Conditional text based on whether comments are currently visible */}
            {isActive ? 'Hide comments' : 'Show comments'}
          </button>
          
          {/* Button to delete this adventure */}
          <button className="button-secondary" onClick={onDelete}>
            Delete
          </button>
        </div>

        {/* COMMENT PANEL SECTION */}
        {/* Conditionally render comment panel only when isActive is true */}
        {isActive && (
          <section className="comment-panel">
            {/* Comment section heading */}
            <h4>Comments</h4>
            
            {/* LIST OF EXISTING COMMENTS */}
            {/* Unordered list to display all user comments */}
            <ul className="comment-list">
              {/* Map through all comments and render each one */}
              {comments.map((comment, index) => (
                // List item for each comment - using index as key
                <li key={index} className="comment-item">
                  {/* Comment author name with chat emoji */}
                  <strong>🗣 {comment.name}</strong>
                  {/* The comment text content */}
                  <p>{comment.text}</p>
                </li>
              ))}
            </ul>

            {/* ADD NEW COMMENT FORM */}
            {/* Form for users to submit a new comment on this adventure */}
            <form
              className="comment-form"
              onSubmit={(event) => {
                // Prevent default form submission (page refresh)
                event.preventDefault()
                // Call the parent component's callback with the comment data
                onAddComment({
                  name: commentInput.name,
                  text: commentInput.text
                })
              }}
            >
              {/* Name input - user's name for the comment */}
              <input
                type="text"
                placeholder="Your name"
                value={commentInput.name}
                // Update the name field in parent component state when user types
                onChange={(event) =>
                  onCommentInputChange(_id, 'name', event.target.value)
                }
                required
              />
              
              {/* Comment textarea - main comment content */}
              <textarea
                rows="3"
                placeholder="Write a comment"
                value={commentInput.text}
                // Update the text field in parent component state when user types
                onChange={(event) =>
                  onCommentInputChange(_id, 'text', event.target.value)
                }
                required
              />
              
              {/* Submit button to add the comment */}
              <button type="submit" className="button-primary">
                Add comment
              </button>
            </form>
          </section>
        )}
      </div>
    </article>
  )
}

/**
 * PROP VALIDATION
 * Define and validate the types of props passed to this component
 * Ensures parent components pass correct data types
 */
AdventureCard.propTypes = {
  // adventure must be an object containing adventure data
  adventure: PropTypes.object.isRequired,
  // isActive must be a boolean indicating if comment panel is visible
  isActive: PropTypes.bool.isRequired,
  // onToggle must be a function to toggle comment panel visibility
  onToggle: PropTypes.func.isRequired,
  // onDelete must be a function to delete the adventure
  onDelete: PropTypes.func.isRequired,
  // onAddToCart must be a function to add adventure to shopping cart
  onAddToCart: PropTypes.func.isRequired,
  // onAddComment must be a function to submit a new comment
  onAddComment: PropTypes.func.isRequired,
  // commentInput must be an object containing name and text fields for form inputs
  commentInput: PropTypes.object.isRequired,
  // onCommentInputChange must be a function to update comment form inputs
  onCommentInputChange: PropTypes.func.isRequired
}

// Export the AdventureCard component as the default export
export default AdventureCard