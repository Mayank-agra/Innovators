"use client"

import { useState, useEffect } from "react"
import { Pill, Calendar, Plus, Edit, Trash, Bell, CheckCircle, XCircle } from "lucide-react"

const MedicationTracker = () => {
  const [medications, setMedications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingMedication, setEditingMedication] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "once_daily",
    timeOfDay: [],
    startDate: "",
    endDate: "",
    instructions: "",
    refillDate: "",
    refillReminder: false,
  })
  const [adherenceData, setAdherenceData] = useState({})

  // Mock data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockMedications = [
        {
          id: 1,
          name: "Lisinopril",
          dosage: "10mg",
          frequency: "once_daily",
          timeOfDay: ["morning"],
          startDate: "2025-01-15",
          endDate: "2025-07-15",
          instructions: "Take with food",
          refillDate: "2025-05-01",
          refillReminder: true,
        },
        {
          id: 2,
          name: "Metformin",
          dosage: "500mg",
          frequency: "twice_daily",
          timeOfDay: ["morning", "evening"],
          startDate: "2025-02-01",
          endDate: "",
          instructions: "Take with meals",
          refillDate: "2025-04-20",
          refillReminder: true,
        },
        {
          id: 3,
          name: "Atorvastatin",
          dosage: "20mg",
          frequency: "once_daily",
          timeOfDay: ["evening"],
          startDate: "2025-03-10",
          endDate: "",
          instructions: "Take at bedtime",
          refillDate: "2025-05-15",
          refillReminder: true,
        },
      ]

      // Generate mock adherence data
      const mockAdherenceData = {}
      mockMedications.forEach((med) => {
        mockAdherenceData[med.id] = {
          lastWeek: Array(7)
            .fill(0)
            .map(() => Math.random() > 0.2), // 80% adherence
          thisMonth: Math.floor(Math.random() * 21) + 10, // 10-30 days
        }
      })

      setMedications(mockMedications)
      setAdherenceData(mockAdherenceData)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleTimeOfDayChange = (time) => {
    const updatedTimeOfDay = [...formData.timeOfDay]

    if (updatedTimeOfDay.includes(time)) {
      const index = updatedTimeOfDay.indexOf(time)
      updatedTimeOfDay.splice(index, 1)
    } else {
      updatedTimeOfDay.push(time)
    }

    setFormData({ ...formData, timeOfDay: updatedTimeOfDay })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingMedication) {
      // Update existing medication
      const updatedMedications = medications.map((med) =>
        med.id === editingMedication.id ? { ...formData, id: med.id } : med,
      )
      setMedications(updatedMedications)
    } else {
      // Add new medication
      const newMedication = {
        ...formData,
        id: medications.length + 1,
      }
      setMedications([...medications, newMedication])

      // Initialize adherence data for new medication
      setAdherenceData({
        ...adherenceData,
        [newMedication.id]: {
          lastWeek: Array(7).fill(false),
          thisMonth: 0,
        },
      })
    }

    // Reset form
    resetForm()
  }

  const handleEdit = (medication) => {
    setEditingMedication(medication)
    setFormData({
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      timeOfDay: medication.timeOfDay,
      startDate: medication.startDate,
      endDate: medication.endDate || "",
      instructions: medication.instructions,
      refillDate: medication.refillDate,
      refillReminder: medication.refillReminder,
    })
    setShowAddForm(true)
  }

  const handleDelete = (medicationId) => {
    if (window.confirm("Are you sure you want to delete this medication?")) {
      setMedications(medications.filter((med) => med.id !== medicationId))
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      dosage: "",
      frequency: "once_daily",
      timeOfDay: [],
      startDate: "",
      endDate: "",
      instructions: "",
      refillDate: "",
      refillReminder: false,
    })
    setEditingMedication(null)
    setShowAddForm(false)
  }

  const toggleAdherence = (medicationId, dayIndex) => {
    const updatedAdherenceData = { ...adherenceData }
    const lastWeek = [...updatedAdherenceData[medicationId].lastWeek]
    lastWeek[dayIndex] = !lastWeek[dayIndex]

    updatedAdherenceData[medicationId] = {
      ...updatedAdherenceData[medicationId],
      lastWeek,
    }

    setAdherenceData(updatedAdherenceData)
  }

  const getFrequencyText = (frequency) => {
    switch (frequency) {
      case "once_daily":
        return "Once daily"
      case "twice_daily":
        return "Twice daily"
      case "three_times_daily":
        return "Three times daily"
      case "four_times_daily":
        return "Four times daily"
      case "as_needed":
        return "As needed"
      case "weekly":
        return "Weekly"
      default:
        return frequency
    }
  }

  const getTimeOfDayText = (timeOfDay) => {
    return timeOfDay.map((time) => time.charAt(0).toUpperCase() + time.slice(1)).join(", ")
  }

  const getDaysOfWeek = () => {
    const today = new Date()
    const days = []

    for (let i = 6; i >= 0; i--) {
      const day = new Date()
      day.setDate(today.getDate() - i)
      days.push(day.toLocaleDateString("en-US", { weekday: "short" }))
    }

    return days
  }

  const calculateAdherencePercentage = (medicationId) => {
    if (!adherenceData[medicationId]) return 0

    const takenCount = adherenceData[medicationId].lastWeek.filter((taken) => taken).length
    return Math.round((takenCount / 7) * 100)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Medication Tracker</h1>
        <p className="mt-1 text-gray-600">Manage your medications and track adherence</p>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center px-4 py-2 text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          {showAddForm ? (
            <>
              <XCircle className="w-5 h-5 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 mr-2" />
              Add Medication
            </>
          )}
        </button>
      </div>

      {showAddForm && (
        <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {editingMedication ? "Edit Medication" : "Add New Medication"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Medication Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">
                  Dosage
                </label>
                <input
                  type="text"
                  id="dosage"
                  name="dosage"
                  required
                  value={formData.dosage}
                  onChange={handleInputChange}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="e.g., 10mg, 500mg"
                />
              </div>

              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                  Frequency
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  required
                  value={formData.frequency}
                  onChange={handleInputChange}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                >
                  <option value="once_daily">Once daily</option>
                  <option value="twice_daily">Twice daily</option>
                  <option value="three_times_daily">Three times daily</option>
                  <option value="four_times_daily">Four times daily</option>
                  <option value="as_needed">As needed</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Time of Day</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => handleTimeOfDayChange("morning")}
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      formData.timeOfDay.includes("morning")
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    Morning
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTimeOfDayChange("afternoon")}
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      formData.timeOfDay.includes("afternoon")
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    Afternoon
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTimeOfDayChange("evening")}
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      formData.timeOfDay.includes("evening")
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    Evening
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTimeOfDayChange("bedtime")}
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      formData.timeOfDay.includes("bedtime")
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    Bedtime
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date (optional)
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                  Special Instructions
                </label>
                <textarea
                  id="instructions"
                  name="instructions"
                  rows="2"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="e.g., Take with food, avoid alcohol"
                ></textarea>
              </div>

              <div>
                <label htmlFor="refillDate" className="block text-sm font-medium text-gray-700">
                  Next Refill Date
                </label>
                <input
                  type="date"
                  id="refillDate"
                  name="refillDate"
                  value={formData.refillDate}
                  onChange={handleInputChange}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                />
              </div>

              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  id="refillReminder"
                  name="refillReminder"
                  checked={formData.refillReminder}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="refillReminder" className="block ml-2 text-sm text-gray-900">
                  Set reminder for refill
                </label>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                {editingMedication ? "Update Medication" : "Add Medication"}
              </button>
            </div>
          </form>
        </div>
      )}

      {medications.length > 0 ? (
        <div className="space-y-6">
          {medications.map((medication) => (
            <div key={medication.id} className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full">
                    <Pill className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{medication.name}</h3>
                    <p className="text-sm text-gray-500">
                      {medication.dosage} - {getFrequencyText(medication.frequency)}
                    </p>
                    {medication.timeOfDay.length > 0 && (
                      <p className="text-sm text-gray-500">Time: {getTimeOfDayText(medication.timeOfDay)}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(medication)}
                    className="p-1 text-gray-400 rounded-md hover:bg-gray-100 hover:text-gray-500"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(medication.id)}
                    className="p-1 text-gray-400 rounded-md hover:bg-gray-100 hover:text-red-500"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {medication.instructions && (
                <div className="mt-3 text-sm text-gray-600">
                  <strong>Instructions:</strong> {medication.instructions}
                </div>
              )}

              <div className="flex flex-wrap mt-4 text-sm text-gray-500">
                <div className="flex items-center mr-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Started: {new Date(medication.startDate).toLocaleDateString()}</span>
                </div>
                {medication.endDate && (
                  <div className="flex items-center mr-4">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Ends: {new Date(medication.endDate).toLocaleDateString()}</span>
                  </div>
                )}
                {medication.refillDate && (
                  <div className="flex items-center">
                    <Bell className="w-4 h-4 mr-1" />
                    <span>Refill by: {new Date(medication.refillDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700">Adherence Tracking</h4>
                <div className="flex items-center mt-2">
                  <div className="w-full max-w-xs">
                    <div className="flex justify-between mb-1 text-xs text-gray-500">
                      {getDaysOfWeek().map((day, index) => (
                        <div key={index} className="text-center">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between">
                      {adherenceData[medication.id]?.lastWeek.map((taken, index) => (
                        <button
                          key={index}
                          onClick={() => toggleAdherence(medication.id, index)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            taken ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }`}
                        >
                          {taken ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="ml-6">
                    <div className="text-sm font-medium text-gray-900">
                      {calculateAdherencePercentage(medication.id)}% adherence
                    </div>
                    <div className="text-xs text-gray-500">Last 7 days</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm">
          <Pill className="w-16 h-16 mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">No medications added</h3>
          <p className="mt-1 text-gray-500">Add your medications to track and manage them</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 mt-4 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Medication
          </button>
        </div>
      )}
    </div>
  )
}

export default MedicationTracker

