const { body, validationResult } = require("express-validator")

const validateReview = [
  body("recipeId").notEmpty().withMessage("Recipe ID is required"),
  body("rating").isNumeric().withMessage("Rating must be a number"),
  body("comment").notEmpty().withMessage("Comment is required"),

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]

module.exports = validateReview
