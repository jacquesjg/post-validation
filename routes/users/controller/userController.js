const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const Post = require('../../posts/model/Post');
const { deleteComments } = require('../../comments/controller/commentController')

async function createUser(req, res) {
  const { firstName, lastName, username, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const createdUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });
    let savedUser = await createdUser.save()
    res.json({ message: "success", payload: savedUser })
  } catch (error) {
    res.status(500).json({ message: "error", error: error.message })
  }
};

async function login(req, res) {
  const { username, email, password } = req.body;
  try {
    const foundUser = await User.findOne({ email: email })
    console.log('founderUser', foundUser);



    if (!foundUser) {
      return res
        .status(500).json({
          error: "Error",
          message: "Account not found, Please sign up!",
        });
    } else {
      const comparedPassword = await bcrypt.compare(password, foundUser.password)
      if (!comparedPassword) {
        return res
          .status(500)
          .json({
            error: "Error",
            message: "Incorrect password, try again!"
          })
      } else {
        const jwtToken = jwt.sign({
          email: foundUser.email,
          username: foundUser.username,
        }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ message: 'success', payload: jwtToken })
      }
    }
  } catch (e) {
    res
      .status(500)
      .json({
        message: "error", error: e.message
      })
  }
};

async function deleteUser(req, res) {
  try {
    // TODO: delete comments first:
    // find user

    const foundUser = await User.find({ email: res.locals.decodedData.email });
    console.log(foundUser);

    const deletedPosts = await Post.deleteMany({ postOwner: foundUser._id });

    const deletedUser = await User.findByIdAndDelete(foundUser._id);

    res.json({ message: "success", payload: deletedUser });
  } catch (e) {
    res.json({ message: error, error: e.message })
  }
}


module.exports = {
  createUser,
  login,
  deleteUser,
};