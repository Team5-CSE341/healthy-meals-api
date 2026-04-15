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

// ✅ CORS
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
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false
}));

// ✅ PASSPORT
app.use(passport.initialize());
app.use(passport.session());

// =======================
// 🔹 ROUTES
// =======================

// Swagger
const swaggerRoutes = require('./routes/swagger');
app.use("/", swaggerRoutes);

// Auth routes
const authRoutes = require('./routes/index');
app.use("/", authRoutes);

// API routes
const recipeRoutes = require('./routes/recipesRoutes');
const ingredientRoutes = require('./routes/ingredientsRoutes');
const userRoutes = require('./routes/usersRoutes');
const calculationRoutes = require('./routes/calculationsRoutes');
const reviewsRoutes = require('./routes/reviewsRoutes');

app.use('/recipes', recipeRoutes);
app.use('/ingredients', ingredientRoutes);
app.use('/users', userRoutes);
app.use('/calculations', calculationRoutes);
app.use('/reviews', reviewsRoutes);

// Root
app.get('/', (req, res) => {
  res.send('Healthy Meals API is running');
});

// =======================
// 🔹 START SERVER (IMPORTANT FIX)
// =======================

if (process.env.NODE_ENV !== "test") {
  initDb()
    .then(() => {
      app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
      });
    })
    .catch((err) => {
      console.error('Error initializing database:', err);
      // ❌ DO NOT use process.exit() (breaks Jest)
    });
}

// ✅ EXPORT FOR TESTING
module.exports = app;
