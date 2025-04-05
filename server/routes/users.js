const express = require("express")
const router = express.Router()
const User = require("../models/User")
const auth = require("../middleware/auth")

// @route   GET api/users/profile
// @desc    Get current user profile
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      zipCode,
      emergencyContact,
      allergies,
      medications,
      conditions,
    } = req.body

    // Build user object
    const userFields = {}
    if (firstName) userFields.firstName = firstName
    if (lastName) userFields.lastName = lastName
    if (phone) userFields.phone = phone
    if (dateOfBirth) userFields.dateOfBirth = dateOfBirth
    if (gender) userFields.gender = gender
    if (address) userFields.address = address
    if (city) userFields.city = city
    if (state) userFields.state = state
    if (zipCode) userFields.zipCode = zipCode
    if (emergencyContact) userFields.emergencyContact = emergencyContact
    if (allergies) userFields.allergies = allergies
    if (medications) userFields.medications = medications
    if (conditions) userFields.conditions = conditions

    // Update user
    const user = await User.findByIdAndUpdate(req.user.id, { $set: userFields }, { new: true }).select("-password")

    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

