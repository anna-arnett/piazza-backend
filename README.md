# piazza-backend
A backend application for a simple social network where users can register, log in, and create posts 

## Tech Stack
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Auth:** JSON Web Tokens (JWT)
- **Validation:** Joi
- **Security:** bcryptjs (password hashing)

## Setup Instructions

1. Clone the repository: git clone https://github.com/anna-arnett/piazza-backend.git
2. Install dependencies: npm install
3. Create .env file
4. Start the server: npm start

## API Endpoints
- **Auth Routes (/api/auth):**
1. POST /auth/register -> Register a new user
2. POST /auth/login    -> Log in and receive JWT

- **User Routes (/api/users):**
1. GET /users          -> Get all users (protected)

- **Post Routes (/api/posts):**
1. GET /posts          -> Get all posts
2. GET /posts/:id      -> Get a specific post (auth required)
3. POST /posts         -> Create a new post (auth required)
4. PUT /posts/:id      -> Create a new post (auth required)
5. DELETE /posts/:id   -> Delete post (auth and ownership required)
