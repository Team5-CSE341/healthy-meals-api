const express = require('express');
const router = express.Router();

const {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
} = require('../controllers/recipesController');
const validationRecipes= require('../middleware/recipesValidator');

router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);
router.post('/', validationRecipes.validationRecipe, validationRecipes.validate, createRecipe);
router.put('/:id', validationRecipes.validationRecipe, validationRecipes.validate, updateRecipe);
router.delete('/:id', validationRecipes.validateDeleteRecipe, validationRecipes.validate, deleteRecipe);

module.exports = router;