import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { AuthProvider } from '@/components/SessionProvider'; 
import { AudioProvider } from '@/contexts/AudioContext';
import { MusicPlayer } from '@/components/MusicPlayer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MUZO - AI Music Creation',
  description: 'Create music with AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-[#1a0b2e] to-[#0a0d12] text-white relative pb-24`}>
        <AuthProvider>
          <AudioProvider>
            <Navbar />
            <main>
              {children}
            </main>
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-[#1a0b2e] to-transparent">
              <MusicPlayer />
            </div>
          </AudioProvider>
        </AuthProvider>
      </body>
    </html>
  );
}