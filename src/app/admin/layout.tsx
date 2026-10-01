'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [inputToken, setInputToken] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Check URL parameters, sessionStorage, or test verify endpoint
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token') || params.get('key');
    const storedToken = sessionStorage.getItem('admin_portal_token') || sessionStorage.getItem('posts_portal_token');
    const activeToken = urlToken || storedToken || '';

    if (activeToken) {
      verifyToken(activeToken);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  async function verifyToken(tokenToTest: string) {
    setIsVerifying(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenToTest }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_portal_token', tokenToTest);
        sessionStorage.setItem('posts_portal_token', tokenToTest);
      } else {
        setIsAuthenticated(false);
        setAuthError('Access denied: Invalid admin secret passphrase.');
      }
    } catch (err: any) {
      setIsAuthenticated(false);
      setAuthError('Connection error verifying credentials: ' + err.message);
    } finally {
      setIsVerifying(false);
    }
  }

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inputToken.trim()) return;
    verifyToken(inputToken.trim());
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_portal_token');
    sessionStorage.removeItem('posts_portal_token');
    setIsAuthenticated(false);
    setInputToken('');
  }

  // Loading initial state check
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#070b0f] flex flex-col items-center justify-center font-mono text-xs text-neon">
        <div className="animate-spin text-lg mb-3">⟳</div>
        <p>[ CHECKING ADMIN AUTHORIZATION MATRIX... ]</p>
      </div>
    );
  }

  // Not authenticated: Show Cyber Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070b0f] text-gray-200 font-mono flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-neon selection:text-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md border border-red-500/40 bg-[#0d131a] p-6 sm:p-8 shadow-2xl space-y-6"
        >
          {/* Lock header */}
          <div className="text-center space-y-2 border-b border-border/60 pb-5">
            <div className="w-12 h-12 rounded-full border border-red-500/60 bg-red-950/20 text-red-400 flex items-center justify-center mx-auto text-xl font-bold">
              🔒
            </div>
            <span className="text-[11px] text-red-400 font-bold uppercase tracking-widest block">
              [ ACCESS RESTRICTED // ADMIN GATE ]
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              Portfolio Command Hub
            </h1>
            <p className="text-xs text-gray-400 leading-relaxed">
              This route is protected. Enter your administrator passphrase to access project ingestion and database controls.
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {authError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-red-950/40 border border-red-500/50 text-red-300 text-xs leading-relaxed"
              >
                ⚠ {authError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Admin Secret Key:
              </label>
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter secret passphrase"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                className="w-full bg-[#05080c] border border-border/60 px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-neon transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying || !inputToken.trim()}
              className="w-full py-3 bg-neon text-black font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(113,252,123,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <span className="animate-spin inline-block">⟳</span>
                  <span>VERIFYING CREDENTIALS...</span>
                </>
              ) : (
                <span>UNLOCK ADMIN PORTAL →</span>
              )}
            </button>
          </form>

          <div className="pt-2 text-center border-t border-border/40">
            <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              ← Return to Public Portfolio
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Authenticated: Render Admin Pages with Global Security Header
  return (
    <div className="min-h-screen bg-[#070b0f] text-gray-200">
      {/* Top Security Status Bar */}
      <div className="bg-[#040608] border-b border-border/60 px-4 sm:px-8 py-2 text-xs font-mono flex items-center justify-between text-gray-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-neon font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-neon led-blink" />
            <span>ADMIN SESSION ACTIVE</span>
          </span>
          <span className="text-border hidden sm:inline">•</span>
          <Link href="/admin" className="hover:text-white hidden sm:inline transition-colors">
            Hub
          </Link>
          <span className="text-border hidden sm:inline">•</span>
          <Link href="/admin/add-project" className="hover:text-white hidden sm:inline transition-colors">
            Add Project
          </Link>
          <span className="text-border hidden sm:inline">•</span>
          <Link href="/admin/posts-sync" className="hover:text-white hidden sm:inline transition-colors">
            Posts Sync
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-gray-300 transition-colors">
            [ Exit to Site ]
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 border border-red-500/30 px-2 py-0.5 hover:bg-red-950/30 transition-colors"
          >
            [ Lock / Logout ]
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}
