const connectDB = require("../db/connection")
const { ObjectId } = require("mongodb")

// GET reviews by recipe
const getReviewsByRecipe = async (req, res) => {
  try {
    const db = await connectDB()

    const reviews = await db.collection("reviews")
      .find({ recipeId: req.params.recipeId })
      .toArray()

    res.status(200).json(reviews)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// CREATE review (🔐 protected)
const createReview = async (req, res) => {
  try {
    const db = await connectDB()

    const review = {
      recipeId: req.body.recipeId,
      user: req.user.username, // 👈 from GitHub OAuth
      rating: req.body.rating,
      comment: req.body.comment,
      createdAt: new Date()
    }

    const result = await db.collection("reviews").insertOne(review)

    res.status(201).json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// UPDATE review (🔐 protected)
const updateReview = async (req, res) => {
  try {
    const db = await connectDB()

    const result = await db.collection("reviews").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    )

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Review not found" })
    }

    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// DELETE review (🔐 protected)
const deleteReview = async (req, res) => {
  try {
    const db = await connectDB()

    const result = await db.collection("reviews").deleteOne({
      _id: new ObjectId(req.params.id)
    })

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Review not found" })
    }

    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  getReviewsByRecipe,
  createReview,
  updateReview,
  deleteReview
}
