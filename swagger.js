const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "healthy-meals-api.onrender.com",
    description: "Api for managing healthy meals"
  },
  host: "localhost:3000",
  schemes: ["http"]
};

const outputFile = "./swagger.json";
const endpointsFiles = ["server.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);