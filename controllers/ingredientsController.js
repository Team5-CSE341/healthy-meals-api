const { getDb } = require('../db/connection');
const { ObjectId } = require('mongodb');

// GET all ingredients
const getAllIngredients = async (req, res) => {
  //#swagger.tags=["Ingredients"]
  try {
    const db = getDb();
    const ingredients = await db.collection('ingredients').find().toArray();
    res.status(200).json(ingredients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single ingredient
const getIngredientById = async (req, res) => {
  //#swagger.tags=["Ingredients"]
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ingredient id' });
    }

    const db = getDb();
    const ingredient = await db.collection('ingredients').findOne({
      _id: new ObjectId(id)
    });

    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }

    res.status(200).json(ingredient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create ingredient
const createIngredient = async (req, res) => {
  //#swagger.tags=["Ingredients"]
  try {
    const ingredient = req.body;

    if (!ingredient.name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const db = getDb();
    const result = await db.collection('ingredients').insertOne(ingredient);

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update ingredient
const updateIngredient = async (req, res) => {
  //#swagger.tags=["Ingredients"]
  try {
    const id = req.params.id;
    const ingredient = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ingredient id' });
    }

    if (!ingredient.name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const db = getDb();
    const result = await db.collection('ingredients').replaceOne(
      { _id: new ObjectId(id) },
      ingredient
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE ingredient
const deleteIngredient = async (req, res) => {
  //#swagger.tags=["Ingredients"]
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ingredient id' });
    }

    const db = getDb();
    const result = await db.collection('ingredients').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient
};