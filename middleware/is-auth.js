const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      req.isAuth = false;
      return next();
    }
    const token = authHeader.split(" ")[1]; //Bearer askdksjkf
    if (!token || token === "") {
      req.isAuth = false;
      return next();
    }

    let decodedToken = jwt.verify(token, "secretKey");
    if (!decodedToken) {
      req.isAuth = false;
      return next();
    }

    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    req.isAuth = false;
    next();
  }
};
