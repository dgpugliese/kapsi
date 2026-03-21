'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function MemberLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setSubmitting(false);
    } else {
      router.push('/members/');
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg" aria-hidden="true" />
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <img src="/images/kap-crest.png" alt="" width={64} height={70} className="login-crest" />
            <h1>Brothers Only</h1>
            <p>Sign in to your member portal</p>
          </div>

          {error && (
            <div className="login-error">{error}</div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                autoComplete="email"
                placeholder="brother@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn--primary login-btn" disabled={submitting}>
              <span className="login-btn-text" style={{ display: submitting ? 'none' : 'inline' }}>
                Sign In
              </span>
              <span className="login-btn-loading" style={{ display: submitting ? 'inline' : 'none' }}>
                Signing in...
              </span>
            </button>
          </form>

          <div className="login-footer">
            <p>Access is restricted to initiated members of Kappa Alpha Psi&reg; Fraternity, Inc.</p>
            <a href="/contact/need-assistance">Need assistance with your account?</a>
          </div>
        </div>
      </div>
    </div>
  );
}
