import './globals.css';
import 'leaflet/dist/leaflet.css';

export const metadata = {
  title: 'ToLetNest — Hyperlocal Smart To-Let Ecosystem for Dhaka',
  description:
    'A distinct, locally-grounded full-stack rental platform. MERN Landlord Dashboard & React Native Mobile Client with GPS Proximity Radar, In-App Privacy Calling & Transparent Utility Pricing.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
