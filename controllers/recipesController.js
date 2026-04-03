const { getDb } = require('../db/connection');
const { ObjectId } = require('mongodb');

// GET all recipes
const getAllRecipes = async (req, res) => {
  try {
    const db = getDb();
    const recipes = await db.collection('recipes').find().toArray();
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single recipe
const getRecipeById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid recipe id' });
    }

    const db = getDb();
    const recipe = await db.collection('recipes').findOne({
      _id: new ObjectId(id)
    });

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create recipe
const createRecipe = async (req, res) => {
  try {
    const recipe = req.body;

    if (!recipe.name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const db = getDb();
    const result = await db.collection('recipes').insertOne(recipe);

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update recipe
const updateRecipe = async (req, res) => {
  try {
    const id = req.params.id;
    const recipe = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid recipe id' });
    }

    if (!recipe.name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const db = getDb();
    const result = await db.collection('recipes').replaceOne(
      { _id: new ObjectId(id) },
      recipe
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE recipe
const deleteRecipe = async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid recipe id' });
    }

    const db = getDb();
    const result = await db.collection('recipes').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
};