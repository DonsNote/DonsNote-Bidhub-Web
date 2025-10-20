'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth.api';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    // 초기 사용자 정보 가져오기
    const loadUser = async () => {
      try {
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // 인증 상태 변경 구독
    const { data: authListener } = authApi.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    // 클린업
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 메뉴 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isProfileMenuOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-profile-menu]')) {
          setIsProfileMenuOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const handleLogout = async () => {
    try {
      await authApi.signOut();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <header className="w-full border-b" style={{ borderColor: '#E5E8EB' }}>
      <div className="flex items-center justify-between" style={{ padding: '12px 40px' }}>
        {/* Left side: Logo */}
        <div className="flex items-center" style={{ gap: '32px' }}>
          {/* Logo */}
          <div className="flex items-center" style={{ gap: '16px' }}>
            <Link href="/" className="flex items-center" style={{ gap: '16px' }}>
              <div style={{ width: '16px', height: '16px' }}>
                <Image
                  src="/images/logo.svg"
                  alt="BidHub Logo"
                  width={16}
                  height={16}
                />
              </div>
              <span
                className="font-bold"
                style={{
                  fontSize: '18px',
                  lineHeight: '23px',
                  color: '#121417',
                  fontFamily: 'Work Sans'
                }}
              >
                BidHub
              </span>
            </Link>
          </div>
        </div>

        {/* Right side: Navigation + Login Button */}
        <div className="flex items-center" style={{ gap: '32px' }}>
          {/* Navigation */}
          <nav className="flex items-center justify-center" style={{ gap: '36px' }}>
            {user && (
              <Link
                href="/my-bid"
                className="font-medium"
                style={{
                  fontSize: '14px',
                  lineHeight: '21px',
                  color: '#121417',
                  fontFamily: 'Work Sans'
                }}
              >
                My Bid
              </Link>
            )}
            <Link
              href="/how-it-works"
              className="font-medium"
              style={{
                fontSize: '14px',
                lineHeight: '21px',
                color: '#121417',
                fontFamily: 'Work Sans'
              }}
            >
              How it Works
            </Link>
            <Link
              href="/contact"
              className="font-medium"
              style={{
                fontSize: '14px',
                lineHeight: '21px',
                color: '#121417',
                fontFamily: 'Work Sans'
              }}
            >
              Contact
            </Link>
          </nav>

          {/* Login / Logout Button / Icons */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {loading ? (
              <div style={{ width: '84px', height: '40px' }} />
            ) : user ? (
              <>
                {/* Notification Icon */}
                <button
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#F0F2F5',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 6.66667C15 5.34058 14.4732 4.06881 13.5355 3.13113C12.5979 2.19345 11.3261 1.66667 10 1.66667C8.67392 1.66667 7.40215 2.19345 6.46447 3.13113C5.52678 4.06881 5 5.34058 5 6.66667C5 12.5 2.5 14.1667 2.5 14.1667H17.5C17.5 14.1667 15 12.5 15 6.66667Z" stroke="#121417" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11.4417 17.5C11.2952 17.7526 11.0849 17.9622 10.8319 18.1079C10.5789 18.2537 10.292 18.3304 10 18.3304C9.70802 18.3304 9.42115 18.2537 9.16815 18.1079C8.91515 17.9622 8.70486 17.7526 8.55835 17.5" stroke="#121417" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Profile Icon with Dropdown */}
                <div style={{ position: 'relative' }} data-profile-menu>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#F0F2F5',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.6667 17.5V15.8333C16.6667 14.9493 16.3155 14.1014 15.6904 13.4763C15.0652 12.8512 14.2174 12.5 13.3334 12.5H6.66671C5.78265 12.5 4.93481 12.8512 4.30968 13.4763C3.68456 14.1014 3.33337 14.9493 3.33337 15.8333V17.5" stroke="#121417" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 9.16667C11.8409 9.16667 13.3333 7.67428 13.3333 5.83333C13.3333 3.99238 11.8409 2.5 10 2.5C8.15905 2.5 6.66667 3.99238 6.66667 5.83333C6.66667 7.67428 8.15905 9.16667 10 9.16667Z" stroke="#121417" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '48px',
                        right: '0',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        minWidth: '160px',
                        zIndex: 1000,
                        overflow: 'hidden'
                      }}
                    >
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          router.push('/account');
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '14px',
                          lineHeight: '21px',
                          color: '#121417',
                          fontFamily: 'Work Sans',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F2F5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        계정관리
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          handleLogout();
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '14px',
                          lineHeight: '21px',
                          color: '#121417',
                          fontFamily: 'Work Sans',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F2F5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link href="/login">
                <button
                  className="font-bold"
                  style={{
                    width: '84px',
                    height: '40px',
                    padding: '0 16px',
                    backgroundColor: '#268CF5',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    lineHeight: '21px',
                    fontFamily: 'Work Sans',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '15px'
                  }}
                >
                  Log In
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
