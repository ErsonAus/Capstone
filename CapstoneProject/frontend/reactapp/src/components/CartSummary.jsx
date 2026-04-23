// CartSummary Component
// Cart summary component shows added adventures in the shopping cart and removal option.
// Displays a list of cart items or an empty state message if no items are present.

/**
 * IMPORTS
 * Load required libraries and validation tools
 */

// Import PropTypes for runtime type checking of component props
import PropTypes from 'prop-types'

/**
 * CartSummary Component
 * Displays a summary list of all adventures added to the shopping cart
 * Shows empty cart message when no items are in the cart
 * Provides remove buttons for each cart item
 * 
 * @param {Object} props - Component props
 * @param {Array} props.cart - Array of adventure objects currently in the shopping cart
 * @param {string} props.cart[].title - Title of the adventure in the cart
 * @param {string} props.cart[]._id - Unique MongoDB ID of the adventure
 * @param {Function} props.onRemoveFromCart - Callback function to remove an adventure from the cart
 * @returns {JSX.Element} Cart summary component with items list or empty state
 */
function CartSummary({ cart, onRemoveFromCart }) {
  /**
   * EMPTY CART CHECK
   * If the cart is empty, display a message instead of an empty list
   * This provides better user experience by letting users know the cart is empty
   */
  if (cart.length === 0) {
    // Return empty state message when no items are in the cart
    return <p className="cart-empty">Your cart is empty.</p>
  }

  /**
   * COMPONENT RENDER
   * Display the cart items in a list format when cart has items
   */
  return (
    // Container div for the entire cart summary
    <div className="cart-summary">
      {/* Unordered list to display cart items */}
      <ul>
        {/* Map through each item in the cart array to render a list item */}
        {cart.map((item) => (
          // List item for each cart entry
          // Using item._id as the key for React's list rendering optimization
          <li key={item._id} className="cart-item">
            {/* Display the adventure title */}
            <span>{item.title}</span>
            
            {/* Remove button for this cart item */}
            <button
              className="button-secondary"
              // Call the remove callback with the adventure's ID when clicked
              onClick={() => onRemoveFromCart(item._id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * PROP VALIDATION
 * Define and validate the types of props passed to this component
 * Ensures parent components pass correct data types
 */
CartSummary.propTypes = {
  // cart must be an array of adventure objects currently in the shopping cart
  cart: PropTypes.array.isRequired,
  // onRemoveFromCart must be a function to remove items from the cart
  onRemoveFromCart: PropTypes.func.isRequired
}

// Export the CartSummary component as the default export
export default CartSummary