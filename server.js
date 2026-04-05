const express = require('express');
const { initDb } = require('./db/connection');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader(
        "Acccess-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Z-Key" 
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});
// Swagger documentation
const swaggerRoutes = require('./routes/swagger');
app.use("/", swaggerRoutes);

// Routes
const recipeRoutes = require('./routes/recipes');
const ingredientRoutes = require('./routes/ingredients');

app.use('/recipes', recipeRoutes);
app.use('/ingredients', ingredientRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Healthy Meals API is running');
});

initDb()
  .then(() => {
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error initializing database:', err);
    process.exit(1);
  });