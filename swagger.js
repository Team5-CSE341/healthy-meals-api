const swaggerAutogen = require("swagger-autogen");

const doc = {
    info: {
        title: "Healthy Meals Api",
        description: "Api for managing healthy meals"
    },
    host: "healthy-meals-api.onrender.com",
    schemes: ["https","http"]
};

const outputFile = "./swagger.json";
const endpointsFiles = ["server.js"];

//This will generate swagger.json
swaggerAutogen(outputFile,endpointsFiles,doc);