# Easy Kitchen API - Quick Reference

## 🏥 Health & Documentation

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Health check | No |
| GET | `/health` | Alternative health check | No |
| GET | `/api-docs` | Swagger UI Documentation | No |

## 🔐 Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/register` | Register new user | No |
| POST | `/api/login` | User login | No |
| POST | `/api/forgot` | Request password reset | No |
| POST | `/api/verify` | Verify reset code | No |
| POST | `/api/reset` | Reset password | No |
| POST | `/api/auth/google` | Google OAuth login | No |

## 👤 Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/:id` | Get user by ID | Yes |
| PATCH | `/api/users/:id` | Update user | Yes |
| PUT | `/api/users/:id` | Change password | Yes |
| DELETE | `/api/users/:id` | Delete user | Yes |
| PUT | `/api/users/upload/:userId` | Upload avatar | Yes |
| GET | `/api/users/image/:userId/:imageName` | Get avatar | No |

## 🍳 Recipes (Recettes)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/recettes` | Get all recipes | No |
| GET | `/api/recettes/bio` | Get bio recipes | No |
| GET | `/api/recettes/:id` | Get recipe by ID | No |
| GET | `/api/recettes/:id/comments` | Get recipe comments | No |
| GET | `/api/recettes/:id/recettes` | Get recipes by user | No |
| POST | `/api/recettes` | Create recipe | Yes |
| POST | `/api/recettes/:id/like` | Like a recipe | Yes |
| POST | `/api/recettes/:id/dislike` | Dislike a recipe | Yes |
| PATCH | `/api/recettes/:id` | Update recipe | Yes |
| DELETE | `/api/recettes/:id` | Delete recipe | Yes |
| PUT | `/api/recettes/upload/:recetteId` | Upload recipe image | Yes |
| GET | `/api/recettes/image/:recetteId/:imageName` | Get recipe image | No |

## 🥕 Ingredients

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/ingredients` | Get all ingredients | No |
| POST | `/api/ingredients` | Create ingredient | Yes |
| PATCH | `/api/ingredients/:id` | Update ingredient | Yes |
| DELETE | `/api/ingredients/:id` | Delete ingredient | Yes |

## 📁 Categories

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/categories` | Get all categories | No |

## 🍕 Food Items

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/food` | Get all food items | No |
| GET | `/api/food/vegan` | Get all vegan foods | No |
| GET | `/api/food/Vegetarian` | Get all vegetarian foods | No |
| GET | `/api/food/:id` | Get food by ID | No |

## 💬 Comments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/comments` | Get all comments | No |
| POST | `/api/comments` | Create comment | Yes |
| PATCH | `/api/comments/:id` | Update comment | Yes |
| DELETE | `/api/comments/:id` | Delete comment | Yes |

## 🌍 Areas

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/areas` | Get all areas | No |
| GET | `/api/areas/:id` | Get area by ID | No |

## 📤 File Upload

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/uploadfile` | Upload single file | No |

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Check health
curl http://localhost:3000/health

# View API documentation
open http://localhost:3000/api-docs
```

## 📝 Common Request Headers

```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

## 🎯 Response Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **404** - Not Found
- **409** - Conflict
- **500** - Server Error

---

For detailed examples and usage, see:
- **Interactive Testing**: http://localhost:3000/api-docs
- **API Examples**: API_EXAMPLES.md
- **Full Documentation**: README.md
