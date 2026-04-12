const router = require("express").Router()
const controller = require("../controllers/reviewsController")
const auth = require("../middleware/auth")
const validateReview = require("../middleware/validateReview")

// GET reviews by recipe
router.get("/:recipeId", controller.getReviewsByRecipe)

// CREATE review
router.post("/", auth, validateReview, controller.createReview)

// UPDATE review
router.put("/:id", auth, validateReview, controller.updateReview)

// DELETE review
router.delete("/:id", auth, controller.deleteReview)

module.exports = router
