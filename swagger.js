const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        title: "Healthy Meals Api",
        description: "Api for managing healthy meals"
    },
    // host: "localhost:3000",    
    // schemes: ["http"],

    host: "healthy-meals-api.onrender.com",    
    schemes: ["https"],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["server.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);