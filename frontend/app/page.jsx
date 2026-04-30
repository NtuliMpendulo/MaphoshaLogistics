'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import config from '@/app.config';

export default function Home() {
  const { user, token } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    useAuthStore.getState().initAuth();
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">🚚 Maphosha</h1>
            </div>
            <div className="flex items-center gap-4">
              {token && user ? (
                <>
                  <span className="text-sm text-gray-600">Welcome, {user.fullName}</span>
                  <Link
                    href={user.role === 'driver' ? '/driver' : '/bookings'}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-700 transition"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-gray-700 hover:text-primary transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-700 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-orange-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Your Trusted Transportation Partner
              </h1>
              <p className="text-xl text-orange-100 mb-8">
                Fast, reliable, and affordable transportation services for all your needs. From parcel delivery to shuttle services.
              </p>
              <div className="flex gap-4">
                {!token ? (
                  <>
                    <Link
                      href="/register"
                      className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition"
                    >
                      Get Started
                    </Link>
                    <Link
                      href="/login"
                      className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
                    >
                      Login
                    </Link>
                  </>
                ) : (
                  <Link
                    href={user.role === 'driver' ? '/driver' : '/bookings'}
                    className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition"
                  >
                    Go to Dashboard
                  </Link>
                )}
              </div>
            </div>
            <div className="text-6xl text-center">🚗</div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {config.services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition animate-slide-up"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <p className="text-2xl font-bold text-primary">From ${service.basePrice}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Maphosha?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '⚡', title: 'Fast', description: 'Quick pickup and delivery' },
              { icon: '💰', title: 'Affordable', description: 'Competitive pricing' },
              { icon: '🛡️', title: 'Safe', description: 'Secure and reliable' },
              { icon: '📍', title: 'Tracked', description: 'Real-time tracking' },
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-orange-100 mb-8">
            Book your transportation service now and experience the difference.
          </p>
          {!token ? (
            <Link
              href="/register"
              className="inline-block px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Create Account
            </Link>
          ) : (
            <Link
              href={user.role === 'driver' ? '/driver' : '/bookings/new'}
              className="inline-block px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Book Now
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Maphosha</h3>
              <p className="text-gray-400">Premium transportation solutions</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Parcel Delivery</a></li>
                <li><a href="#" className="hover:text-white transition">School Transport</a></li>
                <li><a href="#" className="hover:text-white transition">Shuttle Services</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Maphosha PTY LTD. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
