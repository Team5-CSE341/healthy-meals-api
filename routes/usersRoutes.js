const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/usersController');
const validateUser= require('../middleware/usersValidator');

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', validateUser.validationUser, validateUser.validate, createUser);
router.put('/:id', validateUser.validationUser, validateUser.validate, updateUser);
router.delete('/:id', validateUser.validateDeleteUser, validateUser.validate, deleteUser);

module.exports = router;