const express = require('express');
const router = express.Router();
const { jwtMiddleware } = require('../users/lib/authMiddleware/');
const { createPost } = require('./controller/postController');

router.post(
  "/create-post",
  jwtMiddleware,
  createPost,
);

module.exports = router;