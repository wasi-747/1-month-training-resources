import './globals.css';

export const metadata = {
  title: 'ToLetNest — Hyperlocal Smart To-Let & Roommate Finder',
  description:
    'One ecosystem, two apps. Landlord MERN Web Dashboard & Tenant React Native Mobile Simulator with GPS Proximity Radar, In-App Privacy Calling & Transparent Utility Pricing.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
