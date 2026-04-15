const { getDb } = require("../db/connection");
const { ObjectId } = require("mongodb");

// GET reviews by recipe
const getReviewsByRecipe = async (req, res) => {
  try {
    const db = getDb();

    const reviews = await db.collection("reviews")
      .find({ recipeId: req.params.recipeId })
      .toArray();

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE review 
const createReview = async (req, res) => {
  try {
    const db = getDb();

    const review = {
      recipeId: req.body.recipeId,
      user: req.user.username, // from GitHub OAuth
      rating: req.body.rating,
      comment: req.body.comment,
      createdAt: new Date()
    };

    const result = await db.collection("reviews").insertOne(review);

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE review 
const updateReview = async (req, res) => {
  try {
    // Validate ObjectId format before querying to prevent crashes
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Review ID format" });
    }

    const db = getDb();

    const result = await db.collection("reviews").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE review
const deleteReview = async (req, res) => {
  try {
    // Validate ObjectId format before querying
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Review ID format" });
    }

    const db = getDb();

    const result = await db.collection("reviews").deleteOne({
      _id: new ObjectId(req.params.id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getReviewsByRecipe,
  createReview,
  updateReview,
  deleteReview
};