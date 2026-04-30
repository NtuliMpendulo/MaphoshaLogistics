'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function DriverDashboard() {
  const router = useRouter();
  const { token, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    useAuthStore.getState().initAuth();
  }, []);

  useEffect(() => {
    if (!token) {
      router.push('/login');
    } else if (user?.role !== 'driver') {
      router.push('/bookings');
    } else {
      fetchDriverData();
    }
  }, [token, user, router]);

  const fetchDriverData = async () => {
    try {
      const [jobsRes, earningsRes] = await Promise.all([
        axios.get(`${API_URL}/drivers/jobs/assigned`),
        axios.get(`${API_URL}/drivers/earnings/summary`),
      ]);
      setJobs(jobsRes.data);
      setEarnings(earningsRes.data);
    } catch (error) {
      console.error('Error fetching driver data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptJob = async (bookingId) => {
    try {
      await axios.post(`${API_URL}/drivers/jobs/${bookingId}/accept`);
      fetchDriverData();
    } catch (error) {
      console.error('Error accepting job:', error);
    }
  };

  const startJob = async (bookingId) => {
    try {
      await axios.post(`${API_URL}/drivers/jobs/${bookingId}/start`);
      fetchDriverData();
    } catch (error) {
      console.error('Error starting job:', error);
    }
  };

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
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Driver: {user?.fullName}</span>
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
        <h1 className="text-4xl font-bold mb-8">Driver Dashboard</h1>

        {/* Stats */}
        {earnings && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 text-sm">Total Trips</p>
              <p className="text-4xl font-bold text-primary">{earnings.totalTrips || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 text-sm">Total Earnings</p>
              <p className="text-4xl font-bold text-green-600">${earnings.totalEarnings || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 text-sm">Average Rating</p>
              <p className="text-4xl font-bold text-yellow-500">
                {earnings.averageRating ? earnings.averageRating.toFixed(1) : 'N/A'}⭐
              </p>
            </div>
          </div>
        )}

        {/* Jobs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Assigned Jobs</h2>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin">⏳</div>
              <p className="text-gray-600 mt-4">Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-2xl text-gray-600 mb-4">No jobs assigned</p>
              <p className="text-gray-500">Check back later for new assignments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{job.serviceType}</h3>
                      <p className="text-gray-600 text-sm">Customer: {job.fullName}</p>
                    </div>
                    <span className="text-2xl font-bold text-primary">${job.estimatedCost}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600 text-sm">Pickup</p>
                      <p className="font-semibold">{job.pickupLocation}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Dropoff</p>
                      <p className="font-semibold">{job.dropoffLocation}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {job.status === 'confirmed' && (
                      <button
                        onClick={() => startJob(job.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                      >
                        Start Job
                      </button>
                    )}
                    {job.status === 'in-progress' && (
                      <Link
                        href={`/driver/job/${job.id}`}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        Manage Job
                      </Link>
                    )}
                    <button
                      onClick={() => acceptJob(job.id)}
                      disabled={job.status !== 'pending'}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {job.status === 'pending' ? 'Accept Job' : 'Accepted'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
