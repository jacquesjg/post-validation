// deletes all user comments if req.params.id is default route (:id)
// if :id is replaced by comment id, do line 22

const User = require('../../users/model/User');
const Comment = require('../model/Comment');

async function createComment(req, res) {
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
}

async function getAllComments(req, res) {
  const foundAllComments = await Comment.find({});
  res.json({ message: "success", payload: foundAllComments });
}

async function updateCommentsById(req, res) {
  try {
    const foundComment = await Comment.findById(req.params.id);
    const foundUser = await User.findOne({ email: res.locals.decodedData.email });
    if (!foundComment) {
      res.status(404).json({ message: "failure", error: "comment not found" });
    } else if (JSON.stringify(foundUser._id) !== JSON.stringify(foundComment.commentOwner)) {
      res.status(403).json({ message: "failure", error: "user can only change own comment" })
    } else {
      const updatedComment = await Comment.findOneAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      )
      res.json({ message: "success", payload: updatedComment });
    }
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

async function deleteComments(req, res) {
  try {
    if (!req.params.id) {
      res.json({ error: "error", message: "no id" })
    } else {
      let decodedData = res.locals.decodedData;
      const foundUser = await User.findOne({ email: decodedData.email });
      if (req.params.id === ':id') {
        // delete many comments comment owner with foundUser._id
        console.log('foundUser._id', foundUser._id);
        await Comment.deleteMany({ commentOwner: foundUser._id });
        res.json({
          success: "All user's comments have been deleted"
        });
      } else {
        // if :id is not :id string, we are deleting single comment by comment id
        await Comment.findByIdAndDelete(req.params.id);
        res.json({ success: "One user comments has been deleted" });
      }
    }
  } catch (e) {
    res.json({ error: "error", message: e.message });
  };
};

module.exports = {
  createComment,
  getAllComments,
  updateCommentsById,
  deleteComments,
}



