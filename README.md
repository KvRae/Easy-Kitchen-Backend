# Easy Kitchen Backend API

A RESTful API backend for the Easy Kitchen application, built with Node.js, Express, and MongoDB (MEAN stack).

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

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT, Passport.js, Google OAuth 2.0
- **File Upload**: Multer
- **Security**: bcryptjs for password hashing
- **CORS**: Enabled for cross-origin requests

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
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
# Add other environment variables as needed
```

4. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on port 3000 by default.

## 📚 API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration
- OAuth routes for Google authentication

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

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
├── package.json      # Dependencies and scripts
└── Dockerfile        # Docker configuration
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
- Image uploads are stored in the `uploads/` directory
- The API uses JWT tokens for authentication
- CORS is enabled for all origins (configure appropriately for production)
