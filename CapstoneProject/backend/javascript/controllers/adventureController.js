// Controller functions for adventure API operations
// Handles list, create, delete, and comment creation.
const transporter = require('../services/email.js')
// Import the Adventure model for database operations
const Adventure = require('../models/Adventure')
const { emailTemplate } = require('../services/emailTemplate.js')
/**
 * getAllAdventures - Retrieves all adventures from the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} Array of all adventures sorted alphabetically by title
 */
async function getAllAdventures(req, res) {
  try {
    // Query the database for all adventures and sort them by title in ascending order
    const adventures = await Adventure.find().sort({ title: 1 })
    // Send the adventures array as a JSON response to the client
    res.json(adventures)
  } catch (error) {
    // Handle any database or server errors with a 500 status code
    res.status(500).json({ error: 'Unable to load adventures' })
  }
}
/**
 * findOrInsert - Inserts adventures that don't already exist, skips duplicates by title
 * @param {Object} req - Express request object containing array of adventures in req.body.adventures
 * @param {Object} res - Express response object
 * @returns {JSON} Summary of inserted vs skipped adventures
 */
async function findOrInsert(req, res) {
  try {
    const { adventures } = req.body

    // Validate that we received an array with at least one item
    if (!Array.isArray(adventures) || adventures.length === 0) {
      return res.status(400).json({ error: 'adventures must be a non-empty array' })
    }

    const inserted = []
    const skipped = []

    // Loop through each adventure and check if it already exists by title
    for (const data of adventures) {
      const existing = await Adventure.findOne({ title: data.title })

      if (existing) {
        // Already exists — skip it and record the title
        skipped.push(data.title)
      } else {
        // Doesn't exist — create and save it
        const adventure = new Adventure({
          ...data,
          icon: data.icon || ':compass:'
        })
        await adventure.save()
        inserted.push(adventure)
      }
    }

    res.status(201).json({
      message: `${inserted.length} inserted, ${skipped.length} skipped`,
      inserted,
      skipped
    })
  } catch (error) {
    res.status(400).json({ error: 'Unable to process adventures', detail: error.message })
  }
}

/**
 * createAdventure - Creates a new adventure in the database
 * @param {Object} req - Express request object containing adventure data in req.body
 * @param {Object} res - Express response object
 * @returns {JSON} The newly created adventure object with a 201 status code
 */
async function createAdventure(req, res) {
  try {
    // Destructure the adventure data from the request body
    const { title, location, summary, price, image, icon } = req.body
    // Create a new Adventure instance with the provided data
    const adventure = new Adventure({
      title,
      location,
      summary,
      price,
      image,
      // Use provided icon or default to compass emoji if not provided
      icon: icon || '🧭'
    })
    // Save the new adventure to the database
    await adventure.save()
    // Return the saved adventure with a 201 (Created) status code
    res.status(201).json(adventure)
  } catch (error) {
    // Handle validation or data errors with a 400 status code
    res.status(400).json({ error: 'Invalid adventure data' })
  }
}

/**
 * deleteAdventure - Deletes an adventure from the database by ID
 * @param {Object} req - Express request object containing adventure ID in req.params
 * @param {Object} res - Express response object
 * @returns {JSON} Success message or error response
 */
async function deleteAdventure(req, res) {
  try {
    // Extract the adventure ID from the URL parameters
    const { id } = req.params
    // Find the adventure by ID and delete it from the database in one operation
    const deleted = await Adventure.findByIdAndDelete(id)
    // Check if the adventure was found and deleted
    if (!deleted) {
      // Return a 404 error if the adventure does not exist
      return res.status(404).json({ error: 'Adventure not found' })
    }
    // Return a success response if deletion was successful
    res.json({ success: true })
  } catch (error) {
    // Handle any database or server errors with a 500 status code
    res.status(500).json({ error: 'Unable to delete adventure' })
  }
}

/**
 * updateAdventure - Updates an adventure from the database by ID
 * @param {Object} req - Express request object containing adventure ID in req.params
 * @param {Object} res - Express response object
 * @returns {JSON} Success message or error response
 */
async function editAdventure(req, res) {
  try {
    // Extract the adventure ID from the URL parameters
    const { id } = req.params
    const body = req.body
    console.log (req.body)
    // Find the adventure by ID and updates it from the database in one operation
    const edited = await Adventure.findByIdAndUpdate(id, body)
    // Check if the adventure was found and edited
    if (!edited) {
      // Return a 404 error if the adventure does not exist
      return res.status(404).json({ error: 'Adventure not found' })
    }
    // Return a success response if updation was successful
    res.json({ success: true })
  } catch (error) {
    // Handle any database or server errors with a 500 status code
    res.status(500).json({ error: 'Unable to update adventure' })
  }
}


/**
 * addComment - Adds a comment to an existing adventure
 * @param {Object} req - Express request object containing adventure ID in req.params and comment data in req.body
 * @param {Object} res - Express response object
 * @returns {JSON} The updated adventure object with the new comment added
 */
async function addComment(req, res) {
  try {
    // Extract the adventure ID from the URL parameters
    const { id } = req.params
    // Destructure the comment author name and text from the request body
    const { name, text } = req.body
    // Query the database to find the adventure by its ID
    const adventure = await Adventure.findById(id)
    // Check if the adventure exists in the database
    if (!adventure) {
      // Return a 404 error if the adventure does not exist
      return res.status(404).json({ error: 'Adventure not found' })
    }

    // Add a new comment object to the adventure's comments array
    adventure.comments.push({ name, text })
    // Save the updated adventure with the new comment to the database
    await adventure.save()
    // Return the updated adventure object as a JSON response
    res.json(adventure)
  } catch (error) {
    // Handle validation or data errors with a 400 status code
    res.status(400).json({ error: 'Unable to add comment' })
  }
}



const sendEmail = async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: emailTemplate('Erson',message),
      // or use html instead of text:
      // html: `<h1>${message}</h1>`
    };

    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: 'Email sent successfully',
      messageId: info.messageId
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};











// Export all controller functions to make them available for use in route handlers
module.exports = {
  getAllAdventures,
  createAdventure,
  deleteAdventure,
  addComment,sendEmail,
  editAdventure,
  findOrInsert
}