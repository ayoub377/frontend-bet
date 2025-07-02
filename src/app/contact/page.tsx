// pages/contact.tsx
"use client"

import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import {db} from "@/lib/firebaseConfig";
// Assuming db is correctly configured and exported from "@/lib/firebaseConfig"
// For this example, a placeholder for db will be used if not provided by the environment.
// In a real Next.js app, ensure you have your Firebase config set up.
// Example placeholder for db if not available:

// If you have your actual firebaseConfig, replace the above mock with your actual db import:
// import { db } from "@/lib/firebaseConfig";


/**
 * Renders the Contact Us page with a modern UI design.
 * Includes a form for users to submit their email and message,
 * with status feedback for submission.
 */
const ContactPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  /**
   * Handles the form submission.
   * Prevents default form submission, sets status to pending,
   * attempts to add the contact message to Firestore,
   * then updates status and clears form fields on success or sets error on failure.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('pending');
    try {
      await addDoc(collection(db, 'contacts'), { email, message, createdAt: serverTimestamp() });
      setStatus('success');
      setEmail(''); setMessage('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8 tracking-tight">
          Get in Touch
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 transition-all duration-200"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">
              Your Message
            </label>
            <textarea
              id="message"
              rows={5}
              required
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 resize-y transition-all duration-200"
              placeholder="Tell us how we can help..."
            />
          </div>

          <button
            type="submit"
            disabled={status === 'pending'}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5"
          >
            {status === 'pending' ? 'Sending Message...' : 'Send Message'}
          </button>
        </form>

        {status === 'success' && (
          <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center flex items-center justify-center space-x-2">
            <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">Thanks! We’ve received your message.</p>
          </div>
        )}
        {status === 'error' && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center flex items-center justify-center space-x-2">
            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">Oops! Something went wrong. Please try again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
