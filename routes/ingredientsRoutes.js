const express = require('express');
const router = express.Router();

const {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient
} = require('../controllers/ingredientsController');
const validate =require('../middleware/ingredientsValidator');

router.get('/', getAllIngredients);
router.get('/:id', getIngredientById);
router.post('/', validate.validateIngredients,validate.validate,createIngredient);
router.put('/:id',validate.validateIngredients,validate.validate, updateIngredient);
router.delete('/:id', validate.validateDeleteIngredient,validate.validate,deleteIngredient);

module.exports = router;