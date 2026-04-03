const router = require("express").Router()
const auth = require("../middleware/auth")
const { createReview, getReviewsByMeal } = require("../models/reviewModel")

// Get reviews for a meal
router.get("/:mealId", async (req, res) => {
  const reviews = await getReviewsByMeal(req.params.mealId)
  res.json(reviews)
})

// Add review (PROTECTED)
router.post("/", auth, async (req, res) => {
  const review = {
    mealId: req.body.mealId,
    user: req.user.username,
    rating: req.body.rating,
    comment: req.body.comment
  }

  const result = await createReview(review)
  res.status(201).json(result)
})

module.exports = router
