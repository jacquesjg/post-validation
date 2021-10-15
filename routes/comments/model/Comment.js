const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'post'
    },
    commentOwner: {
      type: mongoose.Schema.ObjectId,
      ref: 'user'
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('comment', commentSchema);


