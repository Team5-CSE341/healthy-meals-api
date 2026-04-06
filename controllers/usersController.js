const connectDB = require("../db/connection")
const { ObjectId } = require("mongodb")

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const db = await connectDB()
    const users = await db.collection("users").find().toArray()
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET single user
const getUserById = async (req, res) => {
  try {
    const db = await connectDB()
    const user = await db.collection("users").findOne({
      _id: new ObjectId(req.params.id)
    })
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  getAllUsers,
  getUserById
}
