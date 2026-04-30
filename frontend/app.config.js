// Frontend configuration
export const config = {
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    socketURL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000',
  },
  app: {
    name: 'MaphoshaLogistics',
    tagline: 'Premium Transportation Solutions',
    logo: '/logo.png',
  },
  services: [
    {
      id: 'parcel-delivery',
      name: 'Small Parcel Delivery',
      description: 'Fast and reliable parcel delivery service',
      icon: '📦',
      basePrice: 50,
    },
    {
      id: 'school-transport',
      name: 'School Transport',
      description: 'Safe and comfortable transportation for students',
      icon: '🚌',
      basePrice: 150,
    },
    {
      id: 'shuttle-service',
      name: 'Shuttle Services',
      description: 'Convenient shuttle for groups and events',
      icon: '🚐',
      basePrice: 100,
    },
  ],
  colors: {
    primary: '#ff6600',
    secondary: '#0f172a',
    accent: '#8b5cf6',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
  },
};

export default config;
