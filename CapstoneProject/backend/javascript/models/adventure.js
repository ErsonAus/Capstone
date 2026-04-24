// Adventure model describes an Australian adventure trip
// Includes title, location, description, price, image, and comments.

// Import mongoose library for database schema and model creation
const mongoose = require('mongoose')

/**
 * commentSchema - Defines the structure for comments on adventures
 * Each comment stores the author's name, comment text, and creation timestamp
 */
const commentSchema = new mongoose.Schema(
  {
    // Author name of the comment - required field, whitespace trimmed automatically
    name: { type: String, required: true, trim: true },
    // The comment text content - required field, whitespace trimmed automatically
    text: { type: String, required: true, trim: true },
    // Timestamp when the comment was created - automatically set to current date/time
    createdAt: { type: Date, default: Date.now }
  },
  // { _id: false } - Prevents MongoDB from creating an _id field for each comment
  // { _id: false }
)

/**
 * adventureSchema - Defines the structure for adventure trip documents
 * Stores all information about an Australian adventure including pricing and user comments
 */
const adventureSchema = new mongoose.Schema(
  {
    // Title of the adventure trip - required, string type with automatic whitespace trimming
    title: { type: String, required: true, trim: true },
    // Location where the adventure takes place - required field with whitespace trimmed
    location: { type: String, required: true, trim: true },
    // Brief description/summary of the adventure - required field with whitespace trimmed
    summary: { type: String, required: true, trim: true },
    // Price of the adventure in dollars - required number field with minimum value of 0
    price: { type: Number, required: true, min: 0 },
    // URL/path to the adventure's image - required field with whitespace trimmed
    image: { type: String, required: true, trim: true },
    // Icon emoji or symbol for the adventure - defaults to compass emoji if not provided
    icon: { type: String, default: '🧭', trim: true },
    // Array of comment objects using the commentSchema defined above - defaults to empty array
    comments: {
      type: [commentSchema],
      default: []
    }
  },
  // { timestamps: true } - Automatically adds createdAt and updatedAt fields to track when records are created/modified
  { timestamps: true }
)

// Export the Adventure model by combining the adventureSchema with the 'Adventure' collection name
// This model is used to interact with the MongoDB database for CRUD operations
module.exports = mongoose.model('Adventure', adventureSchema)