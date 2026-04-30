'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useBookingStore } from '@/store/bookingStore';

export default function BookingsPage() {
  const router = useRouter();
  const { token, user } = useAuthStore();
  const { bookings, fetchBookings, isLoading } = useBookingStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    useAuthStore.getState().initAuth();
  }, []);

  useEffect(() => {
    if (!token) {
      router.push('/login');
    } else {
      fetchBookings();
    }
  }, [token, router]);

  if (!mounted || !token) return null;

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary">
              🚚 Maphosha
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.fullName}</span>
              <button
                onClick={() => {
                  useAuthStore.getState().logout();
                  router.push('/');
                }}
                className="px-4 py-2 text-gray-700 hover:text-primary transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Bookings</h1>
          <Link
            href="/bookings/new"
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-orange-700 transition"
          >
            + New Booking
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">⏳</div>
            <p className="text-gray-600 mt-4">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-2xl text-gray-600 mb-4">No bookings yet</p>
            <p className="text-gray-500 mb-6">Create your first booking to get started</p>
            <Link
              href="/bookings/new"
              className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-orange-700 transition"
            >
              Create Booking
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{booking.serviceType}</h3>
                    <p className="text-gray-600 text-sm">
                      Booking ID: {booking.id.substring(0, 8)}...
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Pickup</p>
                    <p className="font-semibold">{booking.pickupLocation}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Dropoff</p>
                    <p className="font-semibold">{booking.dropoffLocation}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600 text-sm">Estimated Cost</p>
                    <p className="text-2xl font-bold text-primary">${booking.estimatedCost}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/bookings/${booking.id}`}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      View Details
                    </Link>
                    {booking.status === 'in-progress' && (
                      <Link
                        href={`/tracking/${booking.id}`}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                      >
                        Track
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
