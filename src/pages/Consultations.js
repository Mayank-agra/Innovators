"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Video, Phone, User, ChevronLeft, ChevronRight } from "lucide-react"

const Consultations = () => {
  const [consultations, setConsultations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [view, setView] = useState("upcoming") // 'upcoming' or 'book'
  const [specialties, setSpecialties] = useState([])
  const [doctors, setDoctors] = useState([])
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [consultationType, setConsultationType] = useState("video")
  const [bookingStep, setBookingStep] = useState(1)
  const [consultationReason, setConsultationReason] = useState("")
  const [isBooking, setIsBooking] = useState(false)

  // Mock data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setConsultations([
        {
          id: 1,
          doctorName: "Dr. Sarah Johnson",
          specialty: "General Practitioner",
          date: "2025-04-10T14:30:00",
          type: "video",
          status: "confirmed",
        },
        {
          id: 2,
          doctorName: "Dr. Michael Chen",
          specialty: "Cardiologist",
          date: "2025-04-15T10:00:00",
          type: "phone",
          status: "pending",
        },
      ])

      setSpecialties([
        "General Practitioner",
        "Cardiologist",
        "Dermatologist",
        "Neurologist",
        "Pediatrician",
        "Psychiatrist",
        "Gynecologist",
        "Orthopedist",
      ])

      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    if (selectedSpecialty) {
      // Simulate API call to get doctors by specialty
      setIsLoading(true)
      setTimeout(() => {
        const mockDoctors = [
          {
            id: 1,
            name: "Dr. Sarah Johnson",
            specialty: "General Practitioner",
            experience: "10 years",
            rating: 4.8,
            availableDays: ["Monday", "Wednesday", "Friday"],
          },
          {
            id: 2,
            name: "Dr. Robert Williams",
            specialty: "General Practitioner",
            experience: "15 years",
            rating: 4.9,
            availableDays: ["Tuesday", "Thursday", "Saturday"],
          },
          {
            id: 3,
            name: "Dr. Emily Davis",
            specialty: "General Practitioner",
            experience: "8 years",
            rating: 4.7,
            availableDays: ["Monday", "Tuesday", "Friday"],
          },
          {
            id: 4,
            name: "Dr. Michael Chen",
            specialty: "Cardiologist",
            experience: "12 years",
            rating: 4.9,
            availableDays: ["Wednesday", "Thursday", "Friday"],
          },
          {
            id: 5,
            name: "Dr. Jessica Martinez",
            specialty: "Cardiologist",
            experience: "9 years",
            rating: 4.6,
            availableDays: ["Monday", "Tuesday", "Saturday"],
          },
        ].filter((doctor) => doctor.specialty === selectedSpecialty)

        setDoctors(mockDoctors)
        setIsLoading(false)
      }, 500)
    } else {
      setDoctors([])
    }
  }, [selectedSpecialty])

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      // Simulate API call to get available slots
      setIsLoading(true)
      setTimeout(() => {
        // Generate random time slots
        const slots = []
        const startHour = 9
        const endHour = 17
        const date = new Date(selectedDate)

        for (let hour = startHour; hour < endHour; hour++) {
          // Add slots at :00 and :30
          if (Math.random() > 0.3) {
            // 70% chance of availability
            slots.push({
              id: `${hour}-00`,
              time: `${hour}:00`,
              datetime: new Date(date.setHours(hour, 0, 0)),
            })
          }

          if (Math.random() > 0.3) {
            // 70% chance of availability
            slots.push({
              id: `${hour}-30`,
              time: `${hour}:30`,
              datetime: new Date(date.setHours(hour, 30, 0)),
            })
          }
        }

        setAvailableSlots(slots)
        setIsLoading(false)
      }, 500)
    } else {
      setAvailableSlots([])
    }
  }, [selectedDoctor, selectedDate])

  const handleSpecialtyChange = (e) => {
    setSelectedSpecialty(e.target.value)
    setSelectedDoctor(null)
    setSelectedDate(null)
    setSelectedSlot(null)
    setBookingStep(1)
  }

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor)
    setSelectedDate(null)
    setSelectedSlot(null)
    setBookingStep(2)
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setSelectedSlot(null)
    setBookingStep(3)
  }

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot)
    setBookingStep(4)
  }

  const handleConsultationTypeChange = (type) => {
    setConsultationType(type)
  }

  const handleBookConsultation = () => {
    if (!selectedDoctor || !selectedSlot || !consultationType) {
      alert("Please complete all required fields")
      return
    }

    setIsBooking(true)

    // Simulate API call to book consultation
    setTimeout(() => {
      const newConsultation = {
        id: consultations.length + 1,
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        date: selectedSlot.datetime.toISOString(),
        type: consultationType,
        status: "confirmed",
        reason: consultationReason,
      }

      setConsultations([...consultations, newConsultation])
      setIsBooking(false)
      setView("upcoming")

      // Reset booking form
      setSelectedSpecialty("")
      setSelectedDoctor(null)
      setSelectedDate(null)
      setSelectedSlot(null)
      setConsultationType("video")
      setConsultationReason("")
      setBookingStep(1)
    }, 1000)
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

  // Generate calendar dates for the next 14 days
  const generateCalendarDates = () => {
    const dates = []
    const today = new Date()

    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date)
    }

    return dates
  }

  const calendarDates = generateCalendarDates()

  if (isLoading && !selectedSpecialty && !selectedDoctor && !selectedDate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Teleconsultations</h1>
        <p className="mt-1 text-gray-600">Connect with healthcare providers remotely</p>
      </div>

      <div className="flex mb-6 space-x-4">
        <button
          onClick={() => setView("upcoming")}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            view === "upcoming"
              ? "bg-emerald-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          My Consultations
        </button>
        <button
          onClick={() => setView("book")}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            view === "book"
              ? "bg-emerald-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          Book New Consultation
        </button>
      </div>

      {view === "upcoming" ? (
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">My Consultations</h2>

          {consultations.length > 0 ? (
            <div className="space-y-4">
              {consultations.map((consultation) => (
                <div key={consultation.id} className="p-4 border border-gray-200 rounded-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{consultation.doctorName}</h3>
                      <p className="text-sm text-gray-500">{consultation.specialty}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        consultation.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {consultation.status === "confirmed" ? "Confirmed" : "Pending"}
                    </span>
                  </div>

                  <div className="flex flex-wrap mt-3 text-sm text-gray-500">
                    <div className="flex items-center mr-4">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(consultation.date)}</span>
                    </div>
                    <div className="flex items-center mr-4">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{formatTime(consultation.date)}</span>
                    </div>
                    <div className="flex items-center">
                      {consultation.type === "video" ? (
                        <Video className="w-4 h-4 mr-1" />
                      ) : (
                        <Phone className="w-4 h-4 mr-1" />
                      )}
                      <span>{consultation.type === "video" ? "Video Call" : "Phone Call"}</span>
                    </div>
                  </div>

                  <div className="flex mt-4 space-x-3">
                    {consultation.status === "confirmed" && (
                      <button className="px-3 py-1 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                        Join Consultation
                      </button>
                    )}
                    <button className="px-3 py-1 text-sm font-medium text-emerald-600 bg-white border border-emerald-600 rounded-md hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                      Reschedule
                    </button>
                    <button className="px-3 py-1 text-sm font-medium text-red-600 bg-white border border-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="w-16 h-16 mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">No consultations scheduled</h3>
              <p className="mt-1 text-gray-500">Book a consultation with a healthcare provider</p>
              <button
                onClick={() => setView("book")}
                className="px-4 py-2 mt-4 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Book Consultation
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Book a Consultation</h2>

          <div className="mb-6">
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 ${bookingStep >= 1 ? "bg-emerald-600" : "bg-gray-200"} rounded-full`}
              >
                <span className="text-sm font-medium text-white">1</span>
              </div>
              <div className={`flex-1 h-0.5 mx-2 ${bookingStep >= 2 ? "bg-emerald-600" : "bg-gray-200"}`}></div>
              <div
                className={`flex items-center justify-center w-8 h-8 ${bookingStep >= 2 ? "bg-emerald-600" : "bg-gray-200"} rounded-full`}
              >
                <span className="text-sm font-medium text-white">2</span>
              </div>
              <div className={`flex-1 h-0.5 mx-2 ${bookingStep >= 3 ? "bg-emerald-600" : "bg-gray-200"}`}></div>
              <div
                className={`flex items-center justify-center w-8 h-8 ${bookingStep >= 3 ? "bg-emerald-600" : "bg-gray-200"} rounded-full`}
              >
                <span className="text-sm font-medium text-white">3</span>
              </div>
              <div className={`flex-1 h-0.5 mx-2 ${bookingStep >= 4 ? "bg-emerald-600" : "bg-gray-200"}`}></div>
              <div
                className={`flex items-center justify-center w-8 h-8 ${bookingStep >= 4 ? "bg-emerald-600" : "bg-gray-200"} rounded-full`}
              >
                <span className="text-sm font-medium text-white">4</span>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Specialty</span>
              <span>Doctor</span>
              <span>Date & Time</span>
              <span>Confirm</span>
            </div>
          </div>

          {bookingStep === 1 && (
            <div>
              <div className="mb-4">
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                  Select Specialty
                </label>
                <select
                  id="specialty"
                  value={selectedSpecialty}
                  onChange={handleSpecialtyChange}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                >
                  <option value="">Select a specialty</option>
                  {specialties.map((specialty, index) => (
                    <option key={index} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => selectedSpecialty && setBookingStep(2)}
                  disabled={!selectedSpecialty}
                  className="px-4 py-2 text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue <ChevronRight className="inline w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}

          {bookingStep === 2 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-900">Select Doctor</h3>
                <button
                  onClick={() => setBookingStep(1)}
                  className="flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      onClick={() => handleDoctorSelect(doctor)}
                      className={`p-4 border rounded-md cursor-pointer transition-colors ${
                        selectedDoctor?.id === doctor.id
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full">
                          <User className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-base font-medium text-gray-900">{doctor.name}</h4>
                          <p className="text-sm text-gray-500">{doctor.specialty}</p>
                          <div className="flex mt-1 text-sm text-gray-500">
                            <span className="mr-3">Experience: {doctor.experience}</span>
                            <span>Rating: {doctor.rating}/5</span>
                          </div>
                          <div className="mt-1 text-sm text-gray-500">Available: {doctor.availableDays.join(", ")}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {bookingStep === 3 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-900">Select Date & Time</h3>
                <button
                  onClick={() => setBookingStep(2)}
                  className="flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </button>
              </div>

              <div className="mb-6">
                <h4 className="mb-2 text-sm font-medium text-gray-700">Select Date</h4>
                <div className="flex overflow-x-auto pb-2 space-x-2">
                  {calendarDates.map((date, index) => (
                    <div
                      key={index}
                      onClick={() => handleDateSelect(date.toISOString().split("T")[0])}
                      className={`flex flex-col items-center p-2 min-w-[60px] border rounded-md cursor-pointer ${
                        selectedDate === date.toISOString().split("T")[0]
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                      }`}
                    >
                      <span className="text-xs font-medium text-gray-500">
                        {date.toLocaleDateString("en-US", { weekday: "short" })}
                      </span>
                      <span className="mt-1 text-base font-medium text-gray-900">{date.getDate()}</span>
                      <span className="text-xs text-gray-500">
                        {date.toLocaleDateString("en-US", { month: "short" })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedDate && (
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-700">Select Time</h4>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="w-8 h-8 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                      {availableSlots.map((slot) => (
                        <div
                          key={slot.id}
                          onClick={() => handleSlotSelect(slot)}
                          className={`flex items-center justify-center p-2 border rounded-md cursor-pointer ${
                            selectedSlot?.id === slot.id
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                              : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                          }`}
                        >
                          <span className="text-sm font-medium">{slot.time}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 border border-gray-200 rounded-md">
                      No available slots for this date. Please select another date.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {bookingStep === 4 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-900">Confirm Consultation</h3>
                <button
                  onClick={() => setBookingStep(3)}
                  className="flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </button>
              </div>

              <div className="p-4 mb-4 border border-gray-200 rounded-md">
                <h4 className="text-base font-medium text-gray-900">Consultation Details</h4>

                <div className="mt-3 space-y-2">
                  <div className="flex">
                    <span className="w-32 text-sm font-medium text-gray-500">Doctor:</span>
                    <span className="text-sm text-gray-900">{selectedDoctor?.name}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-sm font-medium text-gray-500">Specialty:</span>
                    <span className="text-sm text-gray-900">{selectedDoctor?.specialty}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-sm font-medium text-gray-500">Date:</span>
                    <span className="text-sm text-gray-900">
                      {selectedDate &&
                        new Date(selectedDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-sm font-medium text-gray-500">Time:</span>
                    <span className="text-sm text-gray-900">{selectedSlot?.time}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Consultation Type</label>
                <div className="flex mt-2 space-x-4">
                  <div
                    onClick={() => handleConsultationTypeChange("video")}
                    className={`flex items-center p-3 border rounded-md cursor-pointer ${
                      consultationType === "video"
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                    }`}
                  >
                    <Video
                      className={`w-5 h-5 ${consultationType === "video" ? "text-emerald-600" : "text-gray-400"}`}
                    />
                    <span
                      className={`ml-2 text-sm font-medium ${consultationType === "video" ? "text-emerald-700" : "text-gray-700"}`}
                    >
                      Video Call
                    </span>
                  </div>
                  <div
                    onClick={() => handleConsultationTypeChange("phone")}
                    className={`flex items-center p-3 border rounded-md cursor-pointer ${
                      consultationType === "phone"
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                    }`}
                  >
                    <Phone
                      className={`w-5 h-5 ${consultationType === "phone" ? "text-emerald-600" : "text-gray-400"}`}
                    />
                    <span
                      className={`ml-2 text-sm font-medium ${consultationType === "phone" ? "text-emerald-700" : "text-gray-700"}`}
                    >
                      Phone Call
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                  Reason for Consultation
                </label>
                <textarea
                  id="reason"
                  rows="3"
                  value={consultationReason}
                  onChange={(e) => setConsultationReason(e.target.value)}
                  placeholder="Briefly describe your symptoms or reason for the consultation"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleBookConsultation}
                  disabled={isBooking}
                  className="flex items-center px-4 py-2 text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isBooking ? (
                    <>
                      <svg
                        className="w-5 h-5 mr-2 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Booking...
                    </>
                  ) : (
                    "Book Consultation"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Consultations

