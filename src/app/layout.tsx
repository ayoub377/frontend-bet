// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from "@/app/layout/Navbar"; // Using your specified path
import Footer from "@/app/layout/Footer"; // Using your specified path
// UPDATED: Import your custom ThemeProvider wrapper
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import {AuthProvider} from "@/contexts/AuthContext"; // Adjust path if your wrapper is elsewhere

// import { AuthProvider } from '@/contexts/AuthContext'; // Keep if needed

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My SaaS App', // You can customize this
  description: 'Welcome to the future of SaaS!', // You can customize this
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ADDED: suppressHydrationWarning to the html tag
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen bg-white dark:bg-slate-950`}>
      <AuthProvider>
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        {/* <AuthProvider> */} {/* Ensure AuthProvider wraps Navbar if it depends on it */}
          <Navbar />
          {/* Ensure main content has appropriate padding if Navbar is fixed */}
          <main className="pt-20 flex-grow"> {/* pt-20 assumes a navbar height of approx 5rem/80px */}
            {children}
          </main>
          <Footer />
        {/* </AuthProvider> */}
      </ThemeProvider>
          </AuthProvider>
      </body>
    </html>
  );
}