"use client"

import { useState, useEffect } from "react"
import { MapPin, Phone, Globe, Clock, Search, Filter, ChevronDown } from "lucide-react"

const ResourceDirectory = () => {
  const [resources, setResources] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    type: "all",
    distance: "all",
  })
  const [showFilters, setShowFilters] = useState(false)

  // Mock data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockResources = [
        {
          id: 1,
          name: "Community Health Center",
          type: "clinic",
          address: "123 Main St, Anytown, USA",
          phone: "(555) 123-4567",
          website: "https://communityhealthcenter.org",
          hours: "Mon-Fri: 8am-5pm, Sat: 9am-1pm",
          distance: 1.2,
          services: ["Primary Care", "Pediatrics", "Women's Health", "Mental Health"],
        },
        {
          id: 2,
          name: "County General Hospital",
          type: "hospital",
          address: "456 Hospital Ave, Anytown, USA",
          phone: "(555) 987-6543",
          website: "https://countygeneralhospital.org",
          hours: "24/7",
          distance: 3.5,
          services: ["Emergency Care", "Surgery", "Radiology", "Laboratory"],
        },
        {
          id: 3,
          name: "Neighborhood Pharmacy",
          type: "pharmacy",
          address: "789 Health St, Anytown, USA",
          phone: "(555) 456-7890",
          website: "https://neighborhoodpharmacy.com",
          hours: "Mon-Fri: 9am-9pm, Sat-Sun: 10am-6pm",
          distance: 0.8,
          services: ["Prescription Filling", "Immunizations", "Health Consultations"],
        },
        {
          id: 4,
          name: "Mental Health Services",
          type: "mental_health",
          address: "321 Wellness Blvd, Anytown, USA",
          phone: "(555) 789-0123",
          website: "https://mentalhealthservices.org",
          hours: "Mon-Fri: 8am-8pm",
          distance: 2.3,
          services: ["Counseling", "Therapy", "Crisis Intervention"],
        },
        {
          id: 5,
          name: "Women's Health Center",
          type: "clinic",
          address: "567 Care Lane, Anytown, USA",
          phone: "(555) 234-5678",
          website: "https://womenshealthcenter.org",
          hours: "Mon-Fri: 8:30am-5:30pm",
          distance: 4.1,
          services: ["OB/GYN", "Mammography", "Family Planning", "Prenatal Care"],
        },
        {
          id: 6,
          name: "Urgent Care Clinic",
          type: "urgent_care",
          address: "890 Quick St, Anytown, USA",
          phone: "(555) 345-6789",
          website: "https://urgentcareclinic.com",
          hours: "Daily: 8am-10pm",
          distance: 1.9,
          services: ["Walk-in Care", "X-rays", "Lab Tests", "Minor Procedures"],
        },
      ]

      setResources(mockResources)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  const filteredResources = resources.filter((resource) => {
    // Search term filter
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.services.some((service) => service.toLowerCase().includes(searchTerm.toLowerCase()))

    // Type filter
    const matchesType = filters.type === "all" || resource.type === filters.type

    // Distance filter
    let matchesDistance = true
    if (filters.distance !== "all") {
      const maxDistance = Number.parseInt(filters.distance)
      matchesDistance = resource.distance <= maxDistance
    }

    return matchesSearch && matchesType && matchesDistance
  })

  const getResourceTypeIcon = (type) => {
    switch (type) {
      case "hospital":
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
            <MapPin className="w-5 h-5 text-red-600" />
          </div>
        )
      case "clinic":
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-full">
            <MapPin className="w-5 h-5 text-emerald-600" />
          </div>
        )
      case "pharmacy":
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
        )
      case "mental_health":
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
            <MapPin className="w-5 h-5 text-purple-600" />
          </div>
        )
      case "urgent_care":
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full">
            <MapPin className="w-5 h-5 text-orange-600" />
          </div>
        )
      default:
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
            <MapPin className="w-5 h-5 text-gray-600" />
          </div>
        )
    }
  }

  const getResourceTypeName = (type) => {
    switch (type) {
      case "hospital":
        return "Hospital"
      case "clinic":
        return "Clinic"
      case "pharmacy":
        return "Pharmacy"
      case "mental_health":
        return "Mental Health"
      case "urgent_care":
        return "Urgent Care"
      default:
        return type
    }
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
        <h1 className="text-2xl font-bold text-gray-900">Health Resource Directory</h1>
        <p className="mt-1 text-gray-600">Find healthcare resources in your area</p>
      </div>

      <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or service..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <Filter className="w-5 h-5 mr-2 text-gray-400" />
            Filters
            <ChevronDown
              className={`w-5 h-5 ml-2 text-gray-400 transition-transform ${showFilters ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Resource Type
              </label>
              <select
                id="type"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              >
                <option value="all">All Types</option>
                <option value="hospital">Hospital</option>
                <option value="clinic">Clinic</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="mental_health">Mental Health</option>
                <option value="urgent_care">Urgent Care</option>
              </select>
            </div>

            <div>
              <label htmlFor="distance" className="block text-sm font-medium text-gray-700">
                Distance
              </label>
              <select
                id="distance"
                name="distance"
                value={filters.distance}
                onChange={handleFilterChange}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              >
                <option value="all">Any Distance</option>
                <option value="1">Within 1 mile</option>
                <option value="2">Within 2 miles</option>
                <option value="5">Within 5 miles</option>
                <option value="10">Within 10 miles</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {filteredResources.length > 0 ? (
        <div className="space-y-4">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex">
                {getResourceTypeIcon(resource.type)}
                <div className="ml-4">
                  <h2 className="text-lg font-medium text-gray-900">{resource.name}</h2>
                  <p className="text-sm text-emerald-600">{getResourceTypeName(resource.type)}</p>
                </div>
                <div className="flex items-start ml-auto">
                  <span className="px-2 py-1 text-xs font-medium text-emerald-800 bg-emerald-100 rounded-full">
                    {resource.distance} miles away
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-500">
                <div className="flex">
                  <MapPin className="flex-shrink-0 w-5 h-5 mr-2 text-gray-400" />
                  <span>{resource.address}</span>
                </div>
                <div className="flex">
                  <Phone className="flex-shrink-0 w-5 h-5 mr-2 text-gray-400" />
                  <span>{resource.phone}</span>
                </div>
                {resource.website && (
                  <div className="flex">
                    <Globe className="flex-shrink-0 w-5 h-5 mr-2 text-gray-400" />
                    <a
                      href={resource.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      {resource.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
                <div className="flex">
                  <Clock className="flex-shrink-0 w-5 h-5 mr-2 text-gray-400" />
                  <span>{resource.hours}</span>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700">Services</h3>
                <div className="flex flex-wrap mt-2 gap-2">
                  {resource.services.map((service, index) => (
                    <span key={index} className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex mt-4 space-x-3">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(resource.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-1 text-sm font-medium text-emerald-600 bg-white border border-emerald-600 rounded-md hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  Directions
                </a>
                <a
                  href={`tel:${resource.phone.replace(/[^0-9]/g, "")}`}
                  className="flex items-center px-3 py-1 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm">
          <MapPin className="w-16 h-16 mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">No resources found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}

export default ResourceDirectory

