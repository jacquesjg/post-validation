const jwt = require("jsonwebtoken");

async function jwtMiddleware(req, res, next) {
  try {
    if (req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      const notDecodedToken = req.headers.authorization;
      slicedToken = notDecodedToken.slice(7);
      const decodedToken = jwt.verify(slicedToken, process.env.JWT_SECRET);
      res.locals.decodedData = decodedToken;
      next();
    } else {
      throw { message: "You don't have permission" }
    }
  } catch (e) {
    res.status(500).json({ message: 'error', error: e.message });
  }
};

module.exports = { jwtMiddleware }

