"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import Button from "@/components/ui/Button"; // Import custom Button
import AdBanner from "@/components/ads/AdBanner";

// Interfaces (ArbitrageOpportunity, ArbitrageResponse, etc.)
interface ArbitrageOpportunity {
  match_id: string;
  match_name: string;
  match_start_time_unix: number;
  match_start_time_iso: string;
  hours_to_start: number;
  sport_key: string;
  sport_title: string;
  best_outcome_odds: {
    [outcomeName: string]: [bookmakerName: string, odds: number];
  };
  total_implied_odds: number;
  profit_margin_percentage: number;
}

interface ArbitrageResponse {
  message: string;
  opportunities_count: number;
  opportunities: ArbitrageOpportunity[];
}

interface CalculatedStakeInfo {
  outcomeName: string;
  bookmakerName: string;
  odds: number;
  stake: number;
  potentialReturn: number;
}

// Constant for request limits (should match AuthContext or shared config)
const NORMAL_USER_MAX_REQUESTS = 5;


// Helper to format time ago
const timeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);

  if (seconds < 60) return `${seconds} sec ago`;
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  return date.toLocaleDateString();
};

// Loading Skeleton component
const OpportunitySkeleton = () => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg animate-pulse">
    <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-md">
          <div>
            <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-24 mb-1"></div>
            <div className="h-3 bg-gray-300 dark:bg-slate-600 rounded w-20"></div>
          </div>
          <div className="h-6 bg-gray-300 dark:bg-slate-600 rounded w-12"></div>
        </div>
      ))}
    </div>
    <div className="mt-4 flex justify-between items-center">
      <div className="h-8 bg-green-200 dark:bg-green-700 rounded w-20"></div>
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-24"></div>
    </div>
     <div className="mt-4 h-8 bg-sky-200 dark:bg-sky-700 rounded w-full"></div>
  </div>
);

const REGIONS = [
  { value: 'eu', label: 'Europe (EU)' },
  { value: 'us', label: 'United States (US)' },
  { value: 'uk', label: 'United Kingdom (UK)' },
  { value: 'au', label: 'Australia (AU)' },
];

// Arbitrage Calculator Modal Component (remains unchanged)
interface ArbitrageCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: ArbitrageOpportunity | null;
  totalAmount: string;
  onTotalAmountChange: (value: string) => void;
  stakes: CalculatedStakeInfo[];
}

const ArbitrageCalculatorModal: React.FC<ArbitrageCalculatorModalProps> = ({
  isOpen,
  onClose,
  opportunity,
  totalAmount,
  onTotalAmountChange,
  stakes,
}) => {
  if (!isOpen || !opportunity) return null;

  const numericTotalAmount = parseFloat(totalAmount) || 0;
  const totalReturnValue = numericTotalAmount > 0 && opportunity.total_implied_odds > 0 && opportunity.total_implied_odds < 100
    ? (numericTotalAmount / (opportunity.total_implied_odds / 100)) // Corrected math for implied odds as a percentage
    : 0;
  const totalProfit = totalReturnValue > 0 ? totalReturnValue - numericTotalAmount : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out"
         style={{ opacity: isOpen ? 1 : 0 }}
    >
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow"
           style={{ animationFillMode: 'forwards' }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Arbitrage Calculator
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-1 truncate" title={opportunity.match_name}>
          Match: <span className="font-medium">{opportunity.match_name}</span>
        </p>
        <p className="text-sm text-red-500 dark:text-red-400 font-semibold mb-4">
          Guaranteed Profit Margin: {opportunity.profit_margin_percentage.toFixed(2)}%
        </p>

        <div className="mb-5">
          <label htmlFor="totalBet" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Total Bet Amount (€)
          </label>
          <input
            type="number"
            id="totalBet"
            value={totalAmount}
            onChange={(e) => onTotalAmountChange(e.target.value)}
            placeholder="e.g., 100"
            min="1"
            step="any"
            className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-500 dark:bg-slate-700 dark:text-gray-100 text-lg"
          />
        </div>

        {stakes.length > 0 && numericTotalAmount > 0 && (
          <div className="space-y-3 mb-5">
            <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-2">Stakes per Outcome:</h3>
            {stakes.map((calc, index) => (
              <div key={index} className="p-3 bg-gray-100 dark:bg-slate-700 rounded-lg text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-800 dark:text-gray-100">{calc.outcomeName}</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    Bet: <span className="text-blue-600 dark:text-sky-400">€{calc.stake.toFixed(2)}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                   <span>@{calc.odds.toFixed(2)} on {calc.bookmakerName}</span>
                   <span>Returns: €{calc.potentialReturn.toFixed(2)}</span>
                </div>
              </div>
            ))}
            <div className="mt-5 pt-4 border-t border-gray-200 dark:border-slate-600">
              <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                <span>Total Stake:</span>
                <span>€{numericTotalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-green-600 dark:text-green-400 mb-1">
                <span>Guaranteed Return:</span>
                <span>€{totalReturnValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-md font-bold text-green-500 dark:text-green-400">
                <span>Guaranteed Profit:</span>
                <span>€{totalProfit.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
        {numericTotalAmount > 0 && stakes.length === 0 && (
            <p className="text-sm text-center text-yellow-600 dark:text-yellow-400 py-4">Calculating stakes...</p>
        )}
         {numericTotalAmount <= 0 && (
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-4">Enter a total bet amount.</p>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


export default function ArbitragePage() {
  const router = useRouter();
  const {
    firebaseUser,
    isLoadingAuth,
    customUserProfile,
    canMakeRequest,
    requestsLeftToday,
    nextQuotaResetTimeDisplay,
    recordSuccessfulRequest,
    refreshUserProfile
  } = useAuth();

  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [region, setRegion] = useState<string>('eu');
  const [cutoff, setCutoff] = useState<string>('0.01');
  const [sports, setSports] = useState<string>('');
  const [includeStartedMatches, setIncludeStartedMatches] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOpportunityForCalc, setSelectedOpportunityForCalc] = useState<ArbitrageOpportunity | null>(null);
  const [totalBetAmount, setTotalBetAmount] = useState<string>('100');
  const [calculatedStakes, setCalculatedStakes] = useState<CalculatedStakeInfo[]>([]);

  useEffect(() => {
    // Clear rate-limit errors if user's quota resets
    if (canMakeRequest && error && (error.includes("limit") || error.includes("requests") || error.includes("scans"))) {
        setError(null);
    }
  }, [canMakeRequest, error]);

  const fetchOpportunities = async () => {
    // Check user authentication and request limits before fetching
    if (!firebaseUser) {
        setError("You must be logged in to scan for opportunities.");
        return;
    }
    if (!customUserProfile && !isLoadingAuth) {
        setError("User profile is still loading. Please try again shortly.");
        return;
    }
    if (!canMakeRequest) {
      const limitMessage = customUserProfile?.isPremiumMember
        ? "An issue occurred with your account status. Please contact support."
        : `You have used all your daily scans. Your quota will reset ${nextQuotaResetTimeDisplay || 'soon'}.`;
      setError(limitMessage);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const token = await firebaseUser.getIdToken();
      const params: Record<string, any> = {
        region: region,
        cutoff: parseFloat(cutoff) || 0.0,
        include_started_matches: includeStartedMatches,
      };
      if (sports.trim() !== '') {
        params.sports = sports.trim();
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';
      const response = await axios.get<ArbitrageResponse>(`${API_BASE_URL}/arbitrage/`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setOpportunities(response.data.opportunities.sort((a,b) => b.profit_margin_percentage - a.profit_margin_percentage));
      setLastRefreshed(new Date());

      // Record the successful request in Firestore via AuthContext
      await recordSuccessfulRequest();

    } catch (err) {
      console.error("Error fetching arbitrage opportunities:", err);
      if (axios.isAxiosError(err)) {
        if (err.response) {
            console.error("Axios Error Response Data:", err.response.data);
            console.error("Axios Error Response Status:", err.response.status);
            if (err.response.status === 401 || err.response.status === 403) {
                setError("Authentication error. Please log in again.");
            } else if (err.response.status === 429) {
                setError(`Daily request limit reached. Your quota will reset ${nextQuotaResetTimeDisplay || 'soon'}.`);
                if (refreshUserProfile) await refreshUserProfile();
            } else {
                let uiMessage = "Could not fetch opportunities. Please check parameters or try again.";
                const data = err.response.data;
                if (data && typeof data.detail === 'string') uiMessage = data.detail;
                setError(uiMessage);
            }
        } else if (err.request) {
            setError("No response from server. Check network status.");
        } else {
            setError("An error occurred setting up the request: " + err.message);
        }
      } else {
        setError("An unexpected non-Axios error occurred. Please try again.");
      }
      setOpportunities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscoverClick = () => {
    fetchOpportunities();
  };

  const openCalculatorModal = (opportunity: ArbitrageOpportunity) => {
    setSelectedOpportunityForCalc(opportunity);
    setIsModalOpen(true);
  };

  const closeCalculatorModal = () => {
    setIsModalOpen(false);
    setSelectedOpportunityForCalc(null);
  };

  // Effect to calculate stakes for the modal (remains unchanged)
  useEffect(() => {
    if (!isModalOpen || !selectedOpportunityForCalc) {
      setCalculatedStakes([]);
      return;
    }
    const numericTotalAmount = parseFloat(totalBetAmount);
    if (isNaN(numericTotalAmount) || numericTotalAmount <= 0) {
      setCalculatedStakes([]);
      return;
    }
    const { best_outcome_odds, total_implied_odds } = selectedOpportunityForCalc;
    const newCalculatedStakes: CalculatedStakeInfo[] = [];
    if (total_implied_odds <= 0 || total_implied_odds >= 100) {
        setCalculatedStakes([]);
        return;
    }
    const totalImpliedDecimal = total_implied_odds / 100;
    for (const [outcomeName, [bookmakerName, odds]] of Object.entries(best_outcome_odds)) {
      if (odds <= 0) continue;
      const individualInvestmentRatio = (1 / odds) / totalImpliedDecimal;
      const stake = numericTotalAmount * individualInvestmentRatio;
      const potentialReturn = stake * odds;
      newCalculatedStakes.push({ outcomeName, bookmakerName, odds, stake, potentialReturn });
    }
    setCalculatedStakes(newCalculatedStakes);
  }, [isModalOpen, selectedOpportunityForCalc, totalBetAmount]);


  // 1. Handle Authentication or Custom Profile Loading State
  if (isLoadingAuth || (firebaseUser && !customUserProfile && !isLoadingAuth)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          {isLoadingAuth ? "Authenticating..." : "Loading user profile..."}
        </div>
      </div>
    );
  }

  // 2. Handle Not Logged In
  if (!firebaseUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900 p-6 text-center">
        <h2 className="text-2xl font-bold text-red-500 dark:text-red-400 mb-4">Access Denied</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          You need to be logged in to access this page.
        </p>
        <Button
          onClick={() => router.push('/auth/login')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition cursor-pointer"
        >
          Go to Login
        </Button>
      </div>
    );
  }

  // 3. Handle Authenticated User who has run out of daily requests
  if (customUserProfile && !customUserProfile.isPremiumMember && !canMakeRequest) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900 p-6 text-center">
        <h2 className="text-2xl font-bold text-red-500 dark:text-red-400 mb-4">Daily Limit Reached</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          You have used your {NORMAL_USER_MAX_REQUESTS} free arbitrage scans for today.
        </p>
        {nextQuotaResetTimeDisplay && (
            <p className="text-gray-600 dark:text-gray-400 mb-1">Your requests will reset {nextQuotaResetTimeDisplay}.</p>
        )}
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Please try again later or consider upgrading for unlimited requests (feature coming soon!).
        </p>
        <Button
            variant="link"
            onClick={() => router.push('/dashboard')}
            className="mt-4 text-blue-600 dark:text-sky-400"
        >
            Back to Dashboard
        </Button>
        {refreshUserProfile && (
            <Button
                variant="outline"
                onClick={async () => await refreshUserProfile()}
                className="mt-2 text-sm"
            >
                Refresh Quota Status
            </Button>
        )}
      </div>
    );
  }

  // 4. Render main page if authorized
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900 font-sans">
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10 md:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-green-400 dark:from-blue-500 dark:via-sky-400 dark:to-green-300 pb-2">
            Arbitrage Opportunities
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto">
            Discover risk-free betting opportunities by leveraging odds discrepancies across different bookmakers.
          </p>

          {/* User status and quota display */}
          {customUserProfile && (
            <div className="mt-4 text-sm max-w-md mx-auto p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                <p className="text-md text-gray-700 dark:text-gray-300 mb-1">
                    Welcome, {customUserProfile?.displayName || firebaseUser.displayName || firebaseUser.email}!
                </p>
              {customUserProfile.isPremiumMember ? (
                <p className="font-medium text-green-600 dark:text-emerald-400">Pro Account: Unlimited Scans</p>
              ) : (
                <>
                  <p className="font-medium text-blue-600 dark:text-sky-400">
                    Daily scans remaining: <span className="font-bold">{requestsLeftToday < 0 ? 0 : requestsLeftToday}</span> / {NORMAL_USER_MAX_REQUESTS}
                  </p>
                  {requestsLeftToday <= 0 && nextQuotaResetTimeDisplay && (
                     <p className="text-xs text-gray-500 dark:text-gray-400">Next reset: {nextQuotaResetTimeDisplay}</p>
                  )}
                </>
              )}
            </div>
          )}
        </header>

        {/* Filters Section */}
        <div className="mb-8 md:mb-12 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Filter Options</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Region</label>
              <select id="region" value={region} onChange={(e) => setRegion(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-500 dark:bg-slate-700 dark:text-gray-100">
                {REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="cutoff" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min. Profit %</label>
              <input type="number" id="cutoff" value={cutoff} onChange={(e) => setCutoff(e.target.value)} min="0" max="0.99" step="0.001" placeholder="e.g., 0.01"
                     className="w-full p-2.5 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-500 dark:bg-slate-700 dark:text-gray-100"/>
            </div>
            <div>
              <label htmlFor="sports" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sports (comma-separated)</label>
              <input type="text" id="sports" value={sports} onChange={(e) => setSports(e.target.value)} placeholder="e.g., soccer_epl,basketball_nba"
                     className="w-full p-2.5 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-500 dark:bg-slate-700 dark:text-gray-100"/>
            </div>
            <div className="flex items-center h-full pt-6 sm:pt-0">
              <input id="includeStartedMatches" type="checkbox" checked={includeStartedMatches} onChange={(e) => setIncludeStartedMatches(e.target.checked)}
                     className="h-5 w-5 text-blue-600 dark:text-sky-500 border-gray-300 dark:border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-sky-500 dark:bg-slate-700"/>
              <label htmlFor="includeStartedMatches" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Include Started</label>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto">
          <AdBanner slotId={process.env.NEXT_PUBLIC_ADSENSE_ARBITRAGE_SLOT_ID!}/>
        </div>
        <div className="text-center mb-8 md:mb-12">
          <button onClick={handleDiscoverClick} disabled={isLoading || !canMakeRequest}
                  className="px-8 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-150 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mx-auto min-w-[250px]">
            {isLoading ? (<>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Scanning...</>) : ('⚡ Discover Opportunities')}
          </button>
          {lastRefreshed && !isLoading && (<p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Last
            refreshed: {timeAgo(lastRefreshed.toISOString())}</p>)}
        </div>

        {error && (<div className="mb-8 p-4 text-center text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/40 rounded-lg shadow">
          <p><strong>Error:</strong> {error}</p></div>)}

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Skeletons, No Results, and Initial State rendering */}
            {isLoading && opportunities.length === 0 && hasSearched && (Array.from({length: 6}).map((_, index) => <OpportunitySkeleton key={index}/>))}
            {!isLoading && opportunities.length === 0 && hasSearched && !error && (
              <div className="md:col-span-2 lg:col-span-3 text-center py-12">
                <svg className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h3 className="mt-2 text-xl font-semibold text-gray-700 dark:text-gray-200">No Opportunities Found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting filters or discover again soon!</p></div>)}
            {!isLoading && !hasSearched && opportunities.length === 0 && !error && (
              <div className="md:col-span-2 lg:col-span-3 text-center py-12"><h3 className="mt-2 text-xl font-semibold text-gray-700 dark:text-gray-200">Ready to find some Arbs?</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Adjust filters and click "Discover Opportunities" to start.</p></div>)}

            {/* Render Opportunities */}
            {opportunities.map((op) => (
              <div key={op.match_id} className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-transparent hover:border-sky-500 dark:hover:border-sky-400 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 leading-tight">{op.match_name}</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{op.sport_title} - {new Date(op.match_start_time_iso).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">(Starts in {op.hours_to_start.toFixed(1)} hrs)</p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-bold rounded-full text-white self-start whitespace-nowrap ${op.profit_margin_percentage >= 3 ? 'bg-green-500 dark:bg-green-600' : op.profit_margin_percentage >= 1.5 ? 'bg-yellow-500 dark:bg-yellow-600' : 'bg-orange-500 dark:bg-orange-600'}`}>
                      {op.profit_margin_percentage.toFixed(2)}%
                    </span>
                  </div>
                  <div className="space-y-2.5 mb-4">
                    {op.best_outcome_odds && Object.entries(op.best_outcome_odds).map(([outcomeName, [bookmakerName, odds]], index) => (
                        <div key={`${op.match_id}-outcome-${index}`} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700/60 rounded-md text-sm">
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-200">{outcomeName}</span>
                            <span className="block text-xs text-gray-500 dark:text-gray-400">{bookmakerName}</span>
                          </div>
                          <span className="font-semibold text-blue-600 dark:text-sky-400 text-base">{odds.toFixed(2)}</span>
                        </div>
                    ))}
                  </div>
                </div>
                <div className="mt-auto pt-3 border-t border-gray-100 dark:border-slate-700 flex justify-between items-center">
                  <p className="text-xs text-gray-400 dark:text-gray-500">Implied Odds: {(op.total_implied_odds).toFixed(2)}%</p>
                  <button onClick={() => openCalculatorModal(op)} className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-md shadow-sm transition-colors">
                    Calculator
                  </button>
                </div>
              </div>
            ))}
        </div>
      </main>

      {/* Modal and global styles */}
      <ArbitrageCalculatorModal isOpen={isModalOpen} onClose={closeCalculatorModal} opportunity={selectedOpportunityForCalc} totalAmount={totalBetAmount} onTotalAmountChange={setTotalBetAmount} stakes={calculatedStakes} />
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-modalShow { animation: fadeIn 0.3s ease-out forwards, scaleUp 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}