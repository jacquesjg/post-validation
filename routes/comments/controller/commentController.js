// deletes all user comments if req.params.id is default route (:id)
// if :id is replaced by comment id, do line 22

const User = require('../../users/model/User');
const Comment = require('../model/Comment');

async function deleteComments(req, res) {
  try {
    if (!req.params.id) {
      res.json({ error: "error", message: "no id" })
    } else {
      let id = req.params.id;
      let decodedData = res.locals.decodedData;
      const foundUser = await User.findOne({ email: decodedData.email });
      if (id === ':id') {
        // delete many comments comment owner with foundUser._id
        console.log('foundUser._id', foundUser._id);
        await Comment.deleteMany({ commentOwner: foundUser._id });
        res.json({
          success: "All user's comments have been deleted"
        });
      } else {
        // if :id is not :id string, we are deleting single comment by comment id
        await Comment.findByIdAndDelete(id);
        res.json({ success: "One user comments has been deleted" });
      }
    }
  } catch (e) {
    res.json({ error: "error", message: e.message });
  };
};

module.exports = {
  deleteComments,
}