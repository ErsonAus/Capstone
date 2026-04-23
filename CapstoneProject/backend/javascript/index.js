// Main backend entry point
// Sets up Express server, MongoDB connection, and configures adventure API routes.

/**
 * IMPORTS AND DEPENDENCIES
 * Load required libraries and modules for the application
 */

// Import Express.js framework for building the REST API server
const express = require('express')
// Import CORS middleware to enable cross-origin requests from the frontend
const cors = require('cors')
// Import Mongoose for MongoDB database operations and schema validation
const mongoose = require('mongoose')
// Import the adventure routes module containing all adventure-related endpoints
const adventureRoutes = require('./routes/adventureRoutes')

/**
 * APPLICATION SETUP AND CONFIGURATION
 * Initialize the Express app and define configuration variables
 */

// Create a new Express application instance
const app = express()
// Set the server port - use environment variable if available, otherwise default to 5000
const PORT = process.env.PORT || 5000
// Set the MongoDB connection URI - use environment variable if available, otherwise connect to local MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/australia-adventures'

/**
 * MIDDLEWARE CONFIGURATION
 * Set up middleware to handle requests and responses
 */

// Enable CORS (Cross-Origin Resource Sharing) middleware to allow requests from different domains
app.use(cors())
// Enable JSON body parser middleware to automatically parse incoming JSON request bodies
app.use(express.json())

/**
 * ROUTE DEFINITIONS
 * Define API endpoints and their handlers
 */

// Mount the adventure routes at the '/api/adventures' prefix
// All routes in adventureRoutes will be accessible at /api/adventures/*
app.use('/api/adventures', adventureRoutes)

/**
 * HEALTH CHECK ENDPOINT
 * Provides a simple endpoint to verify the server is running
 */
// Define a GET endpoint for health checks
app.get('/api/health', (req, res) => {
  // Return a JSON response indicating the server is healthy and operational
  res.json({ status: 'ok', service: 'Adventure API' })
})

/**
 * DATABASE CONNECTION AND SERVER STARTUP
 * Connect to MongoDB and start listening for incoming requests
 */

// Attempt to connect to MongoDB using Mongoose
mongoose
  .connect(MONGODB_URI, {
   
  })
  // Handle successful connection to MongoDB
  .then(() => {
    // Log confirmation that MongoDB connection was successful
    console.log('Connected to MongoDB')
    // Once connected to the database, start the Express server
    app.listen(PORT, () => {
      // Log the server URL and port so developers know where to access the API
      console.log(`Server listening on http://localhost:${PORT}`)
    })
  })
  // Handle any errors that occur during the MongoDB connection attempt
  .catch((error) => {
    // Log the connection error for debugging purposes
    console.error('MongoDB connection error:', error)
    // Exit the process with error code 1 since the app cannot run without the database
    process.exit(1)
  })