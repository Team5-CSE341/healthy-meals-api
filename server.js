const express = require('express');
const { initDb } = require('./db/connection');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

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