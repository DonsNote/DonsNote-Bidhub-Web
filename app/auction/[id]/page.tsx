'use client';

import Header from '@/components/Header';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { auctionApi } from '@/lib/api/auction.api';
import { bidApi, BidHistory } from '@/lib/api/bid.api';
import { authApi } from '@/lib/api/auth.api';
import type { Auction } from '@/types/auction';

export default function AuctionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id as string;

  const [activeTab, setActiveTab] = useState<'monetary' | 'trade'>('monetary');
  const [auction, setAuction] = useState<Auction | null>(null);
  const [bidHistory, setBidHistory] = useState<BidHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  const [bidding, setBidding] = useState(false);

  // Real-time countdown state
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Load auction data and bid history
  const loadAuctionData = useCallback(async () => {
    try {
      const [auctionData, bidsData] = await Promise.all([
        auctionApi.getAuctionById(itemId as any),
        bidApi.getItemBids(itemId),
      ]);

      if (auctionData) {
        setAuction(auctionData);
      }
      setBidHistory(bidsData);
    } catch (error) {
      console.error('Error loading auction:', error);
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };

    loadUser();
  }, []);

  // Load initial data
  useEffect(() => {
    loadAuctionData();
  }, [loadAuctionData]);

  // Real-time countdown timer
  useEffect(() => {
    if (!auction?.end_time) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(auction.end_time).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [auction?.end_time]);

  // Handle bid submission
  const handlePlaceBid = async () => {
    if (!user) {
      setError('Please login to place a bid');
      router.push('/login');
      return;
    }

    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      setError('Please enter a valid bid amount');
      return;
    }

    const bidValue = parseFloat(bidAmount);
    if (auction && bidValue <= auction.current_price) {
      setError(`Bid must be higher than current bid (₩${auction.current_price.toLocaleString()})`);
      return;
    }

    try {
      setBidding(true);
      setError('');

      await auctionApi.placeBid(itemId, bidValue, user.id);

      // Reload auction data to get updated info
      await loadAuctionData();

      // Clear bid input
      setBidAmount('');

      alert('Bid placed successfully!');
    } catch (error: any) {
      setError(error.message || 'Failed to place bid');
    } finally {
      setBidding(false);
    }
  };

  // Format time for bid history
  const formatBidTime = (time: string) => {
    const date = new Date(time);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days} days ago`;
    }
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

  if (!auction) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
        <Header />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <p style={{ fontSize: '16px', color: '#61758A' }}>Auction not found</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <Header />

      <main className="flex" style={{ padding: '20px 160px' }}>
        <div className="flex flex-col" style={{ flex: 1 }}>
          {/* Title */}
          <div style={{ padding: '16px' }}>
            <h1 className="font-bold" style={{ fontSize: '32px', lineHeight: '40px', color: '#121417', fontFamily: 'Work Sans' }}>
              {auction.title}
            </h1>
          </div>

          {/* Image */}
          <div style={{ padding: '12px 16px' }}>
            <div style={{ position: 'relative', width: '100%', height: '500px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#F0F2F5' }}>
              <Image
                src={auction.image_urls?.[0] || '/images/placeholder.png'}
                alt={auction.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Description */}
          <div style={{ padding: '16px 16px 8px' }}>
            <h3 className="font-bold" style={{ fontSize: '18px', color: '#121417', marginBottom: '8px' }}>Description</h3>
            <p style={{ fontSize: '14px', color: '#61758A' }}>{auction.description}</p>
          </div>

          {/* Tabs */}
          <div style={{ padding: '12px 16px' }}>
            <div style={{ display: 'flex', gap: '12px', padding: '8px', backgroundColor: '#F0F2F5', borderRadius: '8px' }}>
              <div
                onClick={() => setActiveTab('monetary')}
                style={{
                  flex: 1,
                  padding: '12px',
                  textAlign: 'center',
                  backgroundColor: activeTab === 'monetary' ? '#FFFFFF' : 'transparent',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'monetary' ? '0px 0px 4px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <p style={{ fontSize: '14px', fontWeight: 500, color: activeTab === 'monetary' ? '#121417' : '#61758A' }}>
                  Monetary Bid
                </p>
              </div>
              <div
                onClick={() => setActiveTab('trade')}
                style={{
                  flex: 1,
                  padding: '12px',
                  textAlign: 'center',
                  backgroundColor: activeTab === 'trade' ? '#FFFFFF' : 'transparent',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'trade' ? '0px 0px 4px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <p style={{ fontSize: '14px', fontWeight: 500, color: activeTab === 'trade' ? '#121417' : '#61758A' }}>
                  Trade Offer
                </p>
              </div>
            </div>
          </div>

          {/* Monetary Bid Tab Content */}
          {activeTab === 'monetary' && (
            <>
              {/* Current Bid */}
              <div style={{ padding: '16px 16px 8px' }}>
                <h3 className="font-bold" style={{ fontSize: '18px', color: '#121417' }}>Current Bid</h3>
              </div>
              <div style={{ padding: '20px 16px 12px' }}>
                <h2 className="font-bold" style={{ fontSize: '22px', color: '#121417' }}>
                  ₩{auction.current_price.toLocaleString()}
                </h2>
              </div>

              {/* Bid History Table */}
              <div style={{ padding: '12px 16px' }}>
                <div style={{ border: '1px solid #DBE0E5', borderRadius: '8px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F9FAFB' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#61758A' }}>Bidder</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#61758A' }}>Amount</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#61758A' }}>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bidHistory.length > 0 ? (
                        bidHistory.map((bid, index) => (
                          <tr key={bid.id} style={{ borderTop: index > 0 ? '1px solid #E5E8EB' : 'none' }}>
                            <td style={{ padding: '12px 16px', fontSize: '14px', color: '#121417' }}>{bid.bidder}</td>
                            <td style={{ padding: '12px 16px', fontSize: '14px', color: '#121417' }}>₩{bid.amount.toLocaleString()}</td>
                            <td style={{ padding: '12px 16px', fontSize: '14px', color: '#61758A' }}>{formatBidTime(bid.time)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} style={{ padding: '24px', textAlign: 'center', fontSize: '14px', color: '#61758A' }}>No bids yet</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Time Remaining */}
              <div style={{ padding: '16px 16px 8px' }}>
                <h3 className="font-bold" style={{ fontSize: '18px', color: '#121417' }}>Time Remaining</h3>
              </div>
              <div style={{ display: 'flex', gap: '16px', padding: '20px 16px 12px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div className="font-bold" style={{ fontSize: '32px', color: '#121417' }}>{timeRemaining.days}</div>
                  <div style={{ fontSize: '14px', color: '#61758A' }}>Days</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div className="font-bold" style={{ fontSize: '32px', color: '#121417' }}>{timeRemaining.hours}</div>
                  <div style={{ fontSize: '14px', color: '#61758A' }}>Hours</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div className="font-bold" style={{ fontSize: '32px', color: '#121417' }}>{timeRemaining.minutes}</div>
                  <div style={{ fontSize: '14px', color: '#61758A' }}>Min</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div className="font-bold" style={{ fontSize: '32px', color: '#121417' }}>{timeRemaining.seconds}</div>
                  <div style={{ fontSize: '14px', color: '#61758A' }}>Sec</div>
                </div>
              </div>

              {/* Your Bid */}
              <div style={{ padding: '16px 16px 8px' }}>
                <h3 className="font-bold" style={{ fontSize: '18px', color: '#121417', marginBottom: '12px' }}>Your Bid</h3>

                {error && (
                  <div style={{ padding: '12px', backgroundColor: '#FEE2E2', borderRadius: '8px', marginBottom: '12px' }}>
                    <p style={{ fontSize: '14px', color: '#DC2626' }}>{error}</p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '14px', color: '#61758A', display: 'block', marginBottom: '8px' }}>
                      Enter your bid amount
                    </label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={`Minimum: ₩${(auction.current_price + 1).toLocaleString()}`}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #DBE0E5',
                        borderRadius: '8px',
                        fontSize: '16px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <button
                    onClick={handlePlaceBid}
                    disabled={bidding}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: bidding ? '#9CA3AF' : '#268CF5',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: 700,
                      cursor: bidding ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {bidding ? 'Placing...' : 'Place Bid'}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Trade Tab Content */}
          {activeTab === 'trade' && (
            <div style={{ padding: '16px' }}>
              <h3 className="font-bold" style={{ fontSize: '18px', color: '#121417', marginBottom: '16px' }}>Trade Offers</h3>
              <p style={{ fontSize: '14px', color: '#61758A' }}>Trade offers are not yet implemented</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
