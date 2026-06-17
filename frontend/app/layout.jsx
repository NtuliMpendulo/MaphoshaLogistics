import '@/styles/globals.css';
import { Metadata } from 'next';

export const metadata = {
  title: 'MaphoshaLogistics - Premium Transportation Solutions',
  description: 'Fast, reliable, and affordable transportation services for all your needs',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ff6600" />
      </head>
      <body className="bg-gray-50">
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
