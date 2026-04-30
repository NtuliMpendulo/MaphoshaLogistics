import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const useBookingStore = create((set, get) => ({
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,

  // Fetch all bookings for user
  fetchBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/bookings`);
      set({ bookings: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to fetch bookings';
      set({ error: message, isLoading: false });
      return [];
    }
  },

  // Fetch single booking
  fetchBooking: async (bookingId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/bookings/${bookingId}`);
      set({ currentBooking: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to fetch booking';
      set({ error: message, isLoading: false });
      return null;
    }
  },

  // Create new booking
  createBooking: async (bookingData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/bookings`, bookingData);
      
      // Fetch updated bookings list
      get().fetchBookings();
      
      set({ isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to create booking';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Update booking status
  updateBookingStatus: async (bookingId, status) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put(`${API_URL}/bookings/${bookingId}/status`, { status });
      
      // Update local state
      set(state => ({
        bookings: state.bookings.map(b => 
          b.id === bookingId ? { ...b, status } : b
        ),
        currentBooking: state.currentBooking?.id === bookingId 
          ? { ...state.currentBooking, status }
          : state.currentBooking,
        isLoading: false,
      }));
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update booking';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/bookings/${bookingId}/cancel`);
      
      // Update local state
      set(state => ({
        bookings: state.bookings.map(b => 
          b.id === bookingId ? { ...b, status: 'cancelled' } : b
        ),
        isLoading: false,
      }));
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to cancel booking';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
