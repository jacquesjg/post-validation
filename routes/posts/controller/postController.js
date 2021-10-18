const { isAlpha, isInt } = require("validator");
const Post = require('../model/Post');
const User = require('../../users/model/User');
const { jwtMiddleware } = require('../../users/lib/authMiddleware/shared/jwtMiddleware');
const errorHandler = require("../../../utils/errorHandler/errorHandler");

async function createPost(req, res) {
  try {
    const { postTitle, postBody } = req.body;
    let errObj = {};

    if (!postTitle) {
      errObj.postTitle = "Please enter a title!";
    };

    if (!postBody) {
      errObj.postBody = "Please write a post!";
    }

    if (Object.keys(errObj).length > 0) {
      return res.status(500).json({
        message: "error",
        error: errObj,
      });
    }
    // remember that jw middleware was ran before in router and thats how we got the decoded data
    const decodedData = res.locals.decodedData;
    const foundUser = await User.findOne({ email: decodedData.email })

    const createdPost = new Post({
      postTitle,
      postBody,
      postOwner: foundUser._id,
    });

    const savedPost = await createdPost.save();
    foundUser.postHistory.push(savedPost._id);

    await foundUser.save();

    res.json({ message: "success", createdPost });

  } catch (e) {
    res
      .status(500)
      .json(errorHandler(e));
  }
};

async function getAllPosts(req, res) {
  const foundAllPosts = await Post.find({}).populate("postOwner", "username");
  res.json({ message: "success", payload: foundAllPosts });
};

async function updatePostById(req, res) {
  try {
    const foundPost = await Post.findById(req.params.id);
    const foundUser = await User.findOne({ email: res.locals.decodedData.email })
    console.log(59, foundPost.postOwner);
    console.log(60, foundUser._id)
    if (!foundPost) {
      res.status(404).json({ message: "failure", error: "post not found" })
    } else if (JSON.stringify(foundUser._id) !== JSON.stringify(foundPost.postOwner)) {
      res.status(403).json({ message: "failure", error: "user can only update their own post" });
    } else {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      )
      res.json({ message: "success", payload: updatedPost })
    }
  } catch (e) {
    res.status(500).json({ message: "error", error: e.message })
  }
}

async function deletePostById(req, res) {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res
        .status(404)
        .json({ message: "failure", error: "post not found" })
    } else {
      const decodedData = res.locals.decodedData;
      const foundUser = await User.findOne({ email: decodedData.email });
      const userPostHistoryArray = foundUser.postHistory;
      const filteredPostHistoryArray = userPostHistoryArray.filter(
        (item) => item._id.toString() !== req.params.id
      );

      foundUser.postHistory = filteredPostHistoryArray;
      await foundUser.save();

      res.json({
        message: "success",
        deleted: deletedPost,
      })
    }
  } catch (e) {
    res.status(500).json(errorHandler(e));
  }
}

module.exports = {
  createPost,
  getAllPosts,
  updatePostById,
  deletePostById,
}
