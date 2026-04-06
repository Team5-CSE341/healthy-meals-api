const connectDB = require("../db/connection")
const { ObjectId } = require("mongodb")

// GET all meals
const getAllMeals = async (req, res) => {
  try {
    const db = await connectDB()
    const meals = await db.collection("meals").find().toArray()
    res.status(200).json(meals)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET single meal
const getMealById = async (req, res) => {
  try {
    const db = await connectDB()
    const meal = await db.collection("meals").findOne({
      _id: new ObjectId(req.params.id)
    })
    res.status(200).json(meal)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// CREATE meal (protected)
const createMeal = async (req, res) => {
  try {
    const db = await connectDB()

    const meal = {
      name: req.body.name,
      calories: req.body.calories,
      category: req.body.category,
      ingredients: req.body.ingredients
    }

    const result = await db.collection("meals").insertOne(meal)
    res.status(201).json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// UPDATE meal
const updateMeal = async (req, res) => {
  try {
    const db = await connectDB()

    const result = await db.collection("meals").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    )

    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// DELETE meal
const deleteMeal = async (req, res) => {
  try {
    const db = await connectDB()

    const result = await db.collection("meals").deleteOne({
      _id: new ObjectId(req.params.id)
    })

    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  getAllMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal
}
