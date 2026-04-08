const { getDb } = require('../db/connection');
const { ObjectId } = require('mongodb');

// GET all ingredients
const getAllIngredients = async (req, res) => {
  //#swagger.tags = ['Ingredients']
  //#swagger.summary = 'Get all ingredients'
  /* #swagger.responses[200] = {
      description: 'List of ingredients',
      schema: [{
        _id: 'any',
        name: 'any',
        base_unit: 'any',
        calories_per_unit: 0,
        cost_per_unit: 0
      }]
  } */

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
  //#swagger.tags = ['Ingredients']
  //#swagger.summary = 'Get ingredient by ID'
  //#swagger.parameters['id'] = { in: 'path', description: 'Ingredient ID', required: true, type: 'string' }
  /* #swagger.responses[200] = {
      description: 'Ingredient found',
      schema: {
        _id: 'any',
        name: 'any',
        base_unit: 'any',
        calories_per_unit: 0,
        cost_per_unit: 0
      }
  } */
  //#swagger.responses[400] = { description: 'Invalid ID' }
  //#swagger.responses[404] = { description: 'Ingredient not found' }

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
  //#swagger.tags = ['Ingredients']
  //#swagger.summary = 'Create ingredient'
  /* #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        name: 'any',
        base_unit: 'any',
        calories_per_unit: 0,
        cost_per_unit: 0
      }
  } */
  /* #swagger.responses[201] = {
      description: 'Ingredient created',
      schema: {
        acknowledged: true,
        insertedId: 'any'
      }
  } */
  //#swagger.responses[400] = { description: 'Bad Request' }
  
  try {
    const ingredient = {
      name: req.body.name,
      base_unit: req.body.base_unit,
      calories_per_unit: Number(req.body.calories_per_unit),
      cost_per_unit: Number(req.body.cost_per_unit)
    };

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
  //#swagger.tags = ['Ingredients']
  //#swagger.summary = 'Update ingredient'
  //#swagger.parameters['id'] = { in: 'path', required: true, type: 'string' }
  /* #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        name: 'any',
        base_unit: 'any',
        calories_per_unit: 0,
        cost_per_unit: 0
      }
  } */
  /* #swagger.responses[200] = {
      description: 'Ingredient updated',
      schema: {
        acknowledged: true,
        matchedCount: 0,
        modifiedCount: 0
      }
  } */
  //#swagger.responses[404] = { description: 'Ingredient not found' }

  try {
    const id = req.params.id;

    const ingredient = {
      name: req.body.name,
      base_unit: req.body.base_unit,
      calories_per_unit: Number(req.body.calories_per_unit),
      cost_per_unit: Number(req.body.cost_per_unit)
    };

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
  //#swagger.tags = ['Ingredients']
  //#swagger.summary = 'Delete ingredient'
  //#swagger.parameters['id'] = { in: 'path', required: true, type: 'string' }
  //#swagger.responses[204] = { description: 'Deleted successfully' }
  //#swagger.responses[404] = { description: 'Ingredient not found' }

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