const jwt = require("jsonwebtoken");
const secretKey = "SuperSecret";

async function verifyUser(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  const userId = req.body.userId;
  let decoded;

  if (!token) {
    return res.status(401).json({ error: "Authorization token must be provided" });
  }

  try {
    decoded = jwt.verify(token, secretKey);

    if (decoded.id !== userId && decoded.role !== 'admin' && decoded.role !== 'instructor') {
      return res.status(403).json({ error: "Not authorized" });
    }

    req.user = decoded; // Add decoded payload to request
    next();
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid token" });
    }
    next(e);
  }
}

module.exports = {
  verifyUser,
  secretKey
};
