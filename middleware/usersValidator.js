const { param,body, validationResult } = require('express-validator')


const validationUser = [

  // First name
  body('first_name')
  .trim()
    .notEmpty().withMessage('First name is required')
    .bail()
    .isString().withMessage('First name must be a string')
    .bail()
    .isLength({ min: 2 }).withMessage('First name must be at least 2 characters long'),
// Last name
  body('last_name')
    .trim() 
    .notEmpty().withMessage('Last name is required')
    .bail()
    .isString().withMessage('Last name must be a string')
    .bail()
    .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters long'),

  // sex
  body('sex')
    .trim()
    .notEmpty().withMessage('Sex is required')
    .bail()
    .isIn(['man', 'woman'])
    .withMessage('Sex must be one of: man, woman'),

  // age
  body('age')
    .notEmpty().withMessage('Age is required')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Age must be a positive integer'),

  // email
  body('email')
    .trim() 
    .notEmpty().withMessage('Email is required')
    .bail()
    .isEmail().withMessage('Invalid email format'),

  // weight
  body('weight')
    .notEmpty().withMessage('Weight is required')
    .bail()
    .isFloat({ min: 0 })
    .withMessage('Weight must be a valid number'),
    // height
  body('height')
    .notEmpty().withMessage('Height is required')
    .bail()
    .isFloat({ min: 0 })
    .withMessage('Height must be a valid number'),

  // activity level
  body('activity_level')
    .trim()
    .notEmpty().withMessage('Activity level is required')
    .bail()
    .isString()
    .isIn(["sedentary", "lightly active", "moderately active", "very active", "extra active"])
    .withMessage('Invalid activity level, must be one of: sedentary, lightly active, moderately active, very active, extra active'),

    // goal
    body('goal')
    .trim() 
    .notEmpty().withMessage('Goal is required')
    .bail()
    .isString()
    .isIn(["lose fat", "maintain weight", "gain muscle"])
    .withMessage('Invalid goal, must be one of: lose fat, maintain weight, gain muscle'),
];


const validateDeleteUser = [
  param("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID format"),
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
validationUser,
validateDeleteUser,
    validate,
}