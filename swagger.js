const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Easy Kitchen API',
      version: '1.0.0',
      description: 'API documentation for Easy Kitchen - A recipe management system',
      contact: {
        name: 'Karam Yassine',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://easykitchenbackend.onrender.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
            },
            error: {
              type: 'string',
            },
          },
        },
        HealthCheck: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'OK',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            uptime: {
              type: 'number',
              description: 'Server uptime in seconds',
            },
            database: {
              type: 'string',
              enum: ['connected', 'disconnected'],
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            username: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            phone: {
              type: 'string',
            },
            password: {
              type: 'string',
              format: 'password',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Recipe: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            ingredients: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            category: {
              type: 'string',
            },
            area: {
              type: 'string',
            },
            image: {
              type: 'string',
            },
            bio: {
              type: 'boolean',
              description: 'Whether the recipe is organic/bio',
            },
            userId: {
              type: 'string',
              description: 'ID of the user who created the recipe',
            },
            likes: {
              type: 'number',
              description: 'Number of likes',
            },
            dislikes: {
              type: 'number',
              description: 'Number of dislikes',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Ingredient: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
          },
        },
        Category: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
          },
        },
        Food: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            vegan: {
              type: 'boolean',
            },
            vegetarian: {
              type: 'boolean',
            },
            description: {
              type: 'string',
            },
          },
        },
        Comment: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            text: {
              type: 'string',
            },
            userId: {
              type: 'string',
              description: 'ID of the user who posted the comment',
            },
            recetteId: {
              type: 'string',
              description: 'ID of the recipe being commented on',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Area: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js', './server.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
