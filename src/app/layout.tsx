"use client";

import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { AudioProvider } from '@/contexts/AudioContext';
import { MusicPlayer } from '@/components/MusicPlayer';
import { Providers } from './providers';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <ThemeProvider>
          <AuthProvider>
            <AudioProvider>
              <body className={`${inter.className} min-h-screen bg-background text-textPrimary relative pb-24`}>
                <Navbar />
                <main>
                  {children}
                </main>
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-[#1a0b2e] to-transparent">
                  <MusicPlayer />
                </div>
              </body>
            </AudioProvider>
          </AuthProvider>
        </ThemeProvider>
      </Providers>
    </html>
  );
}
