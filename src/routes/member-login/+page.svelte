<script>
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase';

  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  async function handleLogin(e) {
    e.preventDefault();
    error = '';
    loading = true;

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      error = authError.message;
      loading = false;
    } else {
      goto('/members');
    }
  }
</script>

<svelte:head>
  <title>Member Login — Kappa Alpha Psi® Fraternity, Inc.</title>
</svelte:head>

<div class="login-page">
  <div class="login-card">
    <div class="login-header">
      <img src="/images/kap-crest.png" alt="Kappa Alpha Psi Crest" width="64" height="70" />
      <h1>Brothers Only</h1>
      <p>Kappa Alpha Psi&reg; Fraternity, Inc.</p>
    </div>

    {#if error}
      <div class="login-error">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        {error}
      </div>
    {/if}

    <form on:submit={handleLogin}>
      <div class="form-group">
        <label for="email">Email Address</label>
        <input
          type="email"
          id="email"
          bind:value={email}
          placeholder="brother@example.com"
          required
          autocomplete="email"
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          placeholder="Enter your password"
          required
          autocomplete="current-password"
        />
      </div>

      <button type="submit" class="login-btn" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>

    <div class="login-footer">
      <a href="/members/forgot-password">Forgot your password?</a>
      <p>Access restricted to initiated members of Kappa Alpha Psi&reg; Fraternity, Inc.</p>
    </div>
  </div>
</div>

<style>
  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #B71530 0%, #E51937 30%, #1a1a2e 100%);
    padding: 24px;
    font-family: 'Inter', system-ui, sans-serif;
  }

  .login-card {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    padding: 48px 40px;
    width: 100%;
    max-width: 420px;
  }

  .login-header {
    text-align: center;
    margin-bottom: 32px;
  }

  .login-header img {
    margin-bottom: 16px;
    border-radius: 4px;
  }

  .login-header h1 {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.75rem;
    font-weight: 700;
    color: #1F2937;
    margin: 0 0 4px;
  }

  .login-header p {
    color: #6B7280;
    font-size: 0.85rem;
    margin: 0;
  }

  .login-error {
    background: #FEF2F2;
    border: 1px solid #FECACA;
    color: #991B1B;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 0.85rem;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 6px;
  }

  .form-group input {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid #D1D5DB;
    border-radius: 8px;
    font-size: 0.95rem;
    font-family: inherit;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }

  .form-group input:focus {
    outline: none;
    border-color: #E51937;
    box-shadow: 0 0 0 3px rgba(229,25,55,0.1);
  }

  .login-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #E51937, #B71530);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: opacity 0.2s, transform 0.1s;
  }

  .login-btn:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .login-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .login-footer {
    text-align: center;
    margin-top: 24px;
  }

  .login-footer a {
    color: #E51937;
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 500;
  }

  .login-footer a:hover {
    text-decoration: underline;
  }

  .login-footer p {
    color: #9CA3AF;
    font-size: 0.75rem;
    margin-top: 16px;
    line-height: 1.4;
  }

  @media (max-width: 480px) {
    .login-card {
      padding: 32px 24px;
    }
  }
</style>
