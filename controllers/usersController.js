const { getDb } = require('../db/connection');
const { ObjectId } = require('mongodb');

// GET all users
const getAllUsers = async (req, res) => {
  //#swagger.tags = ['Users']
  //#swagger.summary = 'Get all users'
  /* #swagger.responses[200] = {
      description: 'List of users',
      schema: [{
        _id: 'any',
        first_name: 'any',
        last_name: 'any',
        age: 0,
        email: 'any',
        weight: 0,
        height: 0,
        activity_level: 'any',
        goal: 'any'
      }]
  } */

  try {
    const db = getDb();
    const users = await db.collection('users').find().toArray();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single user
const getUserById = async (req, res) => {
  //#swagger.tags = ['Users']
  //#swagger.summary = 'Get user by ID'
  //#swagger.parameters['id'] = { in: 'path', description: 'User ID', required: true, type: 'string' }
  /* #swagger.responses[200] = {
      description: 'User found',
      schema: {
        _id: 'any',
        first_name: 'any',
        last_name: 'any',
        age: 0,
        email: 'any',
        weight: 0,
        height: 0,
        activity_level: 'any',
        goal: 'any'
      }
  } */
  //#swagger.responses[400] = { description: 'Invalid ID' }
  //#swagger.responses[404] = { description: 'User not found' }

  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const db = getDb();
    const user = await db.collection('users').findOne({
      _id: new ObjectId(id)
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create user
const createUser = async (req, res) => {
  //#swagger.tags = ['Users']
  //#swagger.summary = 'Create user'
  /* #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        first_name: 'any',
        last_name: 'any',
        sex: 'man | woman',
        age: 0,
        email: 'any',
        weight: 0,
        height: 0,
        activity_level: 'sedentary | lightly active | moderately active | very active | extra active',
        goal: 'lose fat | maintain weight | gain muscle'
      }
  } */
  /* #swagger.responses[201] = {
      description: 'User successfully created'}
  } */
  //#swagger.responses[400] = { description: 'Bad Request' }
  
  try {
    const user = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      sex: req.body.sex,
      age: Number(req.body.age),
      email: req.body.email,
      weight: Number(req.body.weight),
      height: Number(req.body.height),
      activity_level: req.body.activity_level,
      goal: req.body.goal
    };

    if (!user.first_name || !user.email) {
      return res.status(400).json({ message: 'First name and email are required' });
    }

    const db = getDb();
    const result = await db.collection('users').insertOne(user);

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update user
const updateUser = async (req, res) => {
  //#swagger.tags = ['Users']
  //#swagger.summary = 'Update user'
  //#swagger.parameters['id'] = { in: 'path', required: true, type: 'string' }
  /* #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        first_name: 'any',
        last_name: 'any',
        age: 0,
        email: 'any',
        weight: 0,
        height: 0,
        activity_level: 'sedentary | lightly active | moderately active | very active | extra active',
        goal: 'lose fat | maintain weight | gain muscle'
      }
  } */
  /* #swagger.responses[200] = {
      description: 'User successfully updated'}
  } */
  //#swagger.responses[404] = { description: 'User not found' }

  try {
    const id = req.params.id;

    const user = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      age: Number(req.body.age),
      email: req.body.email,
      weight: Number(req.body.weight),
      height: Number(req.body.height),
      activity_level: req.body.activity_level,
      goal: req.body.goal
    };

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    if (!user.first_name || !user.email) {
      return res.status(400).json({ message: 'First name and email are required' });
    }

    const db = getDb();
    const result = await db.collection('users').replaceOne(
      { _id: new ObjectId(id) },
      user
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE user
const deleteUser = async (req, res) => {
  //#swagger.tags = ['Users']
  //#swagger.summary = 'Delete user'
  //#swagger.parameters['id'] = { in: 'path', required: true, type: 'string' }
  //#swagger.responses[204] = { description: 'User successfully deleted' }
  //#swagger.responses[404] = { description: 'User not found' }

  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const db = getDb();
    const result = await db.collection('users').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};