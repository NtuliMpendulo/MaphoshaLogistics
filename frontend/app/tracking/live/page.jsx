'use client'

import { useState, useEffect } from 'react'
import { MapPin, Navigation, Phone, MessageCircle, AlertCircle, CheckCircle, Clock, DollarSign } from 'lucide-react'

/**
 * Live Tracking Page - Beast Mode Edition
 * Real-time vehicle tracking with interactive map and detailed information
 */

export default function LiveTracking() {
  const [activeTracking, setActiveTracking] = useState({
    id: 'TRK-001',
    driver: 'Thabo Mthembu',
    vehicle: 'Toyota Hiace - JNB 234 GP',
    status: 'in-transit',
    currentLocation: { lat: -26.2023, lng: 28.0436 },
    destination: 'Sandton City',
    pickupAddress: '123 Main Street, Johannesburg',
    dropoffAddress: '789 Rivonia Road, Sandton',
    distance: '12.5 km',
    estimatedTime: '28 mins',
    speed: '65 km/h',
    temperature: '24°C',
    passengers: 3,
    rating: 4.9,
    driverPhone: '+27 (0) 11 234 5678',
    lastUpdate: 'Just now',
    progress: 65
  })

  const [mapView, setMapView] = useState('satellite')
  const [showDetails, setShowDetails] = useState(true)
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', message: 'Driver is 2 minutes away', time: '2 mins ago' },
    { id: 2, type: 'success', message: 'Driver picked up package', time: '5 mins ago' },
    { id: 3, type: 'info', message: 'Driver started journey', time: '8 mins ago' }
  ])

  const statusColors = {
    'pending': 'bg-yellow-100 text-yellow-700',
    'in-transit': 'bg-blue-100 text-blue-700',
    'completed': 'bg-green-100 text-green-700',
    'cancelled': 'bg-red-100 text-red-700'
  }

  const statusLabels = {
    'pending': 'Pending',
    'in-transit': 'In Transit',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Live Tracking</h1>
              <p className="text-sm text-gray-600 mt-1">Booking ID: {activeTracking.id}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[activeTracking.status]}`}>
                {statusLabels[activeTracking.status]}
              </span>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            {/* Map Container */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
              <div className="relative w-full h-96 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                {/* Placeholder Map */}
                <div className="text-center text-white">
                  <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-semibold">Interactive Map View</p>
                  <p className="text-sm opacity-75">Real-time GPS tracking</p>
                  <div className="mt-4 text-2xl font-bold">{activeTracking.speed}</div>
                </div>

                {/* Map Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <Navigation className="w-5 h-5 text-gray-700" />
                  </button>
                  <button className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <span className="text-gray-700 font-bold">+</span>
                  </button>
                  <button className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <span className="text-gray-700 font-bold">−</span>
                  </button>
                </div>

                {/* Current Location Indicator */}
                <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-md">
                  <p className="text-xs text-gray-600 mb-1">Current Location</p>
                  <p className="text-sm font-semibold text-gray-900">{activeTracking.currentLocation.lat}, {activeTracking.currentLocation.lng}</p>
                </div>
              </div>

              {/* Map View Toggle */}
              <div className="p-4 border-t border-gray-200 flex gap-2">
                <button
                  onClick={() => setMapView('satellite')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    mapView === 'satellite'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Satellite
                </button>
                <button
                  onClick={() => setMapView('terrain')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    mapView === 'terrain'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Terrain
                </button>
                <button
                  onClick={() => setMapView('traffic')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    mapView === 'traffic'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Traffic
                </button>
              </div>
            </div>

            {/* Journey Details */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Journey Details</h2>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Journey Progress</span>
                  <span className="text-sm font-bold text-gray-900">{activeTracking.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-blue-400 h-3 rounded-full transition-all"
                    style={{ width: `${activeTracking.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Route Information */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                    <div className="w-0.5 h-16 bg-gray-300 my-2"></div>
                    <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                  </div>
                  <div className="flex-1 space-y-8">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Pickup Location</p>
                      <p className="font-semibold text-gray-900">{activeTracking.pickupAddress}</p>
                      <p className="text-sm text-gray-600 mt-1">Picked up at 09:32 AM</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Dropoff Location</p>
                      <p className="font-semibold text-gray-900">{activeTracking.dropoffAddress}</p>
                      <p className="text-sm text-gray-600 mt-1">Estimated arrival: 10:00 AM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Driver Information */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Driver Information</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  TM
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{activeTracking.driver}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(activeTracking.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                        ⭐
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activeTracking.rating} rating</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Vehicle</span>
                  <span className="font-semibold text-gray-900">{activeTracking.vehicle}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Speed</span>
                  <span className="font-semibold text-gray-900">{activeTracking.speed}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Temperature</span>
                  <span className="font-semibold text-gray-900">{activeTracking.temperature}</span>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  Call Driver
                </button>
                <button className="w-full px-4 py-2 border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 font-semibold transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Send Message
                </button>
              </div>
            </div>

            {/* Trip Summary */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Trip Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Distance</span>
                  <span className="font-semibold text-gray-900">{activeTracking.distance}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Est. Time</span>
                  <span className="font-semibold text-gray-900">{activeTracking.estimatedTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Passengers</span>
                  <span className="font-semibold text-gray-900">{activeTracking.passengers}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-gray-600 font-medium">Fare</span>
                  <span className="text-2xl font-bold text-green-600">R185</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Activity Log</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.map(notif => (
                  <div key={notif.id} className={`p-3 rounded-lg ${
                    notif.type === 'success' ? 'bg-green-50' :
                    notif.type === 'info' ? 'bg-blue-50' :
                    'bg-yellow-50'
                  }`}>
                    <div className="flex gap-2">
                      {notif.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />}
                      {notif.type === 'info' && <Clock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{notif.message}</p>
                        <p className="text-xs text-gray-600 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
