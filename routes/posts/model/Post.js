const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    postOwner: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    postTitle: {
      type: String,
    },
    postBody: {
      type: String,
    },
    postComments: [{
      type: mongoose.Schema.ObjectId,
      ref: 'comment'
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("post", postSchema);