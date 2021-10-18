const express = require('express');
const router = express.Router();
const { jwtMiddleware } = require('../users/lib/authMiddleware/');
const { createPost, getAllPosts, updatePostById, deletePostById } = require('./controller/postController');

router.post(
  "/create-post",
  jwtMiddleware,
  createPost,
);

router.get(
  "/get-all-posts",
  jwtMiddleware,
  getAllPosts,
)

router.put(
  "/update-post-by-id/:id",
  jwtMiddleware,
  updatePostById,
)

router.delete(
  "/delete-post-by-id/:id",
  jwtMiddleware,
  deletePostById,
)

module.exports = router;