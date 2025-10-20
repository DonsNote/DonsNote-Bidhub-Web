'use client';

import Header from '@/components/Header';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth.api';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 유효성 검사
    if (!fullName.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    if (!agreeTerms) {
      setError('약관에 동의해주세요.');
      return;
    }

    setLoading(true);

    try {
      await authApi.signUpWithEmail(email, password, fullName);
      alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      router.push('/login');
    } catch (err: any) {
      setError(err.message || '회원가입에 실패했습니다.');
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
        <form onSubmit={handleSignUp}>
          <div
            className="flex flex-col justify-center items-center"
            style={{
              width: '960px',
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
              Create your account
            </h1>
          </div>

          {/* Full Name Field */}
          <div
            style={{
              width: '480px',
              padding: '12px 16px'
            }}
          >
            <div className="flex flex-col">
              <div
                className="flex flex-col"
                style={{
                  alignSelf: 'stretch',
                  paddingBottom: '8px'
                }}
              >
                <label
                  className="font-medium"
                  style={{
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: '#121417',
                    fontFamily: 'Work Sans'
                  }}
                >
                  Full Name
                </label>
              </div>
              <div
                className="flex items-center"
                style={{
                  alignSelf: 'stretch',
                  padding: '16px',
                  backgroundColor: '#F0F2F5',
                  borderRadius: '8px',
                  height: '56px'
                }}
              >
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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
                  className="placeholder:text-[#61758A]"
                />
              </div>
            </div>
          </div>

          {/* Email Address Field */}
          <div
            style={{
              width: '480px',
              padding: '12px 16px'
            }}
          >
            <div className="flex flex-col">
              <div
                className="flex flex-col"
                style={{
                  alignSelf: 'stretch',
                  paddingBottom: '8px'
                }}
              >
                <label
                  className="font-medium"
                  style={{
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: '#121417',
                    fontFamily: 'Work Sans'
                  }}
                >
                  Email Address
                </label>
              </div>
              <div
                className="flex items-center"
                style={{
                  alignSelf: 'stretch',
                  padding: '16px',
                  backgroundColor: '#F0F2F5',
                  borderRadius: '8px',
                  height: '56px'
                }}
              >
                <input
                  type="email"
                  placeholder="Enter your email address"
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
                  className="placeholder:text-[#61758A]"
                />
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div
            style={{
              width: '480px',
              padding: '12px 16px'
            }}
          >
            <div className="flex flex-col">
              <div
                className="flex flex-col"
                style={{
                  alignSelf: 'stretch',
                  paddingBottom: '8px'
                }}
              >
                <label
                  className="font-medium"
                  style={{
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: '#121417',
                    fontFamily: 'Work Sans'
                  }}
                >
                  Password
                </label>
              </div>
              <div
                className="flex items-center"
                style={{
                  alignSelf: 'stretch',
                  padding: '16px',
                  backgroundColor: '#F0F2F5',
                  borderRadius: '8px',
                  height: '56px'
                }}
              >
                <input
                  type="password"
                  placeholder="Create a password"
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
                  className="placeholder:text-[#61758A]"
                />
              </div>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div
            style={{
              width: '480px',
              padding: '12px 16px'
            }}
          >
            <div className="flex flex-col">
              <div
                className="flex flex-col"
                style={{
                  alignSelf: 'stretch',
                  paddingBottom: '8px'
                }}
              >
                <label
                  className="font-medium"
                  style={{
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: '#121417',
                    fontFamily: 'Work Sans'
                  }}
                >
                  Confirm Password
                </label>
              </div>
              <div
                className="flex items-center"
                style={{
                  alignSelf: 'stretch',
                  padding: '16px',
                  backgroundColor: '#F0F2F5',
                  borderRadius: '8px',
                  height: '56px'
                }}
              >
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  className="placeholder:text-[#61758A]"
                />
              </div>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div
            className="flex flex-col"
            style={{
              justifyContent: 'stretch',
              alignItems: 'stretch',
              padding: '0 16px',
              width: '480px'
            }}
          >
            <div
              className="flex"
              style={{
                alignSelf: 'stretch',
                gap: '12px',
                padding: '12px 0'
              }}
            >
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid #DBE0E5',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              />
              <div className="flex flex-col">
                <p
                  style={{
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: '#121417',
                    fontFamily: 'Work Sans'
                  }}
                >
                  I agree to the Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                width: '480px',
                padding: '0 16px'
              }}
            >
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
            </div>
          )}

          {/* Sign Up Button */}
          <div
            style={{
              width: '480px',
              padding: '12px 16px'
            }}
          >
            <button
              type="submit"
              disabled={loading}
              className="flex justify-center items-center font-bold"
              style={{
                width: '100%',
                padding: '0 20px',
                height: '40px',
                backgroundColor: loading ? '#A0A0A0' : '#268CF5',
                borderRadius: '8px',
                fontSize: '16px',
                lineHeight: '24px',
                color: '#FFFFFF',
                fontFamily: 'Work Sans',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>

          {/* Already have account */}
          <div
            style={{
              width: '480px',
              padding: '12px 16px',
              textAlign: 'center'
            }}
          >
            <p
              style={{
                fontSize: '14px',
                lineHeight: '21px',
                color: '#61758A',
                fontFamily: 'Work Sans'
              }}
            >
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#268CF5', cursor: 'pointer', textDecoration: 'none' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
        </form>
      </main>
    </div>
  );
}
