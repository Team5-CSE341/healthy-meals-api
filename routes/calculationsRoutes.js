const express = require('express');
const router = express.Router();
const { 
  getUserCalories, 
  calculateRecipeDetails, 
  getRecommendedRecipes 
} = require('../controllers/calculationsController');

router.get('/users/:id/calories', getUserCalories);
router.get('/recipes/:id/calculate', calculateRecipeDetails);
router.get('/recipes/recommended/:userId', getRecommendedRecipes);

module.exports = router;