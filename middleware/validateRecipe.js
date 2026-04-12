const { body, validationResult } = require("express-validator")

const validateRecipe = [
  body("name").notEmpty().withMessage("Name is required"),
  body("calories").isNumeric().withMessage("Calories must be a number"),

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]

module.exports = validateRecipe
