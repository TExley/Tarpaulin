const { Router } = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
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

router.post("/", verifyUser, async (req, res, next) => {
  const { name, email, password, role } = req.body;
  if (req.user.role !== 'admin' || (role !== 'admin' && role !== 'instructor')) {
    return res.status(403).json({ error: "Not authorized." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "A user with this email already exists." });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({ id: user.id });
  } catch (e) {
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const payload = {
      id: user.id,
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
    const user = await User.findById(userId).select("-password").exec();
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
