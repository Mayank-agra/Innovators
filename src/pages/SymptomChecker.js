"use client"

import { useState } from "react"
import { Search, ChevronRight, AlertCircle, CheckCircle, Loader2 } from "lucide-react"

const SymptomChecker = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [assessment, setAssessment] = useState(null)
  const [isAssessing, setIsAssessing] = useState(false)
  const [step, setStep] = useState(1)
  const [additionalInfo, setAdditionalInfo] = useState({
    age: "",
    gender: "",
    duration: "",
    severity: "moderate",
    existingConditions: "",
    medications: "",
  })

  // Mock symptom data
  const mockSymptoms = [
    { id: 1, name: "Headache" },
    { id: 2, name: "Fever" },
    { id: 3, name: "Cough" },
    { id: 4, name: "Fatigue" },
    { id: 5, name: "Shortness of breath" },
    { id: 6, name: "Sore throat" },
    { id: 7, name: "Nausea" },
    { id: 8, name: "Dizziness" },
    { id: 9, name: "Chest pain" },
    { id: 10, name: "Abdominal pain" },
    { id: 11, name: "Joint pain" },
    { id: 12, name: "Muscle aches" },
    { id: 13, name: "Rash" },
    { id: 14, name: "Vomiting" },
    { id: 15, name: "Diarrhea" },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setIsSearching(true)

    // Simulate API call
    setTimeout(() => {
      const results = mockSymptoms.filter((symptom) => symptom.name.toLowerCase().includes(searchTerm.toLowerCase()))
      setSearchResults(results)
      setIsSearching(false)
    }, 500)
  }

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
    if (e.target.value.length > 2) {
      handleSearch(e)
    } else {
      setSearchResults([])
    }
  }

  const addSymptom = (symptom) => {
    if (!selectedSymptoms.some((s) => s.id === symptom.id)) {
      setSelectedSymptoms([...selectedSymptoms, symptom])
    }
    setSearchTerm("")
    setSearchResults([])
  }

  const removeSymptom = (symptomId) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s.id !== symptomId))
  }

  const handleAdditionalInfoChange = (e) => {
    const { name, value } = e.target
    setAdditionalInfo({
      ...additionalInfo,
      [name]: value,
    })
  }

  const nextStep = () => {
    if (step === 1 && selectedSymptoms.length === 0) {
      alert("Please select at least one symptom")
      return
    }
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const submitAssessment = () => {
    setIsAssessing(true)

    // Simulate API call for assessment
    setTimeout(() => {
      // Mock assessment result
      const mockAssessment = {
        possibleConditions: [
          {
            name: "Common Cold",
            probability: "High",
            description: "A viral infection of the upper respiratory tract.",
            selfCare: [
              "Rest and stay hydrated",
              "Take over-the-counter pain relievers if needed",
              "Use a humidifier to ease congestion",
            ],
            urgency: "low",
          },
          {
            name: "Seasonal Allergies",
            probability: "Medium",
            description: "An allergic response to seasonal allergens like pollen.",
            selfCare: [
              "Avoid known allergens",
              "Consider over-the-counter antihistamines",
              "Use a saline nasal spray to clear sinuses",
            ],
            urgency: "low",
          },
        ],
        recommendation:
          "Your symptoms suggest non-urgent conditions. Self-care measures are recommended, but consult a healthcare provider if symptoms worsen or persist beyond 7 days.",
        urgencyLevel: "low",
        followUpRecommended: true,
      }

      setAssessment(mockAssessment)
      setIsAssessing(false)
      setStep(3)
    }, 2000)
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Select Your Symptoms</h2>
              <p className="mt-1 text-gray-600">Search and select all symptoms you're experiencing</p>
            </div>

            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
                <Search className="w-5 h-5 ml-3 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                  placeholder="Search symptoms..."
                  className="w-full py-2 pl-2 pr-4 text-gray-900 placeholder-gray-400 border-none rounded-md focus:outline-none focus:ring-0"
                />
                {isSearching && <Loader2 className="w-5 h-5 mr-3 animate-spin text-emerald-500" />}
              </div>

              {searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60">
                  <ul className="py-1">
                    {searchResults.map((symptom) => (
                      <li
                        key={symptom.id}
                        onClick={() => addSymptom(symptom)}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        {symptom.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>

            {selectedSymptoms.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-700">Selected Symptoms:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSymptoms.map((symptom) => (
                    <div
                      key={symptom.id}
                      className="flex items-center px-3 py-1 text-sm bg-emerald-100 rounded-full text-emerald-800"
                    >
                      {symptom.name}
                      <button
                        onClick={() => removeSymptom(symptom.id)}
                        className="ml-1.5 text-emerald-600 hover:text-emerald-800"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={nextStep}
                disabled={selectedSymptoms.length === 0}
                className="px-4 py-2 text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ChevronRight className="inline w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2>
              <p className="mt-1 text-gray-600">Please provide more details to help with the assessment</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={additionalInfo.age}
                  onChange={handleAdditionalInfoChange}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="Your age"
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={additionalInfo.gender}
                  onChange={handleAdditionalInfoChange}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Symptom Duration
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={additionalInfo.duration}
                  onChange={handleAdditionalInfoChange}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                >
                  <option value="">Select duration</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                </select>
              </div>

              <div>
                <label htmlFor="severity" className="block text-sm font-medium text-gray-700">
                  Symptom Severity
                </label>
                <select
                  id="severity"
                  name="severity"
                  value={additionalInfo.severity}
                  onChange={handleAdditionalInfoChange}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="existingConditions" className="block text-sm font-medium text-gray-700">
                Existing Medical Conditions (if any)
              </label>
              <textarea
                id="existingConditions"
                name="existingConditions"
                rows="2"
                value={additionalInfo.existingConditions}
                onChange={handleAdditionalInfoChange}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="E.g., diabetes, hypertension, asthma"
              ></textarea>
            </div>

            <div>
              <label htmlFor="medications" className="block text-sm font-medium text-gray-700">
                Current Medications (if any)
              </label>
              <textarea
                id="medications"
                name="medications"
                rows="2"
                value={additionalInfo.medications}
                onChange={handleAdditionalInfoChange}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="E.g., aspirin, insulin, antidepressants"
              ></textarea>
            </div>

            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-4 py-2 text-emerald-600 bg-white border border-emerald-600 rounded-md hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Back
              </button>
              <button
                onClick={submitAssessment}
                className="px-4 py-2 text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Get Assessment
              </button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Symptom Assessment</h2>
              <p className="mt-1 text-gray-600">Based on the information you provided</p>
            </div>

            {isAssessing ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 mb-4 animate-spin text-emerald-500" />
                <p className="text-gray-600">Analyzing your symptoms...</p>
              </div>
            ) : (
              <>
                <div
                  className={`p-4 rounded-md ${
                    assessment?.urgencyLevel === "high"
                      ? "bg-red-50 border border-red-200"
                      : assessment?.urgencyLevel === "medium"
                        ? "bg-yellow-50 border border-yellow-200"
                        : "bg-green-50 border border-green-200"
                  }`}
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {assessment?.urgencyLevel === "high" ? (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      ) : assessment?.urgencyLevel === "medium" ? (
                        <AlertCircle className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                    <div className="ml-3">
                      <h3
                        className={`text-sm font-medium ${
                          assessment?.urgencyLevel === "high"
                            ? "text-red-800"
                            : assessment?.urgencyLevel === "medium"
                              ? "text-yellow-800"
                              : "text-green-800"
                        }`}
                      >
                        {assessment?.urgencyLevel === "high"
                          ? "Urgent Care Recommended"
                          : assessment?.urgencyLevel === "medium"
                            ? "Medical Attention Advised"
                            : "Non-Urgent Condition"}
                      </h3>
                      <div
                        className={`mt-2 text-sm ${
                          assessment?.urgencyLevel === "high"
                            ? "text-red-700"
                            : assessment?.urgencyLevel === "medium"
                              ? "text-yellow-700"
                              : "text-green-700"
                        }`}
                      >
                        <p>{assessment?.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900">Possible Conditions</h3>
                  <div className="mt-3 space-y-4">
                    {assessment?.possibleConditions.map((condition, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-md">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-medium text-gray-900">{condition.name}</h4>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              condition.probability === "High"
                                ? "bg-emerald-100 text-emerald-800"
                                : condition.probability === "Medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {condition.probability} probability
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{condition.description}</p>

                        {condition.selfCare && condition.selfCare.length > 0 && (
                          <div className="mt-3">
                            <h5 className="text-sm font-medium text-gray-700">Self-care recommendations:</h5>
                            <ul className="pl-5 mt-1 text-sm text-gray-600 list-disc">
                              {condition.selfCare.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Important Disclaimer</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          This assessment is not a medical diagnosis. It is based on the information you provided and is
                          intended for informational purposes only. Always consult with a healthcare professional for
                          proper diagnosis and treatment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-emerald-600 bg-white border border-emerald-600 rounded-md hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    Start New Assessment
                  </button>
                  <button
                    onClick={() => (window.location.href = "/consultations")}
                    className="px-4 py-2 text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    Book Consultation
                  </button>
                </div>
              </>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Symptom Checker</h1>
        <p className="mt-1 text-gray-600">Get a preliminary assessment of your symptoms</p>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="mb-6">
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 ${step >= 1 ? "bg-emerald-600" : "bg-gray-200"} rounded-full`}
            >
              <span className="text-sm font-medium text-white">1</span>
            </div>
            <div className={`flex-1 h-0.5 mx-2 ${step >= 2 ? "bg-emerald-600" : "bg-gray-200"}`}></div>
            <div
              className={`flex items-center justify-center w-8 h-8 ${step >= 2 ? "bg-emerald-600" : "bg-gray-200"} rounded-full`}
            >
              <span className="text-sm font-medium text-white">2</span>
            </div>
            <div className={`flex-1 h-0.5 mx-2 ${step >= 3 ? "bg-emerald-600" : "bg-gray-200"}`}></div>
            <div
              className={`flex items-center justify-center w-8 h-8 ${step >= 3 ? "bg-emerald-600" : "bg-gray-200"} rounded-full`}
            >
              <span className="text-sm font-medium text-white">3</span>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Select Symptoms</span>
            <span>Additional Info</span>
            <span>Assessment</span>
          </div>
        </div>

        {renderStepContent()}
      </div>
    </div>
  )
}

export default SymptomChecker

