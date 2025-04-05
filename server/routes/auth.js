const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const auth = require("../middleware/auth")

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, dateOfBirth, gender, phone } = req.body

    // Check if user already exists
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create new user
    user = new User({
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phone,
    })

    await user.save()

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
      },
    }

    jwt.sign(payload, process.env.JWT_SECRET || "secret", { expiresIn: "7d" }, (err, token) => {
      if (err) throw err
      res.json({
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          phone: user.phone,
        },
      })
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
      },
    }

    jwt.sign(payload, process.env.JWT_SECRET || "secret", { expiresIn: "7d" }, (err, token) => {
      if (err) throw err
      res.json({
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          phone: user.phone,
        },
      })
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET api/auth
// @desc    Get authenticated user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

