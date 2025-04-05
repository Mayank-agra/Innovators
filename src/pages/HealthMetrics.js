"use client"

import { useState, useEffect } from "react"
import { Activity, Plus, Heart, Droplet, Weight, Trash } from "lucide-react"

const HealthMetrics = () => {
  const [metrics, setMetrics] = useState({
    bloodPressure: [],
    bloodGlucose: [],
    weight: [],
    heartRate: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [metricType, setMetricType] = useState('bloodPressure');
  const [formData, setFormData] = useState({
    bloodPressure: { systolic: '', diastolic: '', date: '', time: '' },
    bloodGlucose: { value: '', unit: 'mg/dL', date: '', time: '', mealStatus: 'fasting' },
    weight: { value: '', unit: 'kg', date: '', time: '' },
    heartRate: { value: '', date: '', time: '', activityLevel: 'resting' }
  });

  // Mock data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const today = new Date();
      const mockMetrics = {
        bloodPressure: Array(10).fill(0).map((_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - i * 3);
          return {
            id: i + 1,
            systolic: Math.floor(Math.random() * 30) + 110, // 110-140
            diastolic: Math.floor(Math.random() * 20) + 70, // 70-90
            date: date.toISOString().split('T')[0],
            time: '08:00',
            createdAt: date.toISOString()
          };
        }),
        bloodGlucose: Array(10).fill(0).map((_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - i * 3);
          return {
            id: i + 1,
            value: Math.floor(Math.random() * 50) + 80, // 80-130
            unit: 'mg/dL',
            date: date.toISOString().split('T')[0],
            time: '08:00',
            mealStatus: i % 2 === 0 ? 'fasting' : 'after_meal',
            createdAt: date.toISOString()
          };
        }),
        weight: Array(10).fill(0).map((_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - i * 7); // Weekly
          return {
            id: i + 1,
            value: 70 + (Math.random() * 2 - 1), // 69-71
            unit: 'kg',
            date: date.toISOString().split('T')[0],
            time: '08:00',
            createdAt: date.toISOString()
          };
        }),
        heartRate: Array(10).fill(0).map((_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - i * 2);
          return {
            id: i + 1,
            value: Math.floor(Math.random() * 20) + 60, // 60-80
            date: date.toISOString().split('T')[0],
            time: '08:00',
            activityLevel: i % 3 === 0 ? 'resting' : i % 3 === 1 ? 'light_activity' : 'after_exercise',
            createdAt: date.toISOString()
          };
        })
      };
      
      setMetrics(mockMetrics);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [metricType]: {
        ...formData[metricType],
        [name]: value
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newMetric = {
      ...formData[metricType],
      id: metrics[metricType].length + 1,
      createdAt: new Date().toISOString()
    };
    
    setMetrics({
      ...metrics,
      [metricType]: [newMetric, ...metrics[metricType]]
    });
    
    // Reset form
    resetForm();
  };

  const handleDelete = (type, id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setMetrics({
        ...metrics,
        [type]: metrics[type].filter(metric => metric.id !== id)
      });
    }
  };

  const resetForm = () => {
    setFormData({
      bloodPressure: { systolic: '', diastolic: '', date: '', time: '' },
      bloodGlucose: { value: '', unit: 'mg/dL', date: '', time: '', mealStatus: 'fasting' },
      weight: { value: '', unit: 'kg', date: '', time: '' },
      heartRate: { value: '', date: '', time: '', activityLevel: 'resting' }
    });
    setShowAddForm(false);
  };

  const getMealStatusText = (status) => {
    switch (status) {
      case 'fasting':
        return 'Fasting';
      case 'before_meal':
        return 'Before meal';
      case 'after_meal':
        return 'After meal';
      default:
        return status;
    }
  };

  const getActivityLevelText = (level) => {
    switch (level) {
      case 'resting':
        return 'Resting';
      case 'light_activity':
        return 'Light activity';
      case 'after_exercise':
        return 'After exercise';
      default:
        return level;
    }
  };

  const getBloodPressureStatus = (systolic, diastolic) => {
    if (systolic < 120 && diastolic < 80) {
      return { status: 'Normal', color: 'text-green-600' };
    } else if ((systolic >= 120 && systolic <= 129) && diastolic < 80) {
      return { status: 'Elevated', color: 'text-yellow-600' };
    } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
      return { status: 'Stage 1 Hypertension', color: 'text-orange-600' };
    } else if (systolic >= 140 || diastolic >= 90) {
      return { status: 'Stage 2 Hypertension', color: 'text-red-600' };
    } else {
      return { status: 'Unknown', color: 'text-gray-600' };
    }
  };

  const getBloodGlucoseStatus = (value, mealStatus) => {
    if (mealStatus === 'fasting') {
      if (value < 70) {
        return { status: 'Low', color: 'text-orange-600' };
      } else if (value >= 70 && value <= 99) {
        return { status: 'Normal', color: 'text-green-600' };
      } else if (value >= 100 && value <= 125) {
        return { status: 'Prediabetes', color: 'text-yellow-600' };
      } else {
        return { status: 'Diabetes', color: 'text-red-600' };
      }
    } else {
      if (value < 70) {
        return { status: 'Low', color: 'text-orange-600' };
      } else if (value < 140) {
        return { status: 'Normal', color: 'text-green-600' };
      } else if (value >= 140 && value <= 199) {
        return { status: 'Elevated', color: 'text-yellow-600' };
      } else {
        return { status: 'High', color: 'text-red-600' };
      }
    }
  };

  const getHeartRateStatus = (value, activityLevel) => {
    if (activityLevel === 'resting') {
      if (value < 60) {
        return { status: 'Low', color: 'text-yellow-600' };
      } else if (value >= 60 && value <= 100) {
        return { status: 'Normal', color: 'text-green-600' };
      } else {
        return { status: 'Elevated', color: 'text-orange-600' };
      }
    } else {
      return { status: 'Activity', color: 'text-blue-600' };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Health Metrics</h1>
        <p className="mt-1 text-gray-600">Track and monitor your health indicators</p>
      </div>
      
      <div className="mb-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center px-4 py-2 text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          {showAddForm ? (
            <>Cancel</>
          ) : (
            <>
              <Plus className="w-5 h-5 mr-2" />
              Add New Measurement
            </>
          )}
        </button>
      </div>
      
      {showAddForm && (
        <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Add New Measurement</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Metric Type</label>
            <div className="grid grid-cols-2 gap-2 mt-1 sm:grid-cols-4">
              <button
                type="button"
                onClick={() => setMetricType('bloodPressure')}
                className={`flex items-center justify-center p-3 border rounded-md ${
                  metricType === 'bloodPressure'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                }`}
              >
                <Heart className="w-5 h-5 mr-2" />
                Blood Pressure
              </button>
              <button
                type="button"
                onClick={() => setMetricType('bloodGlucose')}
                className={`flex items-center justify-center p-3 border rounded-md ${
                  metricType === 'bloodGlucose'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                }`}
              >
                <Droplet className="w-5 h-5 mr-2" />
                Blood Glucose
              </button>
              <button
                type="button"
                onClick={() => setMetricType('weight')}
                className={`flex items-center justify-center p-3 border rounded-md ${
                  metricType === 'weight'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                }`}
              >
                <Weight className="w-5 h-5 mr-2" />
                Weight
              </button>
              <button
                type="button"
                onClick={() => setMetricType('heartRate')}
                className={`flex items-center justify-center p-3 border rounded-md ${
                  metricType === 'heartRate'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                }`}
              >
                <Activity className="w-5 h-5 mr-2" />
                Heart Rate
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {metricType === 'bloodPressure' && (
                <>
                  <div>
                    <label htmlFor="systolic" className="block text-sm font-medium text-gray-700">
                      Systolic (mmHg)
                    </label>
                    <input
                      type="number"
                      id="systolic"
                      name="systolic"
                      required
                      min="70"
                      max="200"
                      value={formData.bloodPressure.systolic}
                      onChange={handleInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="diastolic" className="block text-sm font-medium text-gray-700">
                      Diastolic (mmHg)
                    </label>
                    <input
                      type="number"
                      id="diastolic"
                      name="diastolic"
                      required
                      min="40"
                      max="120"
                      value={formData.bloodPressure.diastolic}
                      onChange={handleInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    />
                  </div>
                </>
              )}
              
              {metricType === 'bloodGlucose' && (
                <>
                  <div>
                    <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                      Blood Glucose
                    </label>
                    <div className="flex mt-1">
                      <input
                        type="number"
                        id="value"
                        name="value"
                        required
                        min="20"
                        max="500"
                        value={formData.bloodGlucose.value}
                        onChange={handleInputChange}
                        className="block w-full border-gray-300 rounded-l-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      />
                      <select
                        name="unit"
                        value={formData.bloodGlucose.unit}
                        onChange={handleInputChange}
                        className="block border-l-0 border-gray-300 rounded-r-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      >
                        <option value="mg/dL">mg/dL</option>
                        <option value="mmol/L">mmol/L</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="mealStatus" className="block text-sm font-medium text-gray-700">
                      Meal Status
                    </label>
                    <select
                      id="mealStatus"
                      name="mealStatus"
                      required
                      value={formData.bloodGlucose.mealStatus}
                      onChange={handleInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    >
                      <option value="fasting">Fasting</option>
                      <option value="before_meal">Before meal</option>
                      <option value="after_meal">After meal</option>
                    </select>
                  </div>
                </>
              )}
              
              {metricType === 'weight' && (
                <div>
                  <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                    Weight
                  </label>
                  <div className="flex mt-1">
                    <input
                      type="number"
                      id="value"
                      name="value"
                      required
                      min="20"
                      max="300"
                      step="0.1"
                      value={formData.weight.value}
                      onChange={handleInputChange}
                      className="block w-full border-gray-300 rounded-l-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    />
                    <select
                      name="unit"
                      value={formData.weight.unit}
                      onChange={handleInputChange}
                      className="block border-l-0 border-gray-300 rounded-r-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    >
                      <option value="kg">kg</option>
                      <option value="lb">lb</option>
                    </select>
                  </div>
                </div>
              )}
              
              {metricType === 'heartRate' && (
                <>
                  <div>
                    <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                      Heart Rate (bpm)
                    </label>
                    <input
                      type="number"
                      id="value"
                      name="value"
                      required
                      min="30"
                      max="220"
                      value={formData.heartRate.value}
                      onChange={handleInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700">
                      Activity Level
                    </label>
                    <select
                      id="activityLevel"
                      name="activityLevel"
                      required
                      value={formData.heartRate.activityLevel}
                      onChange={handleInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    >
                      <option value="resting">Resting</option>
                      <option value="light_activity">Light activity</option>
                      <option value="after_exercise">After exercise</option>
                    </select>
                  </div>
                </>
              )}
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  value={formData[metricType].date}
                  onChange={handleInputChange}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  required
                  value={formData[metricType].time}
                  onChange={handleInputChange}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                />
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
                Save Measurement
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Blood Pressure */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Blood Pressure</h2>
            <button
              onClick={() => {
                setMetricType('bloodPressure');
                setShowAddForm(true);
              }}
              className="flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </button>
          </div>
          
          {metrics.bloodPressure.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-md">
                <div>
                  <div className="text-sm font-medium text-gray-500">Latest Reading</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {metrics.bloodPressure[0].systolic}/{metrics.bloodPressure[0].diastolic}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(metrics.bloodPressure[0].date).toLocaleDateString()} at {metrics.bloodPressure[0].time}
                  </div>
                </div>
                <div className={`text-sm font-medium ${getBloodPressureStatus(metrics.bloodPressure[0].systolic, metrics.bloodPressure[0].diastolic).color}`}>
                  {getBloodPressureStatus(metrics.bloodPressure[0].systolic, metrics.bloodPressure[0].diastolic).status}
                </div>
              </div>
              
              <div className="overflow-hidden border border-gray-200 rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                      <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Reading</th>
                      <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                      <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {metrics.bloodPressure.slice(0, 5).map((reading) => (
                      <tr key={reading.id}>
                        <td className="px-4 py-2 text-sm text-gray-500 whitespace-nowrap">
                          {new Date(reading.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900 whitespace-nowrap">
                          {reading.systolic}/{reading.diastolic} mmHg
                        </td>
                        <td className="px-4 py-2 text-sm whitespace-nowrap">
                          <span className={`${getBloodPressureStatus(reading.systolic, reading.diastolic).color}`}>
                            {getBloodPressureStatus(reading.systolic, reading.diastolic).status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleDelete('bloodPressure', reading.id)}
                            className="p-1 text-gray-400 rounded-md hover:bg-gray-100 hover:text-red-500"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Heart className="w-12 h-12 mb-2 text-gray-400" />
              <p className="text-gray-500">No blood pressure readings</p>
              <button
                onClick={() => {
                  setMetricType('bloodPressure');
                  setShowAddForm(true);
                }}
                className="mt-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                Add your first reading
              </button>
            </div>
          )}
        </div>
        
        {/* Blood Glucose */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Blood Glucose</h2>
            <button
              onClick={() => {
                setMetricType('bloodGlucose');
                setShowAddForm(true);
              }}
              className="flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </button>
          </div>
          
          {/* {metrics.bloodGlucose.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-md">
                <div>
                  <div className="text-sm font-medium text-gray-500">Latest Reading</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {metrics.bloodGlucose[0].value} {metrics.bloodGlucose[0].unit}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getMealStatusText(metrics.bloodGlucose[0].mealStatus)} • {new Date(metrics.bloodGlucose[0].date).toLocaleDateString()}
                  </div>
                </div>
                <div className={`text-sm font-medium ${getBloodGlucoseStatus(metrics.bloodGlucose[0].value, metrics.bloodGlucose[0].mealStatus).color}`}>
                  {getBloodGlucoseStatus(metrics.bloodGlucose[0].value, metrics.bloodGlucose[0].mealStatus).status}
                </div>
              </div>
              
              <div className="overflow-hidden border border-gray-200 rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                      <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Reading</th>
                      <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"> */}
          {metrics.bloodGlucose.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-md">
              <div>
                <div className="text-sm font-medium text-gray-500">Latest Reading</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {metrics.bloodGlucose[0].value} {metrics.bloodGlucose[0].unit}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {metrics.bloodGlucose[0].mealStatus.replace('_', ' ')} — {new Date(metrics.bloodGlucose[0].date).toLocaleDateString()} at {metrics.bloodGlucose[0].time}
                </div>
              </div>
            </div>

            <div className="overflow-hidden border border-gray-200 rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Reading</th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Meal Status</th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {metrics.bloodGlucose.map((entry, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {new Date(entry.date).toLocaleDateString()} at {entry.time}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {entry.value} {entry.unit}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 capitalize">
                        {entry.mealStatus.replace('_', ' ')}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <button
                          onClick={() => handleDelete('bloodGlucose', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No blood glucose data available.</p>
        )}
      </div>
    </div>

  </div>

  
)};

export default HealthMetrics;
