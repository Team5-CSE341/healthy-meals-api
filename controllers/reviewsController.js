const connectDB = require("../db/connection")

// GET reviews by meal
const getReviewsByMeal = async (req, res) => {
  try {
    const db = await connectDB()

    const reviews = await db.collection("reviews")
      .find({ mealId: req.params.mealId })
      .toArray()

    res.status(200).json(reviews)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// CREATE review (protected)
const createReview = async (req, res) => {
  try {
    const db = await connectDB()

    const review = {
      mealId: req.body.mealId,
      user: req.user.username, // 🔐 from OAuth
      rating: req.body.rating,
      comment: req.body.comment
    }

    const result = await db.collection("reviews").insertOne(review)

    res.status(201).json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  getReviewsByMeal,
  createReview
}
