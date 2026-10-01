'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PostsSyncPortal() {
  const [token, setToken] = useState('');
  const [inputToken, setInputToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [postsText, setPostsText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Current store state
  const [postsDoc, setPostsDoc] = useState<any>(null);
  const [currentSummary, setCurrentSummary] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);

  // Initialize token from URL or storage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token') || params.get('key');
    const storedToken = sessionStorage.getItem('posts_portal_token');
    const activeToken = urlToken || storedToken || '';

    if (activeToken) {
      setToken(activeToken);
      verifyAndFetch(activeToken);
    } else {
      setIsFetching(false);
    }
  }, []);

  async function verifyAndFetch(authToken: string) {
    setIsFetching(true);
    setAuthError('');
    try {
      const res = await fetch(`/api/posts-sync?token=${encodeURIComponent(authToken)}`);
      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        sessionStorage.setItem('posts_portal_token', authToken);
        setPostsDoc(data.postsDoc);
        setCurrentSummary(data.currentSummary);
        if (data.postsDoc?.rawText) {
          setPostsText(data.postsDoc.rawText);
        }
      } else {
        setIsAuthenticated(false);
        setAuthError('Invalid access token. Please enter your portal secret.');
      }
    } catch (err: any) {
      setAuthError('Connection error: ' + err.message);
    } finally {
      setIsFetching(false);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!inputToken.trim()) return;
    setToken(inputToken.trim());
    verifyAndFetch(inputToken.trim());
  }

  async function handleKeepExisting() {
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/posts-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, action: 'keep_existing' }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: 'success',
          text: 'Confirmed! Your current resume summary will remain active. Next monthly reminder in 30 days.',
        });
        await verifyAndFetch(token);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update status.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegenerate() {
    if (!postsText.trim()) {
      setMessage({ type: 'error', text: 'Please paste bulk posts text before generating summary.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/posts-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          action: 'regenerate',
          postsText: postsText.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: 'success',
          text: `Success! ${data.message || 'Analyzed bulk posts with Gemini and updated your resume summary.'}`,
        });
        await verifyAndFetch(token);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to process bulk posts.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  }

  // Login Screen if not authenticated
  if (!isAuthenticated && !isFetching) {
    return (
      <main className="min-h-screen bg-[#0b0f14] text-gray-200 flex items-center justify-center p-4 font-mono">
        <div className="w-full max-w-md bg-[#121820] border border-cyan-500/30 rounded-lg p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-xs uppercase text-cyan-400 font-bold tracking-wider">Secure Access</span>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">LinkedIn Posts Portal</h1>
          <p className="text-xs text-gray-400 mb-6">
            Enter your portal secret key to manage bulk posts, sync monthly updates, or confirm your summary.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-1">Access Token / Secret</label>
              <input
                type="password"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                placeholder="Enter secret..."
                className="w-full bg-[#0b0f14] border border-gray-700 focus:border-cyan-400 rounded px-3 py-2 text-sm text-white outline-none"
                autoFocus
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-950/60 border border-red-700/60 text-red-300 text-xs rounded">
                ⚠️ {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase rounded transition-colors"
            >
              Authenticate &amp; Open Portal
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0f14] text-gray-200 font-mono py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-800 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs uppercase text-emerald-400 font-bold tracking-wider">
                Authenticated Admin Session
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white">LinkedIn Posts &amp; Resume Sync Portal</h1>
            <p className="text-xs text-gray-400 mt-1">
              Upload offline scraped LinkedIn posts in bulk or preserve your existing resume summary.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/resume"
              target="_blank"
              className="px-4 py-2 border border-gray-700 hover:border-cyan-400 text-xs text-gray-300 hover:text-white rounded transition-colors"
            >
              📄 View Live Resume ↗
            </Link>
            <button
              onClick={() => {
                sessionStorage.removeItem('posts_portal_token');
                setIsAuthenticated(false);
              }}
              className="px-3 py-2 border border-red-900/60 hover:bg-red-950/40 text-xs text-red-400 rounded transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Sync Status Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#121820] border border-gray-800 p-4 rounded-lg">
            <div className="text-xs text-gray-500 uppercase mb-1">Monthly Status</div>
            <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
              <span>●</span> {postsDoc?.reviewStatus === 'up-to-date' ? 'Up to Date' : (postsDoc?.reviewStatus || 'Ready')}
            </div>
          </div>
          <div className="bg-[#121820] border border-gray-800 p-4 rounded-lg">
            <div className="text-xs text-gray-500 uppercase mb-1">Last Update Date</div>
            <div className="text-sm font-bold text-white">
              {postsDoc?.lastUpdated ? new Date(postsDoc.lastUpdated).toLocaleDateString('en-IN') : 'Baseline Active'}
            </div>
          </div>
          <div className="bg-[#121820] border border-gray-800 p-4 rounded-lg">
            <div className="text-xs text-gray-500 uppercase mb-1">Parsed Post Updates</div>
            <div className="text-sm font-bold text-cyan-400">
              {postsDoc?.postsCount || 0} Posts Indexed
            </div>
          </div>
        </div>

        {/* Alerts / Messages */}
        {message && (
          <div
            className={`p-4 rounded-lg text-sm border flex items-start justify-between ${
              message.type === 'success'
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
                : 'bg-red-950/50 border-red-500/50 text-red-200'
            }`}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="text-xs text-gray-400 hover:text-white ml-4">
              ✕
            </button>
          </div>
        )}

        {/* Main Bulk Input Section */}
        <div className="bg-[#121820] border border-gray-800 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <span>📥</span> Offline Scraped LinkedIn Posts (Bulk Text)
            </label>
            <span className="text-xs text-gray-500">
              {postsText.length} characters • ~{postsText.split(/\n{3,}|---|___/).filter(p => p.trim().length > 20).length} items
            </span>
          </div>

          <textarea
            value={postsText}
            onChange={(e) => setPostsText(e.target.value)}
            rows={14}
            placeholder={`Paste your scraped LinkedIn posts, articles, and milestone updates here...

Example format:
---
Announced Balipu Club MVP event registration platform with live QR scanner and admin dashboards. Built with Next.js and Firebase.
---
Finished implementation of PixelCypher: an LSB image steganography tool capable of encrypting secret messages into PNG pixels with a companion Python Flask API.
---
Published Arduino open-source library for controlling 7-segment displays without external ICs.
---`}
            className="w-full bg-[#0b0f14] border border-gray-700 focus:border-cyan-400 rounded-lg p-4 text-xs md:text-sm text-gray-200 font-mono leading-relaxed outline-none resize-y"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              onClick={handleRegenerate}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold text-xs uppercase rounded transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  Processing with Gemini AI...
                </>
              ) : (
                '🚀 Process & Update Resume Summary with Gemini'
              )}
            </button>

            <button
              onClick={handleKeepExisting}
              disabled={isLoading}
              className="w-full sm:w-auto px-5 py-3 bg-transparent hover:bg-gray-800 border border-gray-700 text-gray-300 hover:text-white font-medium text-xs rounded transition-colors"
            >
              ⏩ Continue with Same Old Summary (No New Posts)
            </button>
          </div>
        </div>

        {/* Live Resume Summary Preview */}
        {currentSummary && (
          <div className="bg-[#121820] border border-gray-800 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>📄</span> Currently Active Resume Summary (Section 1)
              </h2>
              <span className="text-xs text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                Live on Website
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-500 uppercase">Title:</span>
                <p className="text-sm font-semibold text-white">{currentSummary.title}</p>
              </div>

              <div>
                <span className="text-xs text-gray-500 uppercase">Summary:</span>
                <p className="text-xs md:text-sm text-gray-300 leading-relaxed bg-[#0b0f14] p-3 rounded border border-gray-800">
                  {currentSummary.summary}
                </p>
              </div>

              {currentSummary.highlights && currentSummary.highlights.length > 0 && (
                <div>
                  <span className="text-xs text-gray-500 uppercase">Key Competency Highlights:</span>
                  <ul className="mt-2 space-y-1.5">
                    {currentSummary.highlights.map((h: string, i: number) => (
                      <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                        <span className="text-cyan-400">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
