'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth.api';
import { bidApi, Bid, Listing } from '@/lib/api/bid.api';
import Header from '@/components/Header';

export default function MyBidPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [biddingHistory, setBiddingHistory] = useState<Bid[]>([]);
  const [myListings, setMyListings] = useState<Listing[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await authApi.getCurrentUser();
        if (!currentUser) {
          router.push('/login');
          return;
        }
        setUser(currentUser);

        // Fetch bidding history and listings
        const [bids, listings] = await Promise.all([
          bidApi.getMyBids(currentUser.id),
          bidApi.getMyListings(currentUser.id)
        ]);

        setBiddingHistory(bids);
        setMyListings(listings);
      } catch (error) {
        console.error('Error loading data:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  // Helper function to format time left
  const formatTimeLeft = (endTime: string | null) => {
    if (!endTime) return 'Ended';

    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else {
      return `${hours}h`;
    }
  };

  // Helper function to format price
  const formatPrice = (price: number) => {
    return `₩${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
        <Header />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <p style={{ fontSize: '16px', color: '#61758A' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <Header />

      <main style={{ padding: '20px 160px' }}>
        {/* Page Title */}
        <div style={{ padding: '16px', marginBottom: '4px' }}>
          <h1
            style={{
              fontSize: '32px',
              lineHeight: '40px',
              fontWeight: 700,
              color: '#121417',
              fontFamily: 'Work Sans',
              margin: 0
            }}
          >
            My Activity
          </h1>
        </div>

        {/* Bidding History Section */}
        <section>
          <div style={{ padding: '20px 16px 12px' }}>
            <h2
              style={{
                fontSize: '22px',
                lineHeight: '28px',
                fontWeight: 700,
                color: '#121417',
                fontFamily: 'Work Sans',
                margin: 0
              }}
            >
              Bidding History
            </h2>
          </div>

          <div style={{ padding: '12px 16px' }}>
            <div
              style={{
                border: '1px solid #DBE0E5',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#FFFFFF'
              }}
            >
              {/* Table Header */}
              <div
                style={{
                  display: 'flex',
                  backgroundColor: '#FFFFFF',
                  borderBottom: '1px solid #E5E8EB'
                }}
              >
                <div style={{ width: '72px', padding: '12px 16px' }}></div>
                <div style={{ width: '200px', padding: '12px 16px' }}>
                  <span
                    style={{
                      fontSize: '14px',
                      lineHeight: '21px',
                      fontWeight: 500,
                      color: '#121417',
                      fontFamily: 'Work Sans'
                    }}
                  >
                    Item
                  </span>
                </div>
                <div style={{ width: '159px', padding: '12px 16px' }}>
                  <span
                    style={{
                      fontSize: '14px',
                      lineHeight: '21px',
                      fontWeight: 500,
                      color: '#121417',
                      fontFamily: 'Work Sans'
                    }}
                  >
                    Status
                  </span>
                </div>
                <div style={{ width: '189px', padding: '12px 16px' }}>
                  <span
                    style={{
                      fontSize: '14px',
                      lineHeight: '21px',
                      fontWeight: 500,
                      color: '#121417',
                      fontFamily: 'Work Sans'
                    }}
                  >
                    Current Bid
                  </span>
                </div>
                <div style={{ width: '176px', padding: '12px 16px' }}>
                  <span
                    style={{
                      fontSize: '14px',
                      lineHeight: '21px',
                      fontWeight: 500,
                      color: '#121417',
                      fontFamily: 'Work Sans'
                    }}
                  >
                    Time Left
                  </span>
                </div>
                <div style={{ width: '130px', padding: '12px 16px' }}>
                  <span
                    style={{
                      fontSize: '14px',
                      lineHeight: '21px',
                      fontWeight: 500,
                      color: '#61758A',
                      fontFamily: 'Work Sans'
                    }}
                  >
                    Action
                  </span>
                </div>
              </div>

              {/* Table Body */}
              {biddingHistory.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    borderTop: '1px solid #E5E8EB',
                    minHeight: '72px'
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      padding: '8px 16px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '20px',
                        backgroundColor: '#F0F2F5'
                      }}
                    />
                  </div>

                  {/* Item Name */}
                  <div
                    style={{
                      width: '200px',
                      height: '72px',
                      padding: '8px 16px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '14px',
                        lineHeight: '21px',
                        fontWeight: 400,
                        color: '#121417',
                        fontFamily: 'Work Sans'
                      }}
                    >
                      {item.name}
                    </span>
                  </div>

                  {/* Status */}
                  <div
                    style={{
                      width: '159px',
                      height: '72px',
                      padding: '8px 16px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: '#F0F2F5',
                        borderRadius: '8px',
                        padding: '0 16px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '14px',
                          lineHeight: '21px',
                          fontWeight: 500,
                          color: '#121417',
                          fontFamily: 'Work Sans'
                        }}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Current Bid */}
                  <div
                    style={{
                      width: '189px',
                      height: '72px',
                      padding: '8px 16px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '14px',
                        lineHeight: '21px',
                        fontWeight: 400,
                        color: '#61758A',
                        fontFamily: 'Work Sans'
                      }}
                    >
                      {formatPrice(item.currentBid)}
                    </span>
                  </div>

                  {/* Time Left */}
                  <div
                    style={{
                      width: '176px',
                      height: '72px',
                      padding: '8px 16px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '14px',
                        lineHeight: '21px',
                        fontWeight: 400,
                        color: '#61758A',
                        fontFamily: 'Work Sans'
                      }}
                    >
                      {formatTimeLeft(item.timeLeft)}
                    </span>
                  </div>

                  {/* Action */}
                  <div
                    style={{
                      width: '130px',
                      height: '72px',
                      padding: '8px 16px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {item.canRebid && (
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '14px',
                          lineHeight: '21px',
                          fontWeight: 700,
                          color: '#61758A',
                          fontFamily: 'Work Sans',
                          cursor: 'pointer'
                        }}
                      >
                        Rebid
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* My Listings Section */}
        <section style={{ marginTop: '8px' }}>
          <div style={{ padding: '20px 16px 12px' }}>
            <h2
              style={{
                fontSize: '22px',
                lineHeight: '28px',
                fontWeight: 700,
                color: '#121417',
                fontFamily: 'Work Sans',
                margin: 0
              }}
            >
              My Listings
            </h2>
          </div>

          <div style={{ padding: '12px 16px' }}>
            <div
              style={{
                border: '1px solid #DBE0E5',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#FFFFFF'
              }}
            >
              {/* Table Header */}
              <div
                style={{
                  display: 'flex',
                  backgroundColor: '#FFFFFF',
                  borderBottom: '1px solid #E5E8EB'
                }}
              >
                <div style={{ width: '72px', padding: '12px 16px' }}></div>
                <div style={{ width: '237px', padding: '12px 16px' }}>
                  <span
                    style={{
                      fontSize: '14px',
                      lineHeight: '21px',
                      fontWeight: 500,
                      color: '#121417',
                      fontFamily: 'Work Sans'
                    }}
                  >
                    Item
                  </span>
                </div>
                <div style={{ width: '225px', padding: '12px 16px' }}>
                  <span
                    style={{
                      fontSize: '14px',
                      lineHeight: '21px',
                      fontWeight: 500,
                      color: '#121417',
                      fontFamily: 'Work Sans'
                    }}
                  >
                    Highest Bid
                  </span>
                </div>
                <div style={{ width: '220px', padding: '12px 16px' }}>
                  <span
                    style={{
                      fontSize: '14px',
                      lineHeight: '21px',
                      fontWeight: 500,
                      color: '#121417',
                      fontFamily: 'Work Sans'
                    }}
                  >
                    Time Left
                  </span>
                </div>
                <div style={{ width: '171px', padding: '12px 16px' }}>
                  <span
                    style={{
                      fontSize: '14px',
                      lineHeight: '21px',
                      fontWeight: 500,
                      color: '#121417',
                      fontFamily: 'Work Sans'
                    }}
                  >
                    Status
                  </span>
                </div>
              </div>

              {/* Table Body */}
              {myListings.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    borderTop: '1px solid #E5E8EB',
                    minHeight: '72px'
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      padding: '8px 16px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '20px',
                        backgroundColor: '#F0F2F5'
                      }}
                    />
                  </div>

                  {/* Item Name */}
                  <div
                    style={{
                      width: '237px',
                      height: '72px',
                      padding: '8px 16px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '14px',
                        lineHeight: '21px',
                        fontWeight: 400,
                        color: '#121417',
                        fontFamily: 'Work Sans'
                      }}
                    >
                      {item.name}
                    </span>
                  </div>

                  {/* Highest Bid */}
                  <div
                    style={{
                      width: '225px',
                      height: '72px',
                      padding: '8px 16px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '14px',
                        lineHeight: '21px',
                        fontWeight: 400,
                        color: '#61758A',
                        fontFamily: 'Work Sans'
                      }}
                    >
                      {formatPrice(item.highestBid)}
                    </span>
                  </div>

                  {/* Time Left */}
                  <div
                    style={{
                      width: '220px',
                      height: '72px',
                      padding: '8px 16px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '14px',
                        lineHeight: '21px',
                        fontWeight: 400,
                        color: '#61758A',
                        fontFamily: 'Work Sans'
                      }}
                    >
                      {formatTimeLeft(item.timeLeft)}
                    </span>
                  </div>

                  {/* Status */}
                  <div
                    style={{
                      width: '171px',
                      height: '72px',
                      padding: '8px 16px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: '#F0F2F5',
                        borderRadius: '8px',
                        padding: '0 16px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '14px',
                          lineHeight: '21px',
                          fontWeight: 500,
                          color: '#121417',
                          fontFamily: 'Work Sans'
                        }}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: '40px 20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <p
          style={{
            fontSize: '16px',
            lineHeight: '24px',
            fontWeight: 400,
            color: '#61758A',
            fontFamily: 'Work Sans',
            margin: 0
          }}
        >
          @2024 AuctionSite. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
