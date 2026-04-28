# 🦘 Aussie Adventures

> **Privacy-first travel booking platform. Affordable adventures. Your data stays yours.**

Aussie Adventures is a full-stack web application that allows users to browse, book, and review Australian travel adventures — without sacrificing their personal data. Built with React, Node.js, Express, and MongoDB.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Screenshots](#screenshots)
- [GitHub](#github)

---

## Features

- Browse a list of Australian adventures with images, locations, and prices
- Add, edit, and delete adventures (admin)
- Add adventures to a cart and proceed to checkout
- Email confirmation sent on booking via Nodemailer
- Anonymous comments on each adventure — add, edit, and delete
- Privacy-first — no user data stored or shared without consent
- Australian flag themed UI built with Material UI

---

## Tech Stack

**Frontend**
- React 18
- Material UI (MUI) v9
- React Router v6
- Vite

**Backend**
- Node.js
- Express.js (MVC architecture)
- Mongoose
- Nodemailer

**Database**
- MongoDB (local)

**Testing**
- Jest
- Thunder Client

**Version Control**
- GitHub

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js v18 or higher
- MongoDB running locally
- npm

### Clone the repository

```bash
git clone https://github.com/ErsonAus/Capstone.git
cd Capstone
```

### Install backend dependencies

```bash
cd backend
npm install
```

### Install frontend dependencies

```bash
cd frontend
npm install
```

### Set up environment variables

Create a `.env` file in the backend root (see [Environment Variables](#environment-variables) below).

### Run the backend

```bash
cd backend
npm start
```

Server runs on `http://localhost:5000`

### Run the frontend

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Environment Variables

Create a `.env` file in your backend directory with the following:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/australia-adventures
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_16_char_app_password
```

> **Never commit your `.env` file to GitHub.** Make sure `.env` is listed in your `.gitignore`.

To generate a Gmail App Password:
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security → 2-Step Verification → App Passwords
3. Generate a password for "Nodemailer"
4. Paste the 16 character password into `EMAIL_PASS`

---

## API Endpoints

### Adventures

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/adventures` | Get all adventures |
| GET | `/api/adventures/:id` | Get adventure by ID |
| POST | `/api/adventures` | Create a new adventure |
| PUT | `/api/adventures/:id` | Update an adventure |
| DELETE | `/api/adventures/:id` | Delete an adventure |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/adventures/:id/comments` | Add a comment |
| PUT | `/api/adventures/:id/comments/:commentId` | Edit a comment |
| DELETE | `/api/adventures/:id/comments/:commentId` | Delete a comment |

### Email

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/email/send` | Send booking confirmation email |

**Email request body:**
```json
{
  "to": "recipient@email.com",
  "subject": "Booking Confirmation",
  "name": "Adventurer",
  "message": "Great Barrier Reef Dive (x1). Total: $299.00 AUD"
}
```

---

## Project Structure

```
Capstone/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adventureController.js
│   │   └── emailController.js
│   ├── models/
│   │   └── Adventure.js
│   ├── routes/
│   │   ├── adventureRoutes.js
│   │   └── emailRoutes.js
│   ├── services/
│   │   └── emailService.js
│   ├── templates/
│   │   └── emailTemplate.js
│   ├── .env
│   ├── .gitignore
│   ├── index.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── context/
    │   │   └── CartContext.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── AdventureCard.jsx
    │   ├── pages/
    │   │   ├── Adventures.jsx
    │   │   └── Checkout.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Testing

### Jest & Supertest

Integration tests are written using Jest and Supertest and cover all API routes. Tests run against a separate test database so real data is never touched.

**Install dependencies:**
```bash
npm install --save-dev jest supertest --ignore-scripts
```

**Run the tests:**
```bash
npm test
```

Or with verbose output to see each individual test:
```bash
npm test -- --verbose
```

**Test coverage — 22 tests across 6 route groups:**

| Route | Tests |
|-------|-------|
| `GET /api/adventures` | Empty array, sorted results, correct fields |
| `POST /api/adventures` | Create success, default icon, missing fields, DB save |
| `PUT /api/adventures/:id` | Update success, DB update, 404, invalid ID |
| `DELETE /api/adventures/:id` | Delete success, DB removal, 404, invalid ID |
| `POST /api/adventures/:id/comments` | Add comment, multiple comments, DB save, 404, invalid ID |
| `POST /api/adventures/email` | Send success, missing fields |

**Expected output:**
```
PASS  ./app.test.js
  GET /api/adventures
    ✓ returns 200 and an empty array when no adventures exist
    ✓ returns 200 and all adventures sorted alphabetically by title
    ✓ returns adventures with expected fields
  POST /api/adventures
    ✓ creates a new adventure and returns 201 with the adventure object
    ✓ uses default compass icon when no icon is provided
    ✓ returns 400 when required fields are missing
    ✓ saves the adventure to the database
  ...
Tests: 22 passed, 22 total
```

> **Note:** The `image` field is required in the Adventure model. All test data must include a valid image URL string.

**Required `package.json` configuration:**
```json
"scripts": {
    "start": "nodemon index.js",
    "test": "./node_modules/.bin/jest"
},
"jest": {
    "testEnvironment": "node",
    "testTimeout": 10000
}
```

**Required `index.js` pattern** — the server must only start when run directly, not when imported by Jest:
```javascript
if (require.main === module) {
    mongoose.connect(MONGODB_URI).then(() => {
        app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`))
    })
}
module.exports = app
```

### Thunder Client

API endpoints can also be tested manually using Thunder Client in VS Code.

**Health check:**
```
GET http://localhost:4500/api/health
```

Expected response:
```json
{ "status": "ok", "service": "Adventure API" }
```

**Create adventure:**
```
POST http://localhost:4500/api/adventures
Content-Type: application/json

{
  "title": "Great Barrier Reef Dive",
  "location": "Queensland",
  "summary": "Dive into the world's largest coral reef system.",
  "price": 299,
  "image": "https://picsum.photos/seed/reef/600/300",
  "icon": "🤿"
}
```

**Send booking email:**
```
POST http://localhost:4500/api/adventures/email
Content-Type: application/json

{
  "to": "recipient@email.com",
  "subject": "Booking Confirmation",
  "message": "Great Barrier Reef Dive (x1). Total: $299.00 AUD"
}
```

---

## Screenshots

> Add screenshots of your running application here.

| Page | Description |
|------|-------------|
| Adventures | Main listing page with adventure cards |
| Checkout | Cart and payment page |
| Email | Booking confirmation email |

---

## Out of Scope

The following features are planned for future development:

- Adventure images and videos uploaded by users
- User authentication and admin login
- AWS EC2 / Docker deployment
- Public user profiles and shared feedback

---

## References

- [React](https://react.dev)
- [Material UI](https://mui.com)
- [Express.js](https://expressjs.com)
- [Mongoose](https://mongoosejs.com)
- [Nodemailer](https://nodemailer.com)
- [MongoDB](https://mongodb.com)
- [Vite](https://vitejs.dev)
- [Jest](https://jestjs.io)
- Cybernews — Travel app privacy investigation

---

## Author

**Erson Kice**
GitHub: [github.com/ErsonAus/Capstone](https://github.com/ErsonAus/Capstone)

---

> *Privacy-first adventures across the Lucky Country. Your data stays yours — your memories don't have to.*
