const connectDB = require("../db/connection")

async function createReview(review) {
  const db = await connectDB()
  return db.collection("reviews").insertOne(review)
}

async function getReviewsByMeal(mealId) {
  const db = await connectDB()
  return db.collection("reviews").find({ mealId }).toArray()
}

module.exports = { createReview, getReviewsByMeal }
