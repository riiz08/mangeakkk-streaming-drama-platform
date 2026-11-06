import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export const metadata: Metadata = {
  title: 'StreamFlow - Next Generation Streaming Platform',
  description: 'Nikmati jutaan jam konten hiburan, film eksklusif, dokumenter samudra, dan live stream tanpa batas.',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-pink-500 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

