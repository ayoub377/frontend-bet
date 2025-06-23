// src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from "@/app/layout/Navbar";
import Footer from "@/app/layout/Footer";
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from "@/contexts/AuthContext";
import FirebaseAnalyticsProvider from "@/contexts/FirebaseAnalyticsProvider";
// NOUVELLE LIGNE : Importez votre composant client

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sharper-Bets',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen bg-white dark:bg-slate-950`}>
        {/* NOUVELLE LIGNE : Placez le provider ici */}
        <FirebaseAnalyticsProvider /> 

        <AuthProvider>
          <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              <main className="pt-20 flex-grow">
                {children}
              </main>
              <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
