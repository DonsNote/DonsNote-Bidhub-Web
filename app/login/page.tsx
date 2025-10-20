'use client';

import Header from '@/components/Header';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth.api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authApi.signInWithEmail(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <Header />

      {/* Main Content */}
      <main
        className="flex justify-center"
        style={{
          padding: '20px 160px',
          alignSelf: 'stretch'
        }}
      >
        <div
          className="flex flex-col"
          style={{
            width: '960px',
            height: '695px',
            padding: '20px 0'
          }}
        >
          {/* Title */}
          <div
            className="flex flex-col items-center"
            style={{
              alignSelf: 'stretch',
              padding: '20px 16px 12px'
            }}
          >
            <h1
              className="font-bold"
              style={{
                fontSize: '28px',
                lineHeight: '35px',
                color: '#121417',
                fontFamily: 'Work Sans',
                textAlign: 'center'
              }}
            >
              Join BidSwap
            </h1>
          </div>

          {/* Social Login Buttons */}
          <div
            className="flex justify-center"
            style={{
              alignSelf: 'stretch'
            }}
          >
            <div
              className="flex flex-col"
              style={{
                width: '480px',
                gap: '12px',
                padding: '12px 16px'
              }}
            >
              {/* Apple Button */}
              <button
                className="flex justify-center items-center font-bold"
                style={{
                  width: '100%',
                  padding: '0 16px',
                  backgroundColor: '#F0F2F5',
                  borderRadius: '8px',
                  height: '40px',
                  fontSize: '14px',
                  lineHeight: '21px',
                  color: '#121417',
                  fontFamily: 'Work Sans',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Continue with Apple
              </button>

              {/* SearchEngineCo Button */}
              <button
                className="flex justify-center items-center font-bold"
                style={{
                  width: '100%',
                  padding: '0 16px',
                  backgroundColor: '#F0F2F5',
                  borderRadius: '8px',
                  height: '40px',
                  fontSize: '14px',
                  lineHeight: '21px',
                  color: '#121417',
                  fontFamily: 'Work Sans',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Continue with SearchEngineCo
              </button>

              {/* GreenLine Button */}
              <button
                className="flex justify-center items-center font-bold"
                style={{
                  width: '100%',
                  padding: '0 16px',
                  backgroundColor: '#F0F2F5',
                  borderRadius: '8px',
                  height: '40px',
                  fontSize: '14px',
                  lineHeight: '21px',
                  color: '#121417',
                  fontFamily: 'Work Sans',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Continue with GreenLine
              </button>

              {/* BrownTalk Button */}
              <button
                className="flex justify-center items-center font-bold"
                style={{
                  width: '100%',
                  padding: '0 16px',
                  backgroundColor: '#F0F2F5',
                  borderRadius: '8px',
                  height: '40px',
                  fontSize: '14px',
                  lineHeight: '21px',
                  color: '#121417',
                  fontFamily: 'Work Sans',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Continue with BrownTalk
              </button>
            </div>
          </div>

          {/* Or Divider */}
          <div
            className="flex flex-col items-center"
            style={{
              alignSelf: 'stretch',
              padding: '4px 16px 12px'
            }}
          >
            <p
              style={{
                fontSize: '14px',
                lineHeight: '21px',
                color: '#61758A',
                fontFamily: 'Work Sans',
                textAlign: 'center'
              }}
            >
              or
            </p>
          </div>

          {/* Email/Password Login Form */}
          <form onSubmit={handleEmailLogin}>
            <div
              className="flex justify-center"
              style={{
                alignSelf: 'stretch'
              }}
            >
              <div
                className="flex flex-col"
                style={{
                  width: '480px',
                  gap: '12px',
                  padding: '12px 16px'
                }}
              >
                {/* Email Input */}
                <div
                  className="flex items-center"
                  style={{
                    height: '56px',
                    backgroundColor: '#F0F2F5',
                    borderRadius: '8px',
                    padding: '0 16px'
                  }}
                >
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      backgroundColor: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '16px',
                      lineHeight: '24px',
                      color: '#121417',
                      fontFamily: 'Work Sans'
                    }}
                  />
                </div>

                {/* Password Input */}
                <div
                  className="flex items-center"
                  style={{
                    height: '56px',
                    backgroundColor: '#F0F2F5',
                    borderRadius: '8px',
                    padding: '0 16px'
                  }}
                >
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      backgroundColor: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '16px',
                      lineHeight: '24px',
                      color: '#121417',
                      fontFamily: 'Work Sans'
                    }}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <p
                    style={{
                      fontSize: '14px',
                      lineHeight: '21px',
                      color: '#FF0000',
                      fontFamily: 'Work Sans',
                      textAlign: 'center'
                    }}
                  >
                    {error}
                  </p>
                )}

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex justify-center items-center font-bold"
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 16px',
                    backgroundColor: loading ? '#A0A0A0' : '#268CF5',
                    borderRadius: '8px',
                    fontSize: '14px',
                    lineHeight: '21px',
                    color: '#FFFFFF',
                    fontFamily: 'Work Sans',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
            </div>
          </form>

          {/* Don't have account */}
          <div
            className="flex flex-col items-center"
            style={{
              alignSelf: 'stretch',
              padding: '4px 16px 12px'
            }}
          >
            <p
              style={{
                fontSize: '14px',
                lineHeight: '21px',
                color: '#61758A',
                fontFamily: 'Work Sans',
                textAlign: 'center'
              }}
            >
              Don't have an account?{' '}
              <Link href="/signup" style={{ color: '#268CF5', cursor: 'pointer', textDecoration: 'none' }}>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
