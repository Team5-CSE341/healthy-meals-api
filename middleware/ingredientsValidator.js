const { param,body, validationResult } = require('express-validator')

const validateIngredients = [
  body("name").notEmpty().withMessage("Name is required"),
  body("base_unit").notEmpty().withMessage("Base unit is required"),
  body("calories_per_unit").trim().notEmpty().withMessage("Calories per unit is required").bail().isFloat().withMessage("Calories per unit must be a number"),
  body("cost_per_unit").trim().notEmpty().withMessage("Cost per unit is required").bail().isFloat().withMessage("Cost per unit must be a number"),
];



const validateDeleteIngredient = [
  param("id")
    .notEmpty()
    .withMessage("Ingredient ID is required")
    .isMongoId()
    .withMessage("Invalid Ingredient ID format"),
];



const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map(err => ({
    [err.path]: err.msg
  }));

  return res.status(400).json({
    errors: extractedErrors,
  });
};

module.exports = {
    validateIngredients,
    validateDeleteIngredient,
  validate,
}