const express = require('express');
const router = express.Router();
const Comment = require('./model/Comment');
const Post = require('../posts/model/Post');
const User = require('../../routes/users/model/User');
const { jwtMiddleware } = require('../users/lib/authMiddleware/shared/jwtMiddleware');
const { deleteComments } = require('./controller/commentController')

router.post('/create-comment-by-post-id/:id', jwtMiddleware, async (req, res) => {
  try {
    const decodedData = res.locals.decodedData
    const foundUser = await User.findOne({ email: decodedData.email });
    // now found user
    const postId = req.params.id;
    // get the comment text and record post id
    const createdComment = new Comment({
      text: req.body.comment,
      post: postId,
      commentOwner: foundUser._id,
    })
    // save comment
    const savedComment = await createdComment.save();
    // update user comment history
    foundUser.commentHistory.push(savedComment._id);
    await foundUser.save();
    // now push into post
    const foundRelatedPost = await Post.findById(postId);
    foundRelatedPost.postComments.push(savedComment);;
    await foundRelatedPost.save();
    res.json({ mesagge: "success", savedComment })
  } catch (e) {
    res.status(500).json({ message: "error", error: e.message });
  }
});

router.delete('/delete-comment-by-id/:id', jwtMiddleware, deleteComments);

module.exports = router;