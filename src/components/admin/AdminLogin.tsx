import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { BrandLogo } from '../common/BrandLogo';
import { ShieldCheck, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onExit: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onExit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = authService.login(username.trim(), password.trim());
      if (result.success) {
        onLoginSuccess();
      } else {
        setError(result.error || 'Authentication failed. Please check your credentials.');
        setIsLoading(false);
      }
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-[#E2ECE3] selection:text-[#192E22]">
      {/* Background organic subtle pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#192E22_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Back to store navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onExit}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4D5650] hover:text-[#192E22] transition-colors cursor-pointer bg-white/70 hover:bg-white px-3 py-1.5 rounded-lg border border-[#E3E1D7] shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Earth Smile Store</span>
          </button>
          <div className="flex items-center gap-1 text-[11px] font-mono text-[#5C665F]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D4E]" />
            <span>Staff Security</span>
          </div>
        </div>

        {/* Brand identity header */}
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <BrandLogo variant="dark" size="lg" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#192E22] tracking-tight">
            Administrator Portal
          </h1>
          <p className="mt-1.5 text-xs text-[#5C665F]">
            Authorized management for commercial orders and client requirements.
          </p>
        </div>

        {/* Login Form Box */}
        <div className="mt-8 bg-white py-8 px-6 sm:px-10 shadow-xl border border-[#E5E4DC] rounded-2xl relative overflow-hidden">
          {/* Subtle top brand accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#192E22] via-[#BD7B3C] to-[#192E22]" />

          {error && (
            <div className="mb-6 bg-red-50/80 border border-red-200 text-red-700 px-3.5 py-3 rounded-xl text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Access Denied</p>
                <p className="mt-0.5 text-red-700/90 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#192E22] uppercase tracking-wider mb-1.5 font-mono">
                Administrator User ID
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter User ID"
                  className="block w-full pl-9 pr-3 py-2.5 text-sm bg-[#FAF9F5] border border-[#DEDCCE] rounded-lg text-[#192E22] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#192E22] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#192E22] uppercase tracking-wider font-mono">
                  Administrator Password
                </label>
              </div>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="block w-full pl-9 pr-10 py-2.5 text-sm bg-[#FAF9F5] border border-[#DEDCCE] rounded-lg text-[#192E22] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#192E22] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-white bg-[#192E22] hover:bg-[#234230] active:scale-99 rounded-lg shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <span>Log In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security badge footer */}
        <p className="mt-6 text-center text-[11px] text-[#7A857D] font-mono flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 text-[#BD7B3C]" />
          <span>Encrypted Session • Earth Smile Dental Care Corp</span>
        </p>
      </div>
    </div>
  );
};
