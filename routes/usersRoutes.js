const router = require("express").Router()
const connectDB = require("../db/connection")

// Get all users
router.get("/", async (req, res) => {
  const db = await connectDB()
  const users = await db.collection("users").find().toArray()
  res.json(users)
})

// Get one user
router.get("/:id", async (req, res) => {
  const db = await connectDB()
  const user = await db.collection("users").findOne({
    _id: new require("mongodb").ObjectId(req.params.id)
  })
  res.json(user)
})

module.exports = router
