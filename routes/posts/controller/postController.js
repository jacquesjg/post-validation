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

module.exports = {
  createPost,
}
