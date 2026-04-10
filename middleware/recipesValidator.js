const { param,body, validationResult } = require('express-validator')


const validationRecipe = [

  // title
  body('title')
    .notEmpty().withMessage('Title is required')
    .bail()
    .isString().withMessage('Title must be a string')
    .bail()
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),

  // type
  body('type')
    .trim()
    .notEmpty().withMessage('Type is required')
    .bail()
    .isIn(['breakfast', 'lunch', 'dinner', 'snack'])
    .withMessage('Type must be one of: breakfast, lunch, dinner, snack'),

  // portions
  body('portions')
    .notEmpty().withMessage('Portions are required')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Portions must be a positive integer'),

  // instructions
  body('instructions')
    .notEmpty().withMessage('Instructions are required')
    .isString(),

  // ingredients array
  body('ingredients')
    .isArray({ min: 1 })
    .withMessage('At least one ingredient is required')
    .bail(),
  // ingredient_id
  body('ingredients.*.ingredient_id')
    .notEmpty().withMessage('ID is required')
    .isMongoId().withMessage('ID must be a valid MongoDB ObjectId'),
  // name
  body('ingredients.*.name')
    .notEmpty().withMessage('Name is required')
    .isString(),

  // quantity
  body('ingredients.*.quantity')
    .notEmpty().withMessage('Quantity is required')
    .bail()
    .isFloat({ min: 0 })
    .withMessage('Quantity must be a valid number (integer or decimal)'),

  // unit
  body('ingredients.*.unit')
    .trim() 
    .notEmpty().withMessage('Unit is required')
    .bail()
    .isString()
    .isIn(['g', 'kg', 'ml', 'l', 'unit'])
    .withMessage('Invalid unit, must be one of: g, kg, ml, l, unit'),
];


const validateDeleteRecipe = [
  param("id")
    .notEmpty()
    .withMessage("Recipe ID is required")
    .isMongoId()
    .withMessage("Invalid Recipe ID format"),
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
    validationRecipe,
    validateDeleteRecipe,
    validate,
}