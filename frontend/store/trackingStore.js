import { create } from 'zustand';
import axios from 'axios';
import io from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const useTrackingStore = create((set, get) => ({
  currentLocation: null,
  trackingHistory: [],
  isTracking: false,
  error: null,

  // Initialize socket connection
  initSocket: () => {
    if (!socket) {
      socket = io(SOCKET_URL, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      socket.on('location-updated', (data) => {
        set({ currentLocation: data });
      });

      socket.on('connect', () => {
        console.log('Socket connected');
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }
  },

  // Join booking room
  joinBooking: (bookingId) => {
    if (socket) {
      socket.emit('join-booking', bookingId);
      set({ isTracking: true });
    }
  },

  // Leave booking room
  leaveBooking: (bookingId) => {
    if (socket) {
      socket.emit('leave-booking', bookingId);
      set({ isTracking: false, currentLocation: null });
    }
  },

  // Fetch tracking history
  fetchTrackingHistory: async (bookingId) => {
    try {
      const response = await axios.get(`${API_URL}/tracking/${bookingId}/history`);
      set({ trackingHistory: response.data });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch tracking history' });
      return [];
    }
  },

  // Update driver location
  updateLocation: (bookingId, latitude, longitude, accuracy, speed) => {
    if (socket) {
      socket.emit('update-location', {
        bookingId,
        latitude,
        longitude,
        accuracy,
        speed,
      });
    }
  },

  // Get current location (for driver)
  getCurrentLocation: (onSuccess, onError) => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          onSuccess({ latitude, longitude, accuracy });
        },
        (error) => {
          console.error('Geolocation error:', error);
          onError(error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
    } else {
      onError(new Error('Geolocation not supported'));
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Disconnect socket
  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },
}));
