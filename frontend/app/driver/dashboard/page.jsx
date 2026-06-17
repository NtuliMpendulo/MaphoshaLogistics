'use client'

import { useState, useEffect } from 'react'
import { MapPin, TrendingUp, DollarSign, Clock, AlertCircle, CheckCircle, Navigation, Users, Star } from 'lucide-react'
import Link from 'next/link'

/**
 * Driver Dashboard - Beast Mode Edition
 * Real-time tracking, earnings, job management, and performance analytics
 */

export default function DriverDashboard() {
  const [activeJobs, setActiveJobs] = useState([
    {
      id: 1,
      customer: 'John Smith',
      pickup: '123 Main St, Johannesburg',
      dropoff: '456 Park Ave, Johannesburg',
      distance: '12.5 km',
      status: 'in-progress',
      earnings: 150,
      startTime: '09:30 AM',
      estimatedTime: '45 mins',
      rating: 4.8,
      priority: 'high'
    },
    {
      id: 2,
      customer: 'Sarah Johnson',
      pickup: '789 Oak Rd, Johannesburg',
      dropoff: '321 Elm St, Johannesburg',
      distance: '8.2 km',
      status: 'pending',
      earnings: 120,
      startTime: '10:15 AM',
      estimatedTime: '35 mins',
      rating: 4.9,
      priority: 'normal'
    }
  ])

  const [stats, setStats] = useState({
    todayEarnings: 450,
    totalTrips: 8,
    averageRating: 4.85,
    completionRate: 98,
    totalEarnings: 12500,
    activeJobs: 1,
    completedToday: 7
  })

  const [selectedJob, setSelectedJob] = useState(null)
  const [showMap, setShowMap] = useState(false)

  const updateJobStatus = (jobId, newStatus) => {
    setActiveJobs(activeJobs.map(job =>
      job.id === jobId ? { ...job, status: newStatus } : job
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's your performance today</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Today's Earnings</p>
                <p className="text-3xl font-bold text-green-600">R{stats.todayEarnings}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Today\'s Earnings', value: `R${stats.todayEarnings}`, icon: DollarSign, color: 'green' },
            { label: 'Active Jobs', value: stats.activeJobs, icon: Navigation, color: 'blue' },
            { label: 'Completed Today', value: stats.completedToday, icon: CheckCircle, color: 'emerald' },
            { label: 'Average Rating', value: `${stats.averageRating}⭐`, icon: Star, color: 'yellow' }
          ].map((stat, idx) => {
            const Icon = stat.icon
            const colorClasses = {
              green: 'bg-green-50 text-green-600',
              blue: 'bg-blue-50 text-blue-600',
              emerald: 'bg-emerald-50 text-emerald-600',
              yellow: 'bg-yellow-50 text-yellow-600'
            }
            return (
              <div key={idx} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Jobs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Active Jobs</h2>
                <p className="text-gray-600 mt-1">{activeJobs.filter(j => j.status !== 'completed').length} jobs pending</p>
              </div>

              <div className="divide-y divide-gray-200">
                {activeJobs.map(job => (
                  <div
                    key={job.id}
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">{job.customer}</h3>
                          {job.priority === 'high' && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                              High Priority
                            </span>
                          )}
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            job.status === 'in-progress'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {job.status === 'in-progress' ? 'In Progress' : 'Pending'}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>Pickup: {job.pickup}</span>
                          </div>
                          <div className="flex items-center gap-2 ml-6">
                            <span className="text-gray-400">↓</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>Dropoff: {job.dropoff}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">R{job.earnings}</p>
                        <p className="text-sm text-gray-600">{job.distance}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{job.estimatedTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{job.rating}</span>
                        </div>
                      </div>
                      {job.status === 'in-progress' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateJobStatus(job.id, 'completed')
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors"
                        >
                          Mark Complete
                        </button>
                      )}
                      {job.status === 'pending' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateJobStatus(job.id, 'in-progress')
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                        >
                          Start Job
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance & Quick Actions */}
          <div className="space-y-6">
            {/* Performance Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Completion Rate</span>
                    <span className="font-semibold text-gray-900">{stats.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${stats.completionRate}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Customer Rating</span>
                    <span className="font-semibold text-gray-900">{stats.averageRating}/5.0</span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(stats.averageRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/driver/tracking"
                  className="block w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors text-center"
                >
                  Live Tracking
                </Link>
                <Link
                  href="/driver/earnings"
                  className="block w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors text-center"
                >
                  View Earnings
                </Link>
                <Link
                  href="/driver/profile"
                  className="block w-full px-4 py-3 border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 font-semibold transition-colors text-center"
                >
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Notifications</h3>
              <div className="space-y-3">
                <div className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">New job available</p>
                    <p className="text-xs text-blue-700">Downtown delivery - R180</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-900">Bonus unlocked!</p>
                    <p className="text-xs text-green-700">Complete 5 more jobs today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
