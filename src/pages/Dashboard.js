"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"
import { Calendar, Pill, Activity, Stethoscope, Clock, AlertCircle } from "lucide-react"

const Dashboard = () => {
  const { currentUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    upcomingAppointments: [],
    medications: [],
    recentSymptoms: [],
    healthMetrics: {},
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("/api/dashboard")
        setDashboardData(response.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Mock data for development
  useEffect(() => {
    if (isLoading) {
      // Simulate API response
      setTimeout(() => {
        setDashboardData({
          upcomingAppointments: [
            {
              id: 1,
              doctorName: "Dr. Sarah Johnson",
              specialty: "General Practitioner",
              date: "2025-04-10T14:30:00",
              status: "confirmed",
            },
            {
              id: 2,
              doctorName: "Dr. Michael Chen",
              specialty: "Cardiologist",
              date: "2025-04-15T10:00:00",
              status: "pending",
            },
          ],
          medications: [
            {
              id: 1,
              name: "Lisinopril",
              dosage: "10mg",
              frequency: "Once daily",
              timeOfDay: "Morning",
              refillDate: "2025-05-01",
            },
            {
              id: 2,
              name: "Metformin",
              dosage: "500mg",
              frequency: "Twice daily",
              timeOfDay: "Morning and Evening",
              refillDate: "2025-04-20",
            },
            {
              id: 3,
              name: "Atorvastatin",
              dosage: "20mg",
              frequency: "Once daily",
              timeOfDay: "Evening",
              refillDate: "2025-05-15",
            },
          ],
          recentSymptoms: [
            { id: 1, symptom: "Headache", severity: "Moderate", date: "2025-04-03T09:15:00", status: "resolved" },
            { id: 2, symptom: "Fatigue", severity: "Mild", date: "2025-04-04T14:20:00", status: "ongoing" },
          ],
          healthMetrics: {
            bloodPressure: { systolic: 120, diastolic: 80, date: "2025-04-01" },
            bloodGlucose: { value: 95, unit: "mg/dL", date: "2025-04-02" },
            weight: { value: 70, unit: "kg", date: "2025-04-01" },
          },
        })
        setIsLoading(false)
      }, 1000)
    }
  }, [isLoading])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {currentUser?.firstName || "User"}!</h1>
        <p className="mt-1 text-gray-600">Here's an overview of your health information.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/symptom-checker"
              className="flex flex-col items-center p-3 text-emerald-600 transition-colors rounded-md hover:bg-emerald-50"
            >
              <Stethoscope className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium text-center">Check Symptoms</span>
            </Link>
            <Link
              to="/consultations"
              className="flex flex-col items-center p-3 text-emerald-600 transition-colors rounded-md hover:bg-emerald-50"
            >
              <Calendar className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium text-center">Book Consultation</span>
            </Link>
            <Link
              to="/medications"
              className="flex flex-col items-center p-3 text-emerald-600 transition-colors rounded-md hover:bg-emerald-50"
            >
              <Pill className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium text-center">Medication Tracker</span>
            </Link>
            <Link
              to="/health-metrics"
              className="flex flex-col items-center p-3 text-emerald-600 transition-colors rounded-md hover:bg-emerald-50"
            >
              <Activity className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium text-center">Health Metrics</span>
            </Link>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
            <Link to="/consultations" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              View all
            </Link>
          </div>
          {dashboardData.upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-3 border border-gray-200 rounded-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{appointment.doctorName}</h3>
                      <p className="text-sm text-gray-500">{appointment.specialty}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        appointment.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {appointment.status === "confirmed" ? "Confirmed" : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(appointment.date)}</span>
                    <Clock className="w-4 h-4 ml-3 mr-1" />
                    <span>{formatTime(appointment.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <Calendar className="w-12 h-12 mb-2 text-gray-400" />
              <p className="text-gray-500">No upcoming appointments</p>
              <Link to="/consultations" className="mt-2 text-sm font-medium text-emerald-600 hover:text-emerald-700">
                Schedule a consultation
              </Link>
            </div>
          )}
        </div>

        {/* Medication Reminders */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Medication Reminders</h2>
            <Link to="/medications" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              View all
            </Link>
          </div>
          {dashboardData.medications.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.medications.slice(0, 3).map((medication) => (
                <div key={medication.id} className="p-3 border border-gray-200 rounded-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{medication.name}</h3>
                      <p className="text-sm text-gray-500">
                        {medication.dosage} - {medication.frequency}
                      </p>
                      <p className="text-sm text-gray-500">{medication.timeOfDay}</p>
                    </div>
                    <Pill className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Refill by: {new Date(medication.refillDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <Pill className="w-12 h-12 mb-2 text-gray-400" />
              <p className="text-gray-500">No medications added</p>
              <Link to="/medications" className="mt-2 text-sm font-medium text-emerald-600 hover:text-emerald-700">
                Add medications
              </Link>
            </div>
          )}
        </div>

        {/* Recent Symptoms */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Symptoms</h2>
            <Link to="/symptom-checker" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              Check symptoms
            </Link>
          </div>
          {dashboardData.recentSymptoms.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.recentSymptoms.map((symptom) => (
                <div key={symptom.id} className="p-3 border border-gray-200 rounded-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{symptom.symptom}</h3>
                      <p className="text-sm text-gray-500">Severity: {symptom.severity}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        symptom.status === "resolved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {symptom.status === "resolved" ? "Resolved" : "Ongoing"}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">Reported: {formatDate(symptom.date)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <AlertCircle className="w-12 h-12 mb-2 text-gray-400" />
              <p className="text-gray-500">No recent symptoms</p>
              <Link to="/symptom-checker" className="mt-2 text-sm font-medium text-emerald-600 hover:text-emerald-700">
                Record symptoms
              </Link>
            </div>
          )}
        </div>

        {/* Health Metrics */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Health Metrics</h2>
            <Link to="/health-metrics" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {dashboardData.healthMetrics.bloodPressure && (
              <div className="p-3 border border-gray-200 rounded-md">
                <h3 className="text-sm font-medium text-gray-500">Blood Pressure</h3>
                <div className="flex items-baseline mt-1">
                  <span className="text-xl font-semibold text-gray-900">
                    {dashboardData.healthMetrics.bloodPressure.systolic}/
                    {dashboardData.healthMetrics.bloodPressure.diastolic}
                  </span>
                  <span className="ml-1 text-sm text-gray-500">mmHg</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Last updated: {new Date(dashboardData.healthMetrics.bloodPressure.date).toLocaleDateString()}
                </p>
              </div>
            )}

            {dashboardData.healthMetrics.bloodGlucose && (
              <div className="p-3 border border-gray-200 rounded-md">
                <h3 className="text-sm font-medium text-gray-500">Blood Glucose</h3>
                <div className="flex items-baseline mt-1">
                  <span className="text-xl font-semibold text-gray-900">
                    {dashboardData.healthMetrics.bloodGlucose.value}
                  </span>
                  <span className="ml-1 text-sm text-gray-500">{dashboardData.healthMetrics.bloodGlucose.unit}</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Last updated: {new Date(dashboardData.healthMetrics.bloodGlucose.date).toLocaleDateString()}
                </p>
              </div>
            )}

            {dashboardData.healthMetrics.weight && (
              <div className="p-3 border border-gray-200 rounded-md">
                <h3 className="text-sm font-medium text-gray-500">Weight</h3>
                <div className="flex items-baseline mt-1">
                  <span className="text-xl font-semibold text-gray-900">
                    {dashboardData.healthMetrics.weight.value}
                  </span>
                  <span className="ml-1 text-sm text-gray-500">{dashboardData.healthMetrics.weight.unit}</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Last updated: {new Date(dashboardData.healthMetrics.weight.date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

