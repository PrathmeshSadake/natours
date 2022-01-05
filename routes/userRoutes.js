const express = require('express');
const userControllers = require('../controllers/userControllers');
const authControllers = require('../controllers/authControllers');

const { getUsers, getUser, createUser, updateUser, deleteUser } =
  userControllers;

const router = express.Router();

router.post('/signup', authControllers.signup);
router.post('/login', authControllers.login);

router.route('/').get(getUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
