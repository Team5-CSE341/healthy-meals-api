const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

// ✅ Initialize DB
const { initDb } = require('./db/connection');

// ✅ Initialize Passport config
require('./config/passport');

const app = express();
const port = process.env.PORT || 3000;

// =======================
// 🔹 MIDDLEWARE
// =======================

app.use(express.json());

// ✅ CORS (allow credentials for sessions)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Z-Key"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// ✅ SESSION (REQUIRED FOR PASSPORT)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// ✅ PASSPORT (VERY IMPORTANT)
app.use(passport.initialize());
app.use(passport.session());

// =======================
// 🔹 ROUTES
// =======================

// Swagger
const swaggerRoutes = require('./routes/swagger');
app.use("/", swaggerRoutes);

// ✅ AUTH ROUTES (GitHub)
const authRoutes = require('./routes/index'); // your login/logout routes
app.use("/", authRoutes);

// API routes
const recipeRoutes = require('./routes/recipesRoutes');
const ingredientRoutes = require('./routes/ingredientsRoutes');
const userRoutes = require('./routes/usersRoutes');
const calculationRoutes = require('./routes/calculationsRoutes');
const reviewsRoutes = require('./routes/reviewsRoutes')
/* const reviewRoutes = require('./routes/reviewsRoutes'); */


app.use('/recipes', recipeRoutes);
app.use('/ingredients', ingredientRoutes);
app.use('/users', userRoutes);
app.use('/calculations', calculationRoutes);
app.use('/reviews', reviewsRoutes);
/* app.use('/reviews', reviewRoutes); */

// Root
app.get('/', (req, res) => {
  res.send('Healthy Meals API is running');
});

// =======================
// 🔹 START SERVER
// =======================

initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error initializing database:', err);
    process.exit(1);
  });

// ✅ EXPORT FOR TESTING
module.exports = app;
