# API Examples and Testing Guide

## Health Check Endpoints

### Basic Health Check
```bash
curl http://localhost:3000/
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2026-01-27T10:30:45.123Z",
  "uptime": 123.456,
  "database": "connected"
}
```

### Alternative Health Check
```bash
curl http://localhost:3000/health
```

Both endpoints return the same health status information and can be used for:
- Monitoring service availability
- Load balancer health checks
- Uptime monitoring services
- CI/CD pipeline validation

## Swagger API Documentation

Visit `http://localhost:3000/api-docs` in your browser to access the interactive Swagger UI documentation.

### Features:
- **Interactive API Testing**: Test endpoints directly from the browser
- **Request/Response Examples**: See sample requests and responses
- **Authentication Testing**: Add your JWT token to test protected endpoints
- **Schema Validation**: View request/response schemas

### How to Use Swagger UI:

1. **Open Swagger UI**: Navigate to `http://localhost:3000/api-docs`

2. **Authenticate** (for protected endpoints):
   - Click the "Authorize" button at the top right
   - Enter your JWT token in the format: `Bearer <your_token>`
   - Click "Authorize" and then "Close"

3. **Test an Endpoint**:
   - Click on any endpoint to expand it
   - Click "Try it out"
   - Fill in the required parameters
   - Click "Execute"
   - View the response below

## Authentication Examples

### Register a New User
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePassword123!",
    "phone": "+1234567890"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Forgot Password
```bash
curl -X POST http://localhost:3000/api/forgot \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

### Verify Reset Code
```bash
curl -X POST http://localhost:3000/api/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "code": "123456"
  }'
```

### Reset Password
```bash
curl -X POST http://localhost:3000/api/reset \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "code": "123456",
    "newPassword": "NewSecurePassword123!"
  }'
```

## Protected Endpoints

For endpoints that require authentication, include the JWT token in the Authorization header:

```bash
curl -X GET http://localhost:3000/api/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## File Upload Examples

### Upload User Avatar
```bash
curl -X PUT http://localhost:3000/api/users/upload/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your_token>" \
  -F "file=@/path/to/image.jpg"
```

### Upload Recipe Image
```bash
curl -X PUT http://localhost:3000/api/recettes/upload/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your_token>" \
  -F "file=@/path/to/recipe.jpg"
```

## Error Responses

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

Common HTTP status codes:
- `200 OK`: Success
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `500 Internal Server Error`: Server error

## Production Deployment

When deploying to production:

1. Update the Swagger server URL in `swagger.js`:
```javascript
servers: [
  {
    url: 'https://your-production-url.com',
    description: 'Production server',
  },
]
```

2. Set appropriate CORS settings in `server.js`
3. Use environment variables for all sensitive data
4. Enable HTTPS
5. Set up monitoring using the health check endpoints
