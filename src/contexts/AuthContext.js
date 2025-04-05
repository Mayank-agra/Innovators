"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import toast from "react-hot-toast"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem("token"))

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      fetchUserProfile()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("/api/users/profile")
      setCurrentUser(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching user profile:", error)
      logout()
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password })
      const { token, user } = response.data

      localStorage.setItem("token", token)
      setToken(token)
      setCurrentUser(user)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

      toast.success("Login successful!")
      return true
    } catch (error) {
      const message = error.response?.data?.message || "Login failed"
      toast.error(message)
      return false
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post("/api/auth/register", userData)
      const { token, user } = response.data

      localStorage.setItem("token", token)
      setToken(token)
      setCurrentUser(user)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

      toast.success("Registration successful!")
      return true
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed"
      toast.error(message)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setCurrentUser(null)
    delete axios.defaults.headers.common["Authorization"]
    toast.success("Logged out successfully")
  }

  const updateProfile = async (userData) => {
    try {
      const response = await axios.put("/api/users/profile", userData)
      setCurrentUser(response.data)
      toast.success("Profile updated successfully")
      return true
    } catch (error) {
      const message = error.response?.data?.message || "Profile update failed"
      toast.error(message)
      return false
    }
  }

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

