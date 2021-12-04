const express = require('express');
const userControllers = require('../controllers/userControllers');

const { getUsers, getUser, createUser, updateUser, deleteUser } =
  userControllers;

const router = express.Router();
router.route('/').get(getUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
