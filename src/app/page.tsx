// src/app/page.tsx (or your actual homepage file path)
"use client"; // Required for useEffect, useState, and DOM interactions

import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/compat/router'; // Using next/compat/router as in your provided code
import axios from "axios";
import Banner from "@/components/ui/Banner"; // Import the reusable Banner component
// import Navbar from "@/app/components/Navbar"; // Assuming this path is correct if you uncomment it
// import FaqComponent from "@/app/components/Faq"; // Assuming this path is correct

// Placeholder FaqComponent if not available, replace with your actual component
const FaqComponent = () => (
    <div id="faq" className="py-12 bg-gray-50 dark:bg-slate-800">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-gray-800 dark:text-gray-100">
                Frequently Asked Questions
            </h2>
            <div className="space-y-4 max-w-2xl mx-auto text-left">
                {[
                    {
                        q: "What is Sharper Bets?",
                        a: "Sharper Bets is a platform providing analytics and tools for sports betting."
                    },
                    {
                        q: "How do I use the tool?",
                        a: "Get the exact home team and away team names from Flashscore. Wait for lineups to be posted, which is typically within 45 minutes before the game starts, and then use the tool. Sometimes you may need to retry two to three times for it to work."
                    },
                    {
                        q: "How do I join the waitlist?",
                        a: "You can join the waitlist by submitting your email in the form on our services section."
                    },
                    {
                        q: "What are the benefits of early access?",
                        a: "Early users will get special offers and be the first to experience our full suite of tools."
                    }
                ].map((item, index) => (
                    <div key={index} className="p-4 bg-white dark:bg-slate-700 rounded-lg shadow">
                        <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200">{item.q}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">{item.a}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default function HomePage() {
    const router = useRouter();
    const [bannerOpacity, setBannerOpacity] = useState(1);
    const [bannerTransform, setBannerTransform] = useState(0);
    const [servicesOpacity, setServicesOpacity] = useState(0);
    const [servicesTransform, setServicesTransform] = useState(50);
    const [aboutOpacity, setAboutOpacity] = useState(0);
    const [aboutTransform, setAboutTransform] = useState(50);
    const [faqOpacity, setFaqOpacity] = useState(0);
    const [faqTransform, setFaqTransform] = useState(50);
    const [waitlistEmail, setWaitlistEmail] = useState('');
    const [waitlistSuccess, setWaitlistSuccess] = useState(false);
    const [waitlistError, setWaitlistError] = useState('');


    // Handle waitlist form submission
    const handleWaitlistSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setWaitlistError(''); // Clear previous errors
        setWaitlistSuccess(false);
        try {
            const payload = {email: waitlistEmail};
            // IMPORTANT: Replace with your actual API endpoint if deploying
            await axios.post('http://localhost:9000/api/waitlist', payload);
            setWaitlistSuccess(true);
            setWaitlistEmail(''); // Clear email field on success
        } catch (error) {
            console.error('Error adding to waitlist:', error);
            if (axios.isAxiosError(error) && error.response) {
                setWaitlistError(error.response.data.message || 'Failed to join waitlist. Please try again.');
            } else {
                setWaitlistError('An unexpected error occurred. Please try again.');
            }
        }
    };

    // Scroll event listener for animations
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            // Banner fade logic (parallax style)
            setBannerOpacity(Math.max(1 - scrollY / 500, 0)); // Slower fade for parallax
            setBannerTransform(Math.min(scrollY / 3, 100)); // Adjust for desired parallax effect

            // Services section fade logic
            const servicesSection = document.getElementById('services');
            if (servicesSection) {
                const servicesTop = servicesSection.getBoundingClientRect().top;
                if (servicesTop < windowHeight * 0.75) { // Trigger when 75% of section is visible
                    setServicesOpacity(1);
                    setServicesTransform(0);
                } else {
                    // Optional: Keep it hidden until it's scrolled to
                    // setServicesOpacity(0);
                    // setServicesTransform(50);
                }
            }

            // About section fade logic
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                const aboutTop = aboutSection.getBoundingClientRect().top;
                if (aboutTop < windowHeight * 0.75) {
                    setAboutOpacity(1);
                    setAboutTransform(0);
                }
            }

            // FAQ section fade logic
            const faqSection = document.getElementById('faq');
            if (faqSection) {
                const faqTop = faqSection.getBoundingClientRect().top;
                if (faqTop < windowHeight * 0.75) {
                    setFaqOpacity(1);
                    setFaqTransform(0);
                }
            }
        };

        // Initial check in case sections are already in view on load
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900">
            {/* Navbar - Assuming it's handled by a layout component or you'll uncomment it */}
            {/* <Navbar /> */}

            {/* Banner Section - MODIFIED TO USE Banner COMPONENT */}
            <div
                className="relative h-screen overflow-hidden transition-opacity duration-500 ease-out"
                style={{
                    opacity: bannerOpacity,
                    transform: `translateY(${bannerTransform}px)`,
                }}
            >
                <Banner
                    className="h-full w-full" // Ensure Banner fills its animated wrapper
                    imageUrl="sharper-bets-banner.png" // Ensure this image is in your public/assets folder
                    imageAlt="Sharper Bets background"
                    title="Welcome to Sharper-Bets"
                    description={
                        <>
                            We cut your workload by <b>90%</b> and equip you with the essential tools to win smarter and
                            become a sharper sports bettor. <br className="hidden sm:inline"/>Join us to gain the
                            ultimate edge!
                        </>
                    }
                    ctaText="Get Started"
                    ctaHref="#services" // Links to the services section ID
                />
            </div>

            {/* Services Section */}
            <section
                id="services"
                className="services-section py-16 md:py-24 bg-gray-50 dark:bg-slate-800 flex flex-col items-center justify-center px-6 transition-all duration-700 ease-out"
                style={{
                    opacity: servicesOpacity,
                    transform: `translateY(${servicesTransform}px)`,
                }}
            >
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-800 dark:text-gray-100">Unlock
                        Your Edge</h2> {/* Slightly more action-oriented title */}
                    <p className="text-lg md:text-xl mb-10 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Leverage our powerful tools to gain deeper insights, find unique opportunities, and elevate your
                        betting strategy.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {/* Card 1: Arbitrage Opportunities Scanner */}
                        <div
                            onClick={() => router?.push('/arbitrage')}
                            className="p-8 bg-white dark:bg-slate-700 border-2 border-blue-500 dark:border-sky-400 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer group"
                        >
                            {/* Consider adding an icon here if desired, e.g., <ZapIcon className="w-12 h-12 text-blue-500 dark:text-sky-400 mx-auto mb-4 group-hover:animate-pulse" /> */}
                            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-sky-300 transition-colors">
                                Arbitrage Opportunity Scanner
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Unlock guaranteed profits! Our scanner scours multiple sportsbooks in real-time to
                                identify
                                and alert you to risk-free arbitrage betting opportunities.
                            </p>
                            <span
                                className="mt-6 inline-block text-blue-600 dark:text-sky-400 font-semibold group-hover:underline">
          Find Arbitrage Bets &rarr;
        </span>
                        </div>

                        {/* Card 2: Pro-Level Team Analysis (formerly Lineup Comparison) */}
                        <div
                            onClick={() => router?.push('/pro-analysis')}
                            className="p-8 bg-white dark:bg-slate-700 border-2 border-green-500 dark:border-emerald-400 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer group"
                        >
                            {/* Consider adding an icon, e.g., <BarChart3 className="w-12 h-12 text-green-500 dark:text-emerald-400 mx-auto mb-4 group-hover:animate-bounce" /> */}
                            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-emerald-300 transition-colors">
                                Pro-Level Team Analysis
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Dive deep into team matchups. Compare lineups player-by-player, identify key tactical
                                advantages, and make data-driven betting decisions with confidence.
                            </p>
                            <span
                                className="mt-6 inline-block text-green-600 dark:text-emerald-400 font-semibold group-hover:underline">
          Analyze Matchups &rarr;
        </span>
                        </div>
                    </div>

                    <div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 p-8 md:p-10 rounded-lg shadow-2xl text-white transform transition-all duration-500 hover:scale-105 max-w-lg mx-auto">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-center">
                            Join the Waitlist for Early Access!
                        </h3>
                        <p className="text-lg mb-1 text-center opacity-95">
                            Early Users will Get a <span className="font-semibold">Special Offer!</span>
                        </p>
                        <p className="text-md mb-6 text-center opacity-90">
                            Be the first to experience the full potential of our app.
                        </p>
                        <form onSubmit={handleWaitlistSubmit}
                              className="flex flex-col gap-4"> {/* Ensure handleWaitlistSubmit, waitlistEmail, setWaitlistEmail, waitlistSuccess, waitlistError are defined in your page component */}
                            <input
                                type="email"
                                value={waitlistEmail}
                                onChange={(e) => setWaitlistEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="w-full p-3 rounded-lg bg-white bg-opacity-20 placeholder-gray-200 dark:placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-400"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full p-3 bg-white text-purple-600 dark:text-purple-700 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-200 transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                Join Waitlist
                            </button>
                        </form>
                        {waitlistSuccess && (
                            <p className="mt-4 text-green-300 dark:text-green-400 text-center font-medium">
                                🎉 Thanks for joining! We&#39;ll notify you when we launch.
                            </p>
                        )}
                        {waitlistError && (
                            <p className="mt-4 text-red-300 dark:text-red-400 text-center font-medium">
                                {waitlistError}
                            </p>
                        )}
                    </div>
                </div>
            </section>

{/* About Section */}
<section
    id="about"
    className="about-section py-16 md:py-24 bg-white dark:bg-slate-900 flex flex-col items-center justify-center px-6 transition-all duration-700 ease-out"
    style={{
        opacity: aboutOpacity,
        transform: `translateY(${aboutTransform}px)`,
    }}
>
    <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-8">
            About Us
        </h2>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-6 leading-relaxed">
            At <span className="font-semibold text-gray-900 dark:text-gray-100">Sharper-Bets</span>, we believe
            that smart betting requires <span className="font-bold text-gray-900 dark:text-gray-100">sharp analysis</span> and the
            right tools. Our mission is to help you make <span className="font-bold text-gray-900 dark:text-gray-100">profitable decisions</span>
            through:
        </p>
        <ul className="list-none md:list-disc list-inside text-left text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8 space-y-3">
            <li>
                <span className="font-semibold text-gray-900 dark:text-gray-100">✓ Arbitrage opportunities</span> detection to exploit price differences across bookmakers.
            </li>
            <li>
                <span className="font-semibold text-gray-900 dark:text-gray-100">✓ Team and player market value analysis</span> to evaluate lineups and assess team strength.
            </li>
        </ul>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            By integrating <span className="font-semibold text-gray-900 dark:text-gray-100">market value data from Transfermarkt</span>, our platform enables
            bettors to uncover hidden edges by comparing starting lineups—even for less-followed teams. Whether you're
            a seasoned bettor or just starting out, our tools are designed to give you a <span className="font-bold text-gray-900 dark:text-gray-100">competitive edge</span>.
        </p>
        <button
            onClick={() => router?.push('/about-us')}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-400"
        >
            Learn More About Us
        </button>
    </div>
</section>

            {/* FAQ Section */}
            <section
                id="faq"
                className="faq-section transition-all duration-700 ease-out" // Removed py-16 md:py-24 as FaqComponent has its own padding
                style={{
                    opacity: faqOpacity,
                    transform: `translateY(${faqTransform}px)`,
                }}
            >
                <FaqComponent/>
            </section>
        </div>
    );
}
