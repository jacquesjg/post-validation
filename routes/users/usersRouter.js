const express = require('express');
const router = express.Router();

const {
  checkIsEmpty,
  checkIsUndefined,
  validateCreateData,
  validateLoginData,
  jwtMiddleware,
} = require('./lib/authMiddleware/')

const {
  createUser,
  login,
  deleteUser,
} = require('./controller/userController');


router.post(
  '/create-user',
  checkIsUndefined,
  checkIsEmpty,
  validateCreateData,
  createUser,
);

router.post(
  '/login',
  checkIsUndefined,
  checkIsEmpty,
  validateLoginData,
  login,
);

router.delete(
  '/delete-user/',
  jwtMiddleware,
  deleteUser,
)

module.exports = router;