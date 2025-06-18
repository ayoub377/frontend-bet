"use client";

import React, { useEffect, useState, useRef } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import { auth } from "@/lib/firebaseConfig"; // Ensure this path is correct
import { useRouter, usePathname } from 'next/navigation';
// No longer need to import 'next/image'

// It's good practice to define the SVG icon as its own component for reusability and cleanliness.
const GoogleLogoIcon = ({ width = 20, height = 20 }: { width?: number; height?: number }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 48 48"
    aria-label="Google logo"
  >
    <clipPath id="g">
      <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
    </clipPath>
    <g clipPath="url(#g)">
      <path fill="#FBBC05" d="M0 37V11l17 13z"/>
      <path fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z"/>
      <path fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z"/>
      <path fill="#4285F4" d="M48 48L17 24l-4-3 35-10z"/>
    </g>
  </svg>
);


interface SignInButtonProps {
  // Props can be added here if the component needs to be more flexible
}

const SignInButton: React.FC<SignInButtonProps> = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current path to make smarter redirects
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // useRef to prevent state updates on unmounted component
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    // This listener handles auth state changes globally
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!isMounted.current) return;

      setUser(currentUser); // Update user state for UI rendering

      if (currentUser) {
        // User has just logged in or the page has loaded with a logged-in user
        console.log('User signed in:', currentUser.email, "Current path:", pathname);

        // Only redirect to the dashboard if the user is on a public entry page
        if (pathname === '/auth/login' || pathname === '/') {
          console.log('Redirecting to /dashboard after sign-in...');
          router.push('/dashboard');
        }
      } else {
        // User has just logged out
        console.log('User signed out. Current path:', pathname);
        // Only redirect if they signed out from a protected page to avoid loops
        if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/pro-analysis') || pathname?.startsWith('/arbitrage')) {
          console.log('User signed out from a protected page, redirecting to login...');
          router.push('/auth/login');
        }
      }
    });

    // Cleanup function to unsubscribe and update mount status
    return () => {
      isMounted.current = false;
      unsubscribe();
    };
  }, [router, pathname]); // Rerun effect if the path changes

  const signInWithGoogle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle the rest, including the redirect.
    } catch (error: any) {
      console.error("Google Sign-In Error:", error.code, error.message);
      // User-friendly error handling
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        alert("Sign-in failed. Please try again.");
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const handleSignOut = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await signOut(auth);
      // onAuthStateChanged will detect the sign-out and redirect from protected routes.
      // We can also add an explicit push here to ensure immediate navigation.
      router.push('/auth/login');
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Failed to sign out. Please try again.");
    } finally {
       if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '320px', margin: 'auto' }}>
      {user ? (
        // === VIEW WHEN USER IS SIGNED IN ===
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '16px', color: '#333' }}>
            Welcome, {user.displayName || user.email}!
          </p>
          <button
            onClick={handleSignOut}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 'bold',
              backgroundColor: '#D32F2F', // A standard red for sign-out/danger actions
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'background-color 0.2s ease-in-out',
            }}
          >
            {loading ? 'Signing Out...' : 'Sign Out'}
          </button>
        </div>
      ) : (
        // === VIEW WHEN USER IS SIGNED OUT ===
        <button
          onClick={signInWithGoogle}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '500',
            backgroundColor: '#FFFFFF', // White background
            color: '#4A4A4A', // Dark grey text for better readability
            border: '1px solid #E0E0E0', // Light grey border
            borderRadius: '8px',
            cursor: 'pointer',
            opacity: loading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px', // Space between logo and text
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', // Subtle shadow for depth
            transition: 'background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          }}
        >
          {loading ? (
            'Signing In...'
          ) : (
            <>
              <GoogleLogoIcon />
              Sign in with Google
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default SignInButton;