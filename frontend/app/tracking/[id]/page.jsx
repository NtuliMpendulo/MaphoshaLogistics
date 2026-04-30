'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useTrackingStore } from '@/store/trackingStore';
import { useBookingStore } from '@/store/bookingStore';

export default function TrackingPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id;
  
  const { token } = useAuthStore();
  const { currentLocation, isTracking, joinBooking, leaveBooking, fetchTrackingHistory, trackingHistory } = useTrackingStore();
  const { currentBooking, fetchBooking } = useBookingStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    useAuthStore.getState().initAuth();
    useTrackingStore.getState().initSocket();
  }, []);

  useEffect(() => {
    if (!token) {
      router.push('/login');
    } else {
      fetchBooking(bookingId);
      fetchTrackingHistory(bookingId);
      joinBooking(bookingId);
    }

    return () => {
      leaveBooking(bookingId);
    };
  }, [token, bookingId, router]);

  if (!mounted || !token) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary">
              🚚 Maphosha
            </Link>
            <Link href="/bookings" className="text-gray-700 hover:text-primary transition">
              Back to Bookings
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Real-Time Tracking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                {currentLocation ? (
                  <div className="text-center">
                    <p className="text-2xl mb-2">📍</p>
                    <p className="text-gray-600">
                      Latitude: {currentLocation.latitude.toFixed(4)}
                    </p>
                    <p className="text-gray-600">
                      Longitude: {currentLocation.longitude.toFixed(4)}
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                      Accuracy: ±{currentLocation.accuracy?.toFixed(0) || 'N/A'} meters
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-2xl mb-2">🗺️</p>
                    <p className="text-gray-600">Waiting for driver location...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-6">
            {/* Booking Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Booking Details</h2>
              {currentBooking ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600 text-sm">Service Type</p>
                    <p className="font-semibold">{currentBooking.serviceType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Status</p>
                    <p className="font-semibold text-green-600">{currentBooking.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Pickup</p>
                    <p className="font-semibold text-sm">{currentBooking.pickupLocation}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Dropoff</p>
                    <p className="font-semibold text-sm">{currentBooking.dropoffLocation}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Estimated Cost</p>
                    <p className="text-2xl font-bold text-primary">${currentBooking.estimatedCost}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Loading booking details...</p>
              )}
            </div>

            {/* Live Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Live Status</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                  <span className="text-gray-600">
                    {isTracking ? 'Tracking Active' : 'Tracking Inactive'}
                  </span>
                </div>
                {currentLocation && (
                  <div className="text-sm text-gray-500">
                    Last update: {new Date(currentLocation.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tracking History */}
        {trackingHistory.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Tracking History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2">Time</th>
                    <th className="text-left py-2">Latitude</th>
                    <th className="text-left py-2">Longitude</th>
                    <th className="text-left py-2">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {trackingHistory.slice(-10).reverse().map((record, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-2">{new Date(record.timestamp).toLocaleTimeString()}</td>
                      <td className="py-2">{record.latitude.toFixed(4)}</td>
                      <td className="py-2">{record.longitude.toFixed(4)}</td>
                      <td className="py-2">±{record.accuracy?.toFixed(0) || 'N/A'}m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
