'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!isLogin && !name) {
      setError('Please enter your name');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin
        ? { email, password }
        : { name, email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        if (isLogin) {
          // Save token to localStorage
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        } else {
          setSuccess('Account created! Please login.');
          setTimeout(() => {
            setIsLogin(true);
            setSuccess('');
            setName('');
            setPassword('');
          }, 1500);
        }
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-yt-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center justify-center w-10 h-10 bg-yt-red rounded-xl">
              <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </div>
            <span className="font-bold text-xl">YourTube</span>
          </div>
          <h1 className="text-2xl font-bold mt-2">
            {isLogin ? 'Sign in' : 'Create account'}
          </h1>
          <p className="text-sm text-yt-muted mt-1">
            {isLogin ? 'to continue to YourTube' : 'to get started with YourTube'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-yt-surface2 rounded-2xl p-6 space-y-4">

          {/* Name field (register only) */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-yt-muted mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-yt-surface border border-yt-border rounded-xl px-4 py-3 text-sm placeholder-yt-muted focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-yt-muted mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Enter your email"
              className="w-full bg-yt-surface border border-yt-border rounded-xl px-4 py-3 text-sm placeholder-yt-muted focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-yt-muted mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="Enter your password"
                className="w-full bg-yt-surface border border-yt-border rounded-xl px-4 py-3 pr-12 text-sm placeholder-yt-muted focus:outline-none focus:border-blue-400 transition-colors"
              />
              <button
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-yt-muted hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {isLogin && (
              <button className="text-xs text-blue-400 hover:text-blue-300 mt-1.5 transition-colors">
                Forgot password?
              </button>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl">
              <span className="text-xs text-red-400">{error}</span>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-green-500/10 border border-green-500/20 rounded-xl">
              <CheckCircle2 size={14} className="text-green-400 flex-shrink-0" />
              <span className="text-xs text-green-400">{success}</span>
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {isLogin ? 'Sign in' : 'Create account'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-yt-border" />
            <span className="text-xs text-yt-muted">or</span>
            <div className="flex-1 h-px bg-yt-border" />
          </div>

          {/* Toggle login/register */}
          <button
            onClick={() => {
              setIsLogin(l => !l);
              setError('');
              setSuccess('');
              setName('');
              setPassword('');
            }}
            className="w-full py-3 border border-yt-border hover:bg-yt-surface rounded-xl text-sm font-medium transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-yt-muted mt-6">
          By continuing you agree to YourTube's{' '}
          <span className="text-blue-400 cursor-pointer">Terms of Service</span>
          {' '}and{' '}
          <span className="text-blue-400 cursor-pointer">Privacy Policy</span>
        </p>

      </div>
    </div>
  );
}