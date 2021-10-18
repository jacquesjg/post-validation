const express = require('express');
const router = express.Router();
const Comment = require('./model/Comment');
const Post = require('../posts/model/Post');
const User = require('../../routes/users/model/User');
const { jwtMiddleware } = require('../users/lib/authMiddleware/shared/jwtMiddleware');
const { deleteComments, updateCommentsById, getAllComments } = require('./controller/commentController')

router.get('/get-all-comments/', getAllComments);

router.post('/create-comment-by-post-id/:id', jwtMiddleware,);

router.delete('/delete-comment-by-id/:id', jwtMiddleware, deleteComments);

router.put(
  '/update-comment-by-id/:id',
  jwtMiddleware,
  updateCommentsById,
);

module.exports = router;