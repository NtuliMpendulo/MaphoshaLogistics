'use client'

import { useState } from 'react'
import { TrendingUp, Users, Truck, DollarSign, MapPin, Calendar, Download, Filter } from 'lucide-react'
import Link from 'next/link'

/**
 * Admin Analytics Dashboard - Beast Mode Edition
 * KPIs, reporting, and business intelligence
 */

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('week')
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  const kpis = [
    {
      label: 'Total Revenue',
      value: 'R45,230',
      change: '+12.5%',
      icon: DollarSign,
      color: 'green',
      trend: 'up'
    },
    {
      label: 'Active Drivers',
      value: '234',
      change: '+8.2%',
      icon: Users,
      color: 'blue',
      trend: 'up'
    },
    {
      label: 'Completed Trips',
      value: '1,847',
      change: '+23.1%',
      icon: Truck,
      color: 'purple',
      trend: 'up'
    },
    {
      label: 'Avg Rating',
      value: '4.82',
      change: '+0.3%',
      icon: MapPin,
      color: 'orange',
      trend: 'up'
    }
  ]

  const revenueData = [
    { day: 'Mon', revenue: 6200, trips: 145 },
    { day: 'Tue', revenue: 7100, trips: 168 },
    { day: 'Wed', revenue: 5900, trips: 142 },
    { day: 'Thu', revenue: 8200, trips: 195 },
    { day: 'Fri', revenue: 9100, trips: 218 },
    { day: 'Sat', revenue: 5400, trips: 128 },
    { day: 'Sun', revenue: 3330, trips: 51 }
  ]

  const topDrivers = [
    { id: 1, name: 'Thabo Mthembu', trips: 127, earnings: 'R8,450', rating: 4.95 },
    { id: 2, name: 'Sipho Ndlela', trips: 115, earnings: 'R7,820', rating: 4.88 },
    { id: 3, name: 'Lerato Khumalo', trips: 108, earnings: 'R7,340', rating: 4.92 },
    { id: 4, name: 'Mandla Dlamini', trips: 102, earnings: 'R6,980', rating: 4.85 },
    { id: 5, name: 'Naledi Molefe', trips: 98, earnings: 'R6,650', rating: 4.90 }
  ]

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Platform performance and business intelligence</p>
            </div>
            <div className="flex gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon
            const colorClasses = {
              green: 'bg-green-50 text-green-600',
              blue: 'bg-blue-50 text-blue-600',
              purple: 'bg-purple-50 text-purple-600',
              orange: 'bg-orange-50 text-orange-600'
            }
            return (
              <div key={idx} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${colorClasses[kpi.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    {kpi.change}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">{kpi.label}</p>
                <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Revenue & Trips</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  Revenue
                </button>
                <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  Trips
                </button>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-64 mb-4">
              {revenueData.map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="relative w-full h-full flex items-end justify-center mb-2">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:from-blue-700 hover:to-blue-500 cursor-pointer"
                      style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                      title={`R${data.revenue}`}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-600">{data.day}</span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                <span className="text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-300 rounded"></div>
                <span className="text-gray-600">Trips</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            {/* Conversion Metrics */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Conversion Metrics</h3>
              <div className="space-y-4">
                {[
                  { label: 'Booking Rate', value: '68%', color: 'blue' },
                  { label: 'Completion Rate', value: '96%', color: 'green' },
                  { label: 'Customer Retention', value: '82%', color: 'purple' }
                ].map((metric, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                      <span className="text-lg font-bold text-gray-900">{metric.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          metric.color === 'blue' ? 'bg-blue-600' :
                          metric.color === 'green' ? 'bg-green-600' :
                          'bg-purple-600'
                        }`}
                        style={{ width: metric.value }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">System Health</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">API Uptime</span>
                  <span className="text-sm font-bold text-green-600">99.9%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Response Time</span>
                  <span className="text-sm font-bold text-green-600">145ms</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Active Users</span>
                  <span className="text-sm font-bold text-green-600">1,247</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Drivers */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Top Performing Drivers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Driver</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Trips</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Earnings</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topDrivers.map((driver, idx) => (
                  <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {idx + 1}
                        </div>
                        <span className="font-medium text-gray-900">{driver.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">{driver.trips}</td>
                    <td className="px-6 py-4 text-green-600 font-semibold">{driver.earnings}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(driver.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                            ⭐
                          </span>
                        ))}
                        <span className="text-sm text-gray-600 ml-2">{driver.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/drivers/${driver.id}`}
                        className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                      >
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
