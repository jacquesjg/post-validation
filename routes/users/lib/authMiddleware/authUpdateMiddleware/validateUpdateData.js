const {
  isAlpha,
  isAlphanumeric,
  isStrongPassword,
} = require("validator");

function validateUpdateData(req, res, next) {

  try {

    let errObj = {};

    const { firstName, lastName, username, password, confirmPassword } = req.body;

    if (!isAlpha(firstName)) {
      errObj.firstName = "First Name cannot have special characters or numbers.";
    }


    if (!isAlpha(lastName)) {
      errObj.lastName = "Last Name cannot have special characters or numbers.";
    }


    if (!isAlphanumeric(username)) {
      errObj.username = "Username cannot have special characters.";
    }

    if (!isStrongPassword(password)) {
      errObj.password =
        "Your password must contain 1 lowercase, 1 uppercase, 1 number, 1 special character and at least 8 characters long";
    }

    if (password !== confirmPassword) {
      errObj.confirmPassword = "Password and confirm password must match";
    }

    if (Object.keys(errObj).length > 0) {
      return res.status(500).json({
        message: "error",
        error: errObj,
      });
    } else {
      next();
    }

  } catch (e) {
    res.json({ error: error, message: e.message })
  }

}

module.exports = {
  validateUpdateData,
};