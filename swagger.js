const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "'Wave post' API",
        version: "0.1.0",
        description:
          "The server part for Wave Post. Wave Post is a system designed to distribute responsibilities among employees of Lviv post offices. Express.js was used to perform basic CRUD operations and MongoDB to store user data. The project also uses encrypt.js to encrypt passwords, which ensures the security of personal information.",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "Anastasiia Puhinets",
          url: "https://www.linkedin.com/in/anastasia-puhinets-b278b8274",
          email: "anastasiiapuhinets@gmail.com",
        },
      },
      servers: [
        {
          url: "http://localhost:3000/api",
        },
      ],
    },
    apis: ["./routes/*.js"],
  };
  
const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
};