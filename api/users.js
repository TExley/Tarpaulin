const { Router } = require("express");
const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb');
const User = require("../models/user");
const Course = require("../models/course");
const Submission = require("../models/submission");
const { verifyUser } = require("./auth.js");
const { secretKey } = require('./auth.js');

const router = Router();

router.get("/", verifyUser, async function (req, res, next) {
  try {
    const users = await User.find().select("-password").exec();
    res.status(200).json({ users });
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
    const { name, email, password, role } = req.body;
  
    try {
      const existingUser = await User.getUserByEmail(email);
      if (existingUser) {
        return res
          .status(409)
          .json({ error: "A user with this email already exists." });
      }
  
      const userId = await User.createUser({ name, email, password, role });
  
      const payload = { id: userId, role: role };
      const token = jwt.sign(payload, secretKey, { expiresIn: "24h" });
  
      console.log("TOKEN:", token);
  
      res.status(201).json({ id: userId, role: role, token: token});
    } catch (e) {
      next(e);
    }
  });
  
  router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.validateUser(email, password);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password." });
      }
  
      const payload = {
        id: user._id, // in MongoDB, the ID field is _id, not id
        role: user.role,
      };
      const token = jwt.sign(payload, secretKey, { expiresIn: "24h" });
  
      res.status(200).json({ token });
    } catch (e) {
      next(e);
    }
  });
  
  router.get("/:id", verifyUser, async (req, res, next) => {
    const userId = req.params.id;
  
    if (req.user.id !== userId) {
      return res.status(403).json({ error: "Not authorized." });
    }
  
    try {
      const user = await User.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      res.status(200).json({ user });
    } catch (e) {
      next(e);
    }
  });

router.get("/:id/courses", verifyUser, async function (req, res, next) {
  const userId = req.params.id;
  
  try {
    let userCourses;
    if(req.user.role === 'instructor') {
      userCourses = await Course.find({ instructorId: new ObjectId(userId) }).exec();
    } else if(req.user.role === 'student') {
      userCourses = await Course.find({ students: new ObjectId(userId) }).exec();
    } else {
      return res.status(403).json({ error: "Not authorized." });
    }
    res.status(200).json({ courses: userCourses });
  } catch (e) {
    next(e);
  }
});

router.get("/:id/submissions", verifyUser, async function (req, res, next) {
  const userId = req.params.id;
  
  try {
    const userSubmissions = await Submission.find({
      userId: new ObjectId(userId),
    }).exec();
    res.status(200).json({ submissions: userSubmissions });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
