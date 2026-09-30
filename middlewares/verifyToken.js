const { func } = require("joi");
const jwt = require("jsonwebtoken");

// Verify Token
function verifyToken(req, res, next) {
  const token = req.headers.token;
  if (token) {
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decode;
      next();
    } catch {
      res.status(401).json({ message: "Invalid Token" });
    }
  } else {
    res.status(401).json({ message: "No Token Provided" }); // 401 Unauthorized
  }
}

// Verify Token And Authorized the User
function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next;
    } else {
      return (403).json({ message: "You Are Not Allowed" });
    }
  });
}

// Verify Token And Admin
function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "You Are Not Allowed , Only Admin" });
    }
  });
}

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
