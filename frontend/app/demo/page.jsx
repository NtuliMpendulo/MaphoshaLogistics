'use client';

import { DEMO_CREDENTIALS } from '@/lib/demoCredentials';
import Link from 'next/link';
import { Copy, CheckCircle, Truck, Shield, Users } from 'lucide-react';
import { useState } from 'react';

export default function DemoCredentials() {
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const credentials = [
    {
      id: 'driver',
      title: 'Driver Account',
      icon: Truck,
      color: 'blue',
      data: DEMO_CREDENTIALS.driver,
      link: '/driver/dashboard'
    },
    {
      id: 'admin',
      title: 'Admin Account',
      icon: Shield,
      color: 'purple',
      data: DEMO_CREDENTIALS.admin,
      link: '/admin/analytics'
    },
    {
      id: 'customer',
      title: 'Customer Account',
      icon: Users,
      color: 'green',
      data: DEMO_CREDENTIALS.customer,
      link: '/bookings'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900">Demo Credentials</h1>
          <p className="text-gray-600 mt-2">Use these accounts to explore MaphoshaLogistics</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {credentials.map(cred => {
            const Icon = cred.icon;
            const colorClasses = {
              blue: 'from-blue-50 to-blue-100 border-blue-200',
              purple: 'from-purple-50 to-purple-100 border-purple-200',
              green: 'from-green-50 to-green-100 border-green-200'
            };
            const iconColors = {
              blue: 'text-blue-600 bg-blue-100',
              purple: 'text-purple-600 bg-purple-100',
              green: 'text-green-600 bg-green-100'
            };

            return (
              <div
                key={cred.id}
                className={`bg-gradient-to-br ${colorClasses[cred.color]} border-2 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-lg ${iconColors[cred.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{cred.title}</h2>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Email */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Email</label>
                    <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-300">
                      <code className="flex-1 text-sm font-mono text-gray-900">{cred.data.email}</code>
                      <button
                        onClick={() => copyToClipboard(cred.data.email, `${cred.id}-email`)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        {copied === `${cred.id}-email` ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Password</label>
                    <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-300">
                      <code className="flex-1 text-sm font-mono text-gray-900">{cred.data.password}</code>
                      <button
                        onClick={() => copyToClipboard(cred.data.password, `${cred.id}-password`)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        {copied === `${cred.id}-password` ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Full Name</label>
                    <div className="bg-white p-3 rounded-lg border border-gray-300">
                      <p className="text-sm text-gray-900">{cred.data.fullName}</p>
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Role</label>
                    <div className="bg-white p-3 rounded-lg border border-gray-300">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full capitalize">
                        {cred.data.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  href={cred.link}
                  className="block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-md transition-all font-semibold text-center"
                >
                  Go to Dashboard →
                </Link>
              </div>
            );
          })}
        </div>

        {/* Demo Pages */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Demo Pages to Explore</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Driver Dashboard', path: '/driver/dashboard', description: 'Real-time job management and earnings' },
              { name: 'Admin Analytics', path: '/admin/analytics', description: 'KPIs and performance metrics' },
              { name: 'Live Tracking', path: '/tracking/live', description: 'Real-time vehicle tracking' },
              { name: 'Bookings', path: '/bookings', description: 'Booking management system' },
              { name: 'Home Page', path: '/', description: 'Landing page' },
              { name: 'Login', path: '/login', description: 'Authentication page' }
            ].map(page => (
              <Link
                key={page.path}
                href={page.path}
                className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{page.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{page.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Features to Explore</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              '✅ Real-time job management',
              '✅ Live earnings tracking',
              '✅ Performance analytics',
              '✅ Driver leaderboards',
              '✅ Live tracking with maps',
              '✅ Admin dashboards',
              '✅ Booking system',
              '✅ Notifications and alerts'
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
