// module imports
import swaggerJsdoc from "swagger-jsdoc";

// destructuring assignments
const { BASE_URL } = process.env;

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NodeTS Backend API",
      version: "1.0.0",
      description: "API documentation for NodeTS Backend",
    },
    servers: [
      {
        url: BASE_URL || "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/**/**/*.ts", "./dist/**/**/*.js"], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
