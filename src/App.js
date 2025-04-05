import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "./contexts/AuthContext"

// Pages
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Register from "./pages/Register"
import SymptomChecker from "./pages/SymptomChecker"
import Consultations from "./pages/Consultations"
import MedicationTracker from "./pages/MedicationTracker"
import HealthMetrics from "./pages/HealthMetrics"
import ResourceDirectory from "./pages/ResourceDirectory"
import Profile from "./pages/Profile"
import PrivateRoute from "./components/PrivateRoute"

// Layout
import Layout from "./components/Layout"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/symptom-checker"
            element={
              <PrivateRoute>
                <Layout>
                  <SymptomChecker />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/consultations"
            element={
              <PrivateRoute>
                <Layout>
                  <Consultations />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/medications"
            element={
              <PrivateRoute>
                <Layout>
                  <MedicationTracker />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/health-metrics"
            element={
              <PrivateRoute>
                <Layout>
                  <HealthMetrics />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <PrivateRoute>
                <Layout>
                  <ResourceDirectory />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Layout>
                  <Profile />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

