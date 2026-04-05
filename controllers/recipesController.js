const { getDb } = require('../db/connection');
const { ObjectId } = require('mongodb');

// GET all recipes
const getAllRecipes = async (req, res) => {
  //#swagger.tags=["Recipes"]
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
  //#swagger.tags=["Recipes"]
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
  //#swagger.tags=["Recipes"]
  try {
    const recipe = {
      title: req.body.title,
      description: req.body.description,
      ingredients: Array.isArray(req.body.ingredients)
        ? req.body.ingredients.map(item => ({
            ingredientId: item.ingredientId,
            quantity: item.quantity,
            unit: item.unit
          }))
        : [],
      instructions: req.body.instructions,
      prepTime: req.body.prepTime,
      cookTime: req.body.cookTime,
      calories: req.body.calories,
      protein: req.body.protein,
      carbs: req.body.carbs,
      fat: req.body.fat,
      dietTags: req.body.dietTags
    };

    if (!recipe.title) {
      return res.status(400).json({ message: 'Title is required' });
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
  //#swagger.tags=["Recipes"]
  try {
    const id = req.params.id;
    const recipe = {
      title: req.body.title,
      description: req.body.description,
      ingredients: Array.isArray(req.body.ingredients)
        ? req.body.ingredients.map(item => ({
            ingredientId: item.ingredientId,
            quantity: item.quantity,
            unit: item.unit
          }))
        : [],
      instructions: req.body.instructions,
      prepTime: req.body.prepTime,
      cookTime: req.body.cookTime,
      calories: req.body.calories,
      protein: req.body.protein,
      carbs: req.body.carbs,
      fat: req.body.fat,
      dietTags: req.body.dietTags
    };

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid recipe id' });
    }

    if (!recipe.title) {
      return res.status(400).json({ message: 'Title is required' });
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
  //#swagger.tags=["Recipes"]
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