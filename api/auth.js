const jwt = require("jsonwebtoken");
const secretKey = "SuperSecret";

async function verifyUser(req, res, next) {
  let decoded;

  if (req.headers["authorization"]) {
    const token = req.headers["authorization"].split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Authorization token must be provided" });
    }

    try {
      decoded = jwt.verify(token, secretKey);
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: "Invalid token" });
      }
      next(e);
    }

    req.user = decoded; // Add decoded payload to request
  } 

  // Proceed if no user data is required or if user is an admin/instructor
  if (!req.user || req.user.role === 'admin' || req.user.role === 'instructor') {
    next();
  } else if (req.user.role === 'student' && req.user.id === req.params.id) {
    // Proceed only if the student is trying to access their own data
    next();
  } else {
    return res.status(403).json({ error: "Not authorized" });
  }
}

module.exports = {
  verifyUser,
  secretKey
};
