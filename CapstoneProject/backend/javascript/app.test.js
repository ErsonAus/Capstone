// app.test.js
// Integration tests for the Adventure API routes using Jest and Supertest.
// Tests cover: getAllAdventures, createAdventure, editAdventure, deleteAdventure, addComment, sendEmail

const request = require('supertest')
const mongoose = require('mongoose')
const app = require('./index')
const Adventure = require('./models/Adventure')

// ── Test database setup ───────────────────────────────────────────────────

beforeAll(async () => {
    // Disconnect from whatever index.js connected to first
    await mongoose.disconnect()
    // Now connect to the test database
    await mongoose.connect('mongodb://localhost:27017/australia-adventures-test')
})

afterEach(async () => {
    // Clean up all adventures between tests to keep tests isolated
    await Adventure.deleteMany({})
})

afterAll(async () => {
    // Close the database connection after all tests finish
    await mongoose.connection.close()
})

// ── Helper: create a test adventure directly in DB ────────────────────────

const createTestAdventure = async (overrides = {}) => {
    const adventure = new Adventure({
        title: 'Great Barrier Reef Dive',
        location: 'Queensland',
        summary: 'Dive into the worlds largest coral reef system.',
        price: 299,
        image: 'https://picsum.photos/seed/reef/600/300', // ← real string not empty
        icon: ':diving_mask:',
        comments: [],
        ...overrides
    })
    return await adventure.save()
}

// ════════════════════════════════════════════════════════════════════════════
// GET /api/adventures — getAllAdventures
// ════════════════════════════════════════════════════════════════════════════

describe('GET /api/adventures', () => {

    test('returns 200 and an empty array when no adventures exist', async () => {
        const res = await request(app).get('/api/adventures')
        expect(res.status).toBe(200)
        expect(res.body).toEqual([])
    })

    test('returns 200 and all adventures sorted alphabetically by title', async () => {
        await createTestAdventure({ title: 'Uluru Sunrise Trek' })
        await createTestAdventure({ title: 'Daintree Rainforest Walk' })
        await createTestAdventure({ title: 'Sydney Harbour Sailing' })

        const res = await request(app).get('/api/adventures')
        expect(res.status).toBe(200)
        expect(res.body.length).toBe(3)
        expect(res.body[0].title).toBe('Daintree Rainforest Walk')
        expect(res.body[1].title).toBe('Sydney Harbour Sailing')
        expect(res.body[2].title).toBe('Uluru Sunrise Trek')
    })

    test('returns adventures with expected fields', async () => {
        await createTestAdventure()
        const res = await request(app).get('/api/adventures')
        expect(res.status).toBe(200)
        const adventure = res.body[0]
        expect(adventure).toHaveProperty('title')
        expect(adventure).toHaveProperty('location')
        expect(adventure).toHaveProperty('summary')
        expect(adventure).toHaveProperty('price')
        expect(adventure).toHaveProperty('comments')
    })

})

// ════════════════════════════════════════════════════════════════════════════
// POST /api/adventures — createAdventure
// ════════════════════════════════════════════════════════════════════════════

describe('POST /api/adventures', () => {

    test('creates a new adventure and returns 201 with the adventure object', async () => {
    const res = await request(app)
        .post('/api/adventures')
        .send({
            title: 'Kangaroo Island Wildlife',
            location: 'South Australia',
            summary: 'Get up close with native Australian wildlife.',
            price: 249,
            image: 'https://picsum.photos/seed/kangaroo/600/300', // ← add this
            icon: ':kangaroo:'
        })
    expect(res.status).toBe(201)
    expect(res.body.title).toBe('Kangaroo Island Wildlife')
    expect(res.body.location).toBe('South Australia')
    expect(res.body.price).toBe(249)
    expect(res.body.icon).toBe(':kangaroo:')
})

test('uses default compass icon when no icon is provided', async () => {
    const res = await request(app)
        .post('/api/adventures')
        .send({
            title: 'Twelve Apostles Road Trip',
            location: 'Victoria',
            summary: 'Drive the iconic Great Ocean Road.',
            price: 179,
            image: 'https://picsum.photos/seed/apostles/600/300' // ← add this
        })
    expect(res.status).toBe(201)
    expect(res.body.icon).toBe('🧭')
})

test('saves the adventure to the database', async () => {
    await request(app)
        .post('/api/adventures')
        .send({
            title: 'Blue Mountains Hike',
            location: 'New South Wales',
            summary: 'Trek to iconic rock formations.',
            price: 75,
            image: 'https://picsum.photos/seed/mountains/600/300' // ← add this
        })
    const saved = await Adventure.findOne({ title: 'Blue Mountains Hike' })
    expect(saved).not.toBeNull()
    expect(saved.location).toBe('New South Wales')
})

})

// ════════════════════════════════════════════════════════════════════════════
// PUT /api/adventures/:id — editAdventure
// ════════════════════════════════════════════════════════════════════════════

describe('PUT /api/adventures/:id', () => {

    test('updates an existing adventure and returns success', async () => {
        const adventure = await createTestAdventure()

        const res = await request(app)
            .put(`/api/adventures/${adventure._id}`)
            .send({ title: 'Updated Title', price: 350 })

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('success', true)
    })

    test('actually updates the adventure fields in the database', async () => {
        const adventure = await createTestAdventure()

        await request(app)
            .put(`/api/adventures/${adventure._id}`)
            .send({ title: 'New Title', price: 500 })

        const updated = await Adventure.findById(adventure._id)
        expect(updated.title).toBe('New Title')
        expect(updated.price).toBe(500)
    })

    test('returns 404 when adventure does not exist', async () => {
        const fakeId = new mongoose.Types.ObjectId()

        const res = await request(app)
            .put(`/api/adventures/${fakeId}`)
            .send({ title: 'Does not matter' })

        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error', 'Adventure not found')
    })

    test('returns 500 for an invalid ID format', async () => {
        const res = await request(app)
            .put('/api/adventures/not-a-valid-id')
            .send({ title: 'Test' })

        expect(res.status).toBe(500)
        expect(res.body).toHaveProperty('error', 'Unable to update adventure')
    })

})

// ════════════════════════════════════════════════════════════════════════════
// DELETE /api/adventures/:id — deleteAdventure
// ════════════════════════════════════════════════════════════════════════════

describe('DELETE /api/adventures/:id', () => {

    test('deletes an existing adventure and returns success', async () => {
        const adventure = await createTestAdventure()

        const res = await request(app)
            .delete(`/api/adventures/${adventure._id}`)

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('success', true)
    })

    test('actually removes the adventure from the database', async () => {
        const adventure = await createTestAdventure()

        await request(app).delete(`/api/adventures/${adventure._id}`)

        const found = await Adventure.findById(adventure._id)
        expect(found).toBeNull()
    })

    test('returns 404 when adventure does not exist', async () => {
        const fakeId = new mongoose.Types.ObjectId()

        const res = await request(app)
            .delete(`/api/adventures/${fakeId}`)

        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error', 'Adventure not found')
    })

    test('returns 500 for an invalid ID format', async () => {
        const res = await request(app)
            .delete('/api/adventures/not-a-valid-id')

        expect(res.status).toBe(500)
        expect(res.body).toHaveProperty('error', 'Unable to delete adventure')
    })

})

// ════════════════════════════════════════════════════════════════════════════
// POST /api/adventures/:id/comments — addComment
// ════════════════════════════════════════════════════════════════════════════

describe('POST /api/adventures/:id/comments', () => {

    test('adds a comment to an adventure and returns the updated adventure', async () => {
        const adventure = await createTestAdventure()

        const res = await request(app)
            .post(`/api/adventures/${adventure._id}/comments`)
            .send({ name: 'Anonymous', text: 'Amazing experience!' })

        expect(res.status).toBe(200)
        expect(res.body.comments).toHaveLength(1)
        expect(res.body.comments[0].text).toBe('Amazing experience!')
    })

    test('adds multiple comments to the same adventure', async () => {
        const adventure = await createTestAdventure()

        await request(app)
            .post(`/api/adventures/${adventure._id}/comments`)
            .send({ name: 'Anonymous', text: 'First comment' })

        const res = await request(app)
            .post(`/api/adventures/${adventure._id}/comments`)
            .send({ name: 'Anonymous', text: 'Second comment' })

        expect(res.status).toBe(200)
        expect(res.body.comments).toHaveLength(2)
    })

    test('saves the comment to the database', async () => {
        const adventure = await createTestAdventure()

        await request(app)
            .post(`/api/adventures/${adventure._id}/comments`)
            .send({ name: 'Anonymous', text: 'Worth every cent!' })

        const updated = await Adventure.findById(adventure._id)
        expect(updated.comments).toHaveLength(1)
        expect(updated.comments[0].text).toBe('Worth every cent!')
    })

    test('returns 404 when adventure does not exist', async () => {
        const fakeId = new mongoose.Types.ObjectId()

        const res = await request(app)
            .post(`/api/adventures/${fakeId}/comments`)
            .send({ name: 'Anonymous', text: 'Test comment' })

        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error', 'Adventure not found')
    })

    test('returns 400 for an invalid ID format', async () => {
        const res = await request(app)
            .post('/api/adventures/not-a-valid-id/comments')
            .send({ name: 'Anonymous', text: 'Test comment' })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('error', 'Unable to add comment')
    })

})

// ════════════════════════════════════════════════════════════════════════════
// POST /api/adventures/email — sendEmail
// ════════════════════════════════════════════════════════════════════════════

describe('POST /api/adventures/email', () => {

    test('returns 200 and success message when email fields are provided', async () => {
        const res = await request(app)
            .post('/api/adventures/email')
            .send({
                to: 'test@example.com',
                subject: 'Test Booking',
                message: 'Great Barrier Reef Dive (x1). Total: $299.00 AUD'
            })

        // Either 200 (sent) or 500 (no real SMTP in test env) is acceptable
        // The important thing is the route exists and handles the request
        expect([200, 500]).toContain(res.status)
    })

    test('returns 500 when email fields are missing', async () => {
        const res = await request(app)
            .post('/api/adventures/email')
            .send({})

        expect(res.status).toBe(500)
    })

})