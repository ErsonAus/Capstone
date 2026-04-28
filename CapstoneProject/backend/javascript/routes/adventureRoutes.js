// Defines RESTful routes for the adventure API.
// Maps HTTP requests to controller functions for handling adventure operations.

// Import the Express framework for building web applications
const express = require('express')
// Create a new router instance to define routes modularly
const router = express.Router()
// Import the adventure controller that contains the business logic for handling requests
const adventureController = require('../controllers/adventureController')

/**
 * GET / - Retrieve all adventures
 * HTTP Method: GET
 * Endpoint: / (base path of this router)
 * Handler: getAllAdventures controller function
 * Returns: Array of all adventures from the database, sorted by title
 */
router.get('/', adventureController.getAllAdventures)
router.post('/email', adventureController.sendEmail)
router.post('/bulkadd', adventureController.findOrInsert)
/**
 * POST / - Create a new adventure
 * HTTP Method: POST
 * Endpoint: / (base path of this router)
 * Handler: createAdventure controller function
 * Request Body: Should contain { title, location, summary, price, image, icon }
 * Returns: The newly created adventure object with 201 status code
 */
router.post('/', adventureController.createAdventure)

/**
 * DELETE /:id - Delete an adventure by ID
 * HTTP Method: DELETE
 * Endpoint: /:id (where :id is the adventure's MongoDB ID)
 * Handler: deleteAdventure controller function
 * URL Parameter: id - The unique identifier of the adventure to delete
 * Returns: Success response or 404 error if adventure not found
 */
router.delete('/:id', adventureController.deleteAdventure)
/**
 * PUT /:id - Update an adventure by ID
 * HTTP Method: PUT
 * Endpoint: /:id (where :id is the adventure's MongoDB ID)
 * Handler: editAdventure controller function
 * URL Parameter: id - The unique identifier of the adventure to update
 * Request Body: Should contain the fields to update
 * Returns: Success response or 404 error if adventure not found
 */
router.put('/:id', adventureController.editAdventure)
/**
 * POST /:id/comments - Add a comment to an existing adventure
 * HTTP Method: POST
 * Endpoint: /:id/comments (nested route for adding comments)
 * Handler: addComment controller function
 * URL Parameter: id - The unique identifier of the adventure to comment on
 * Request Body: Should contain { name, text } for the comment author and content
 * Returns: The updated adventure object with the new comment added
 */
router.post('/:id/comments', adventureController.addComment)

// Export the configured router so it can be used in the main application file
// This allows the routes to be mounted on a specific path (e.g., /api/adventures)
module.exports = router