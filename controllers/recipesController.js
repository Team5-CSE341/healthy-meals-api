const { getDb } = require('../db/connection');
const { ObjectId } = require('mongodb');

// GET all recipes
const getAllRecipes = async (req, res) => {
  //#swagger.tags = ['Recipes']
  //#swagger.summary = 'Get all recipes'
  /* #swagger.responses[200] = {
      description: 'List of recipes',
      schema: [{
        _id: 'any',
        title: 'any',
        type: 'any',
        portions: 0,
        instructions: 'any',
        ingredients: [
          {
            ingredient_id: 'any',
            name: 'any',
            quantity: 0,
            unit: 'any'
          }
        ]
      }]
  } */

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
  //#swagger.tags = ['Recipes']
  //#swagger.summary = 'Get recipe by ID'
  //#swagger.parameters['id'] = { in: 'path', description: 'Recipe ID', required: true, type: 'string' }
  /* #swagger.responses[200] = {
      description: 'Recipe found',
      schema: {
        _id: 'any',
        title: 'any',
        type: 'any',
        portions: 0,
        instructions: 'any',
        ingredients: [
          {
            ingredient_id: 'any',
            name: 'any',
            quantity: 0,
            unit: 'any'
          }
        ]
      }
  } */

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
  //#swagger.tags = ['Recipes']
  //#swagger.summary = 'Create recipe'
  /* #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        title: 'any',
        type: 'any',
        portions: 0,
        instructions: 'any',
        ingredients: [
          {
            ingredient_id: 'any',
            name: 'any',
            quantity: 0,
            unit: 'any'
          }
        ]
      }
  } */
  //#swagger.responses[201] = { description: 'Recipe created' }

  try {
    const recipe = {
      title: req.body.title,
      type: req.body.type,
      portions: Number(req.body.portions),
      instructions: req.body.instructions,

      ingredients: Array.isArray(req.body.ingredients)
        ? req.body.ingredients.map(item => ({
            ingredient_id: item.ingredient_id,
            name: item.name,
            quantity: Number(item.quantity),
            unit: item.unit
          }))
        : []
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
  //#swagger.tags = ['Recipes']
  //#swagger.summary = 'Update recipe'
  //#swagger.parameters['id'] = { in: 'path', required: true, type: 'string' }
  /* #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        title: 'any',
        type: 'any',
        portions: 0,
        instructions: 'any',
        ingredients: [
          {
            ingredient_id: 'any',
            name: 'any',
            quantity: 0,
            unit: 'any'
          }
        ]
      }
  } */
  //#swagger.responses[200] = { description: 'Recipe updated' }

  try {
    const id = req.params.id;

    const recipe = {
      title: req.body.title,
      type: req.body.type,
      portions: Number(req.body.portions),
      instructions: req.body.instructions,

      ingredients: Array.isArray(req.body.ingredients)
        ? req.body.ingredients.map(item => ({
            ingredient_id: item.ingredient_id,
            name: item.name,
            quantity: Number(item.quantity),
            unit: item.unit
          }))
        : []
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
  //#swagger.tags = ['Recipes']
  //#swagger.summary = 'Delete recipe'
  //#swagger.parameters['id'] = { in: 'path', required: true, type: 'string' }
  //#swagger.responses[204] = { description: 'Recipe deleted' }

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