const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Healthy Meals API',
    description: 'It helps busy families to get healthy meals in a budget',
  },

  host: 'localhost:3000', 
  schemes: ['http'],
};

const outputFile = './swagger.json'; 

const routes = ['./server.js']; 

swaggerAutogen(outputFile, routes, doc);