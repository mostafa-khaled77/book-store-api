# Book Store API

A RESTful backend API for a bookstore, built with Node.js, Express, and MongoDB. It provides endpoints for managing books, authors, and users, along with authentication, image uploads, and a password reset flow.

## Features

- Book and author endpoints with create, read, update, and delete operations
- User registration and login with bcrypt password hashing
- JWT-based authentication and admin-only book and author management
- Request validation with Joi
- Book filtering by minimum and maximum price
- Paginated author results
- Image uploads handled by Multer
- Password reset flow using Nodemailer, expiring JWT links, and EJS pages
- Basic request logging, error handling, Helmet, and CORS middleware

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT) and bcryptjs
- **Validation:** Joi
- **Email:** Nodemailer
- **Uploads:** Multer
- **Views:** EJS

## Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB connection string
- Gmail credentials with an app password if you want to test password reset emails

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mostafa-khaled77/book-store-api.git
   cd book-store-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root using `.env.example` as a reference:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   NODE_ENV=development
   JWT_SECRET_KEY=replace_with_a_long_random_secret
   USER_EMAIL=your_email@gmail.com
   USER_PASS=your_gmail_app_password
   ```

   Keep your real `.env` file and credentials private. Do not commit them to GitHub.

4. Create an `images` directory in the project root for uploaded files.

5. Start the development server:

   ```bash
   npm start
   ```

The API runs on `http://localhost:5000` by default. Set `PORT` in `.env` to use another port.

## API Routes

Unless otherwise noted, the API returns JSON. The password reset routes also render HTML pages.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a user |
| `POST` | `/api/auth/login` | Public | Log in and receive a JWT |
| `GET` | `/api/books` | Public | Get all books; optionally filter with `minPrice` and `maxPrice` |
| `GET` | `/api/books/:id` | Public | Get a book by ID |
| `POST` | `/api/books` | Admin | Create a book |
| `PUT` | `/api/books/:id` | Admin | Update a book |
| `DELETE` | `/api/books/:id` | Admin | Delete a book |
| `GET` | `/api/authors` | Public | Get authors; optionally paginate with `pageNumber` |
| `GET` | `/api/authors/:id` | Public | Get an author by ID |
| `POST` | `/api/authors` | Admin | Create an author |
| `PUT` | `/api/authors/:id` | Admin | Update an author |
| `DELETE` | `/api/authors/:id` | Admin | Delete an author |
| `GET` | `/api/users` | Admin | Get all users |
| `GET`, `PUT`, `DELETE` | `/api/users/:id` | Intended for the account owner or an admin | Get, update, or delete a user |
| `POST` | `/api/upload` | Public | Upload a file using the `image` form-data field |
| `GET`, `POST` | `/password/forgot-password` | Public | Display the forgot-password page and request a reset link |
| `GET`, `POST` | `/password/reset-password/:userId/:token` | Public | Display the reset page and submit a new password |

For protected routes, send the JWT in the `token` request header. Newly registered users are not admins by default; admin access must be assigned in the database.

### Example: Register

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "email": "reader@example.com",
  "username": "book-reader",
  "password": "A-strong-password-123!"
}
```

### Example: Filter Books by Price

```http
GET /api/books?minPrice=5&maxPrice=20
```

### Example: Upload an Image

Send a `multipart/form-data` request to `/api/upload` with a file field named `image`.

## Configuration Notes

- Password reset emails use the Gmail credentials in `.env`.
- The reset link currently points to `http://localhost:5000`; update it before deploying the application.
- Uploaded files are saved locally in the `images` directory. For production, consider using managed object storage.
- Configure CORS and other security settings for your deployment environment before exposing the API publicly.

## Contributing

Issues and pull requests are welcome. If you find a bug or have an idea for an improvement, please open an issue to discuss it.

## License

This project is licensed under the ISC license.
