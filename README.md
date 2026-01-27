# Easy Kitchen Backend API

A RESTful API backend for the Easy Kitchen application, built with Node.js, Express, and MongoDB (MEAN stack).

## 📚 Documentation

- **[Swagger Complete](SWAGGER_COMPLETE.md)** - ✨ **NEW!** Complete API documentation (42 endpoints fully documented)
- **[Getting Started](GETTING_STARTED.md)** - Quick start guide and troubleshooting
- **[API Quick Reference](API_QUICK_REFERENCE.md)** - Quick endpoint reference table
- **[API Examples](API_EXAMPLES.md)** - Detailed usage examples with curl commands
- **[Architecture](ARCHITECTURE.md)** - System architecture and data flow diagrams
- **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - Technical implementation details
- **[Interactive API Docs](http://localhost:3000/api-docs)** - Swagger UI (when server is running)

## 📋 Description

Easy Kitchen Backend provides a comprehensive API for managing recipes, ingredients, users, and food categories. The application supports user authentication, recipe management with image uploads, comments, and various filtering options.

## 🚀 Features

- **User Management**: User registration, authentication, and profile management
- **Recipe Management**: Create, read, update, and delete recipes
- **Ingredient Tracking**: Manage ingredients and their associations with recipes
- **Categories & Areas**: Organize recipes by categories and geographical areas
- **Food Database**: Comprehensive food item management
- **Comments System**: Users can comment on recipes
- **Image Upload**: Support for recipe and user avatar images
- **Google OAuth**: Integration with Google authentication
- **Email Notifications**: Using Nodemailer for email services
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Health Check**: Monitoring endpoints for service status

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT, Passport.js, Google OAuth 2.0
- **File Upload**: Multer
- **Security**: bcryptjs for password hashing
- **CORS**: Enabled for cross-origin requests
- **Documentation**: Swagger/OpenAPI 3.0 with swagger-jsdoc and swagger-ui-express

## 🚦 Quick Start

1. Install dependencies: `npm install`
2. Set up your `.env` file with required environment variables
3. Ensure MongoDB is running
4. Start the server: `npm run dev`
5. Visit `http://localhost:3000` for health check
6. Visit `http://localhost:3000/api-docs` for API documentation

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Easy-Kitchen-Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL=mongodb://localhost:27017/easy-kitchen
PORT=3000
JWT_SECRET=your_jwt_secret_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

**Environment Variables Explained:**
- `DATABASE_URL`: MongoDB connection string (required)
- `PORT`: Server port (default: 3000)
- `JWT_SECRET`: Secret key for JWT token generation (required)
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `EMAIL_USER`: Email address for sending notifications
- `EMAIL_PASS`: Email app password for nodemailer

4. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on port 3000 by default.

## 📚 API Endpoints

### Health Check
- `GET /` - API health check (returns status, uptime, and database connection status)
- `GET /health` - Alternative health check endpoint

### API Documentation
- `GET /api-docs` - Interactive Swagger UI documentation

All API endpoints are documented with Swagger/OpenAPI. Visit `/api-docs` when the server is running to explore the interactive documentation.

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/forgot` - Request password reset code
- `POST /api/verify` - Verify password reset code
- `POST /api/reset` - Reset password with verified code
- `POST /api/auth/google` - Login with Google OAuth

### Users
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user information
- `PUT /api/users/:id` - Change user password
- `DELETE /api/users/:id` - Delete user
- `PUT /api/users/upload/:userId` - Upload user avatar image
- `GET /api/users/image/:userId/:imageName` - Get user avatar image

### Recipes
- `GET /api/recettes` - Get all recipes
- `GET /api/recettes/bio` - Get bio/organic recipes
- `GET /api/recettes/:id` - Get recipe by ID
- `POST /api/recettes` - Create new recipe
- `PUT /api/recettes/:id` - Update recipe
- `DELETE /api/recettes/:id` - Delete recipe
- `PUT /api/recettes/upload/:recetteId` - Upload recipe image
- `GET /api/recettes/image/:recetteId/:imageName` - Get recipe image
- `GET /api/recettes/:id/comments` - Get recipe comments

### Ingredients
- `GET /api/ingredients` - Get all ingredients
- `GET /api/ingredients/:id` - Get ingredient by ID
- `POST /api/ingredients` - Create ingredient
- `PUT /api/ingredients/:id` - Update ingredient
- `DELETE /api/ingredients/:id` - Delete ingredient

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Food Items
- `GET /api/food` - Get all food items
- `GET /api/food/:id` - Get food item by ID
- `POST /api/food` - Create food item
- `PUT /api/food/:id` - Update food item
- `DELETE /api/food/:id` - Delete food item

### Comments
- `GET /api/comments` - Get all comments
- `GET /api/comments/:id` - Get comment by ID
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Areas
- `GET /api/areas` - Get all geographical areas
- `GET /api/areas/:id` - Get area by ID
- `POST /api/areas` - Create area
- `PUT /api/areas/:id` - Update area
- `DELETE /api/areas/:id` - Delete area

### File Upload
- `POST /api/uploadfile` - Upload single file

## 📁 Project Structure

```
Easy-Kitchen-Backend/
├── controllers/       # Business logic controllers
├── middleware/        # Custom middleware (error handling, multer config)
├── models/           # Mongoose schemas and models
├── routes/           # API route definitions
├── services/         # Business services
├── uploads/          # Uploaded files storage
├── server.js         # Application entry point
├── swagger.js        # Swagger/OpenAPI configuration
├── package.json      # Dependencies and scripts
├── Dockerfile        # Docker configuration
├── README.md         # Main documentation
├── API_QUICK_REFERENCE.md  # Quick endpoint reference
├── API_EXAMPLES.md   # Usage examples
└── IMPLEMENTATION_SUMMARY.md  # Technical details
```

## 🐳 Docker Support

The project includes a Dockerfile for containerization. Build and run with:

```bash
docker build -t easy-kitchen-backend .
docker run -p 3000:3000 easy-kitchen-backend
```

## 👤 Author

**Karam Yassine**

## 📄 License

ISC

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 Notes

- Ensure MongoDB is running before starting the application
- The API requires `DATABASE_URL` environment variable to be set
- Image uploads are stored in the `uploads/` directory
- The API uses JWT tokens for authentication (Bearer token in Authorization header)
- CORS is enabled for all origins (configure appropriately for production)
- Visit `/api-docs` for interactive API documentation and testing
- Health check endpoints (`/` and `/health`) can be used for monitoring and load balancer checks
- For email functionality, you need to configure `EMAIL_USER` and `EMAIL_PASS` in your environment variables

## 🔒 Authentication

Most endpoints require authentication using JWT tokens. After logging in or registering, include the token in your requests:

```
Authorization: Bearer <your_jwt_token>
```

## 🧪 Testing the API

You can test the API using:
1. **Swagger UI**: Visit `http://localhost:3000/api-docs` for interactive testing
2. **Postman**: Import the endpoints from the Swagger documentation
3. **cURL**: Command-line testing
4. **Health Check**: `curl http://localhost:3000/health`

