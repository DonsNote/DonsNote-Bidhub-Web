'use client';

import Header from '@/components/Header';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { auctionApi } from '@/lib/api/auction.api';
import { bidApi, BidHistory } from '@/lib/api/bid.api';
import { authApi } from '@/lib/api/auth.api';
import { tradeOfferApi, TradeOffer } from '@/lib/api/tradeOffer.api';
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

  // Trade offer states
  const [tradeOffers, setTradeOffers] = useState<TradeOffer[]>([]);
  const [tradeTitle, setTradeTitle] = useState('');
  const [tradeDescription, setTradeDescription] = useState('');
  const [tradeValue, setTradeValue] = useState('');
  const [submittingTrade, setSubmittingTrade] = useState(false);

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
      const auctionData = await auctionApi.getAuctionById(itemId);

      if (auctionData) {
        setAuction(auctionData);
      }

      // Load bid history separately to avoid blocking auction display
      try {
        const bidsData = await bidApi.getItemBids(itemId);
        setBidHistory(bidsData);
      } catch (bidError) {
        console.log('No bid history available');
        setBidHistory([]);
      }

      // Load trade offers
      try {
        const offersData = await tradeOfferApi.getTradeOffersByItem(itemId);
        setTradeOffers(offersData);
      } catch (offerError) {
        console.log('No trade offers available');
        setTradeOffers([]);
      }
    } catch (error) {
      console.error('Error loading auction:', error);
      setAuction(null);
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
        // No active session - user is not logged in
        setUser(null);
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

  // Handle trade offer submission
  const handleSubmitTradeOffer = async () => {
    if (!user) {
      alert('Please login to submit a trade offer');
      router.push('/login');
      return;
    }

    if (!tradeTitle || !tradeDescription || !tradeValue) {
      alert('Please fill in all fields');
      return;
    }

    const estimatedValue = parseFloat(tradeValue);
    if (isNaN(estimatedValue) || estimatedValue <= 0) {
      alert('Please enter a valid estimated value');
      return;
    }

    try {
      setSubmittingTrade(true);

      await tradeOfferApi.createTradeOffer(
        itemId,
        user.id,
        tradeTitle,
        tradeDescription,
        estimatedValue
      );

      // Reload trade offers
      const offersData = await tradeOfferApi.getTradeOffersByItem(itemId);
      setTradeOffers(offersData);

      // Clear form
      setTradeTitle('');
      setTradeDescription('');
      setTradeValue('');

      alert('Trade offer submitted successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to submit trade offer');
    } finally {
      setSubmittingTrade(false);
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

      <main style={{ display: 'flex', padding: '20px 160px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Title */}
          <div style={{ padding: '16px' }}>
            <h1 style={{ fontSize: '32px', lineHeight: '40px', color: '#121417', fontFamily: 'Work Sans', fontWeight: 700 }}>
              {auction.title}
            </h1>
          </div>

          {/* Image */}
          <div style={{ padding: '16px' }}>
            <div style={{ position: 'relative', width: '100%', height: '619px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#F0F2F5' }}>
              <Image
                src={auction.image_urls?.[0] || '/images/placeholder.png'}
                alt={auction.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Title again (below image) */}
          <div style={{ padding: '20px 16px 12px' }}>
            <h2 style={{ fontSize: '22px', lineHeight: '28px', color: '#121417', fontFamily: 'Work Sans', fontWeight: 700 }}>
              {auction.title}
            </h2>
          </div>

          {/* Description */}
          <div style={{ padding: '4px 16px 12px' }}>
            <p style={{ fontSize: '16px', lineHeight: '24px', color: '#121417' }}>{auction.description}</p>
          </div>

          {/* Tabs */}
          <div style={{ padding: '12px 16px' }}>
            <div style={{ display: 'flex', backgroundColor: '#F0F2F5', borderRadius: '8px', padding: '4px', height: '40px' }}>
              <div
                onClick={() => setActiveTab('monetary')}
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: activeTab === 'monetary' ? '#FFFFFF' : 'transparent',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  padding: '0 8px',
                  boxShadow: activeTab === 'monetary' ? '0px 0px 4px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <p style={{ fontSize: '14px', fontWeight: 500, color: activeTab === 'monetary' ? '#121417' : '#61758A', fontFamily: 'Work Sans' }}>
                  Monetary Bid
                </p>
              </div>
              <div
                onClick={() => setActiveTab('trade')}
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: activeTab === 'trade' ? '#FFFFFF' : 'transparent',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  padding: '0 8px',
                  boxShadow: activeTab === 'trade' ? '0px 0px 4px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <p style={{ fontSize: '14px', fontWeight: 500, color: activeTab === 'trade' ? '#121417' : '#61758A', fontFamily: 'Work Sans' }}>
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
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#121417', fontFamily: 'Work Sans' }}>Current Bid</h3>
              </div>
              <div style={{ padding: '20px 16px 12px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#121417', fontFamily: 'Work Sans' }}>
                  ${auction.current_price.toLocaleString()}
                </h2>
              </div>

              {/* Bid History */}
              <div style={{ padding: '16px 16px 8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#121417', fontFamily: 'Work Sans' }}>Bid History</h3>
              </div>
              <div style={{ padding: '12px 16px' }}>
                <div style={{ border: '1px solid #DBE0E5', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#FFFFFF' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#121417', fontFamily: 'Work Sans' }}>Bidder</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: 500, color: '#121417', fontFamily: 'Work Sans' }}>Amount</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: 500, color: '#121417', fontFamily: 'Work Sans' }}>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bidHistory.length > 0 ? (
                        bidHistory.map((bid, index) => (
                          <tr key={bid.id} style={{ borderTop: index > 0 ? '1px solid #E5E8EB' : 'none' }}>
                            <td style={{ padding: '8px 16px', fontSize: '14px', color: '#121417', height: '72px', fontFamily: 'Work Sans' }}>{bid.bidder}</td>
                            <td style={{ padding: '8px 16px', fontSize: '14px', color: '#61758A', textAlign: 'center', height: '72px', fontFamily: 'Work Sans' }}>${bid.amount.toLocaleString()}</td>
                            <td style={{ padding: '8px 16px', fontSize: '14px', color: '#61758A', textAlign: 'center', height: '72px', fontFamily: 'Work Sans' }}>{formatBidTime(bid.time)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} style={{ padding: '24px', textAlign: 'center', fontSize: '14px', color: '#61758A', fontFamily: 'Work Sans' }}>No bids yet</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Time Remaining */}
              <div style={{ padding: '16px 16px 8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#121417', fontFamily: 'Work Sans' }}>Time Remaining</h3>
              </div>
              <div style={{ display: 'flex', gap: '16px', padding: '24px 16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 12px', width: '220px', height: '56px', backgroundColor: '#F0F2F5', borderRadius: '8px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#121417', fontFamily: 'Work Sans' }}>{timeRemaining.days}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '220px' }}>
                    <div style={{ fontSize: '14px', color: '#121417', fontFamily: 'Work Sans' }}>Days</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 12px', width: '220px', height: '56px', backgroundColor: '#F0F2F5', borderRadius: '8px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#121417', fontFamily: 'Work Sans' }}>{timeRemaining.hours}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '220px' }}>
                    <div style={{ fontSize: '14px', color: '#121417', fontFamily: 'Work Sans' }}>Hours</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 12px', width: '220px', height: '56px', backgroundColor: '#F0F2F5', borderRadius: '8px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#121417', fontFamily: 'Work Sans' }}>{timeRemaining.minutes}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '220px' }}>
                    <div style={{ fontSize: '14px', color: '#121417', fontFamily: 'Work Sans' }}>Minutes</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 12px', width: '220px', height: '56px', backgroundColor: '#F0F2F5', borderRadius: '8px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#121417', fontFamily: 'Work Sans' }}>{timeRemaining.seconds}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '220px' }}>
                    <div style={{ fontSize: '14px', color: '#121417', fontFamily: 'Work Sans' }}>Seconds</div>
                  </div>
                </div>
              </div>

              {/* Your Bid */}
              <div style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '0 0 8px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#121417', fontFamily: 'Work Sans' }}>Your Bid</h3>
                  </div>
                  <div style={{ padding: '15px', border: '1px solid #DBE0E5', borderRadius: '8px', backgroundColor: '#FFFFFF' }}>
                    <input
                      type="text"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="Enter your bid"
                      style={{
                        width: '100%',
                        fontSize: '16px',
                        lineHeight: '24px',
                        color: '#121417',
                        fontFamily: 'Work Sans',
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'transparent'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div style={{ padding: '12px 16px' }}>
                  <div style={{ padding: '12px', backgroundColor: '#FEE2E2', borderRadius: '8px' }}>
                    <p style={{ fontSize: '14px', color: '#DC2626', fontFamily: 'Work Sans' }}>{error}</p>
                  </div>
                </div>
              )}

              {/* Place Bid Button */}
              <div style={{ padding: '12px 16px' }}>
                <button
                  onClick={handlePlaceBid}
                  disabled={bidding}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 16px',
                    height: '40px',
                    backgroundColor: bidding ? '#9CA3AF' : '#268CF5',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontFamily: 'Work Sans',
                    cursor: bidding ? 'not-allowed' : 'pointer',
                  }}
                >
                  {bidding ? 'Placing...' : 'Place Bid'}
                </button>
              </div>
            </>
          )}

          {/* Trade Tab Content */}
          {activeTab === 'trade' && (
            <>
              {/* Other Trade Offers */}
              <div style={{ padding: '16px 16px 8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#121417', fontFamily: 'Work Sans' }}>Other Trade Offers</h3>
              </div>
              <div style={{ padding: '16px' }}>
                {tradeOffers.length > 0 ? (
                  <div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }}>
                    {tradeOffers.map((offer) => (
                      <div key={offer.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: '0 0 auto', minWidth: '200px' }}>
                        <div style={{ position: 'relative', height: '135px', borderRadius: '8px', backgroundColor: '#F0F2F5', overflow: 'hidden' }}>
                          {offer.imageUrl && (
                            <Image
                              src={offer.imageUrl}
                              alt={offer.title}
                              fill
                              style={{ objectFit: 'cover' }}
                            />
                          )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <div>
                            <h4 style={{ fontSize: '16px', fontWeight: 500, lineHeight: '24px', color: '#121417', fontFamily: 'Work Sans' }}>{offer.title}</h4>
                          </div>
                          <div>
                            <p style={{ fontSize: '14px', lineHeight: '21px', color: '#61758A', fontFamily: 'Work Sans' }}>{offer.description}</p>
                          </div>
                          <div style={{ marginTop: '8px' }}>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#268CF5', fontFamily: 'Work Sans' }}>
                              Est. ${offer.estimatedValue.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#61758A' }}>
                    <p>No trade offers yet. Be the first to make an offer!</p>
                  </div>
                )}
              </div>

              {/* Your Trade Offer */}
              <div style={{ padding: '16px 16px 8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#121417', fontFamily: 'Work Sans' }}>Your Trade Offer</h3>
              </div>

              {/* Item Title */}
              <div style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '0 0 8px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 500, color: '#121417', fontFamily: 'Work Sans' }}>Item Title</h4>
                  </div>
                  <div style={{ padding: '15px', border: '1px solid #DBE0E5', borderRadius: '8px', backgroundColor: '#FFFFFF' }}>
                    <input
                      type="text"
                      value={tradeTitle}
                      onChange={(e) => setTradeTitle(e.target.value)}
                      placeholder="Enter the title of your item"
                      style={{
                        width: '100%',
                        fontSize: '16px',
                        lineHeight: '24px',
                        color: '#121417',
                        fontFamily: 'Work Sans',
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'transparent'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Item Description */}
              <div style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '0 0 8px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 500, color: '#121417', fontFamily: 'Work Sans' }}>Item Description</h4>
                  </div>
                  <div style={{ padding: '15px', border: '1px solid #DBE0E5', borderRadius: '8px', backgroundColor: '#FFFFFF' }}>
                    <input
                      type="text"
                      value={tradeDescription}
                      onChange={(e) => setTradeDescription(e.target.value)}
                      placeholder="Describe the item you are offering"
                      style={{
                        width: '100%',
                        fontSize: '16px',
                        lineHeight: '24px',
                        color: '#121417',
                        fontFamily: 'Work Sans',
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'transparent'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Estimated Value */}
              <div style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '0 0 8px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 500, color: '#121417', fontFamily: 'Work Sans' }}>Estimated Value</h4>
                  </div>
                  <div style={{ padding: '15px', border: '1px solid #DBE0E5', borderRadius: '8px', backgroundColor: '#FFFFFF' }}>
                    <input
                      type="text"
                      value={tradeValue}
                      onChange={(e) => setTradeValue(e.target.value)}
                      placeholder="Enter the estimated value of your item"
                      style={{
                        width: '100%',
                        fontSize: '16px',
                        lineHeight: '24px',
                        color: '#121417',
                        fontFamily: 'Work Sans',
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'transparent'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Upload Item Photo */}
              <div style={{ padding: '16px' }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '24px',
                  padding: '56px 24px',
                  border: '2px dashed #DBE0E5',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#121417', fontFamily: 'Work Sans', textAlign: 'center' }}>
                      Upload Item Photo
                    </h3>
                    <p style={{ fontSize: '14px', color: '#121417', fontFamily: 'Work Sans', textAlign: 'center' }}>
                      Drag and drop or click to upload
                    </p>
                  </div>
                  <button style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 16px',
                    width: '84px',
                    height: '40px',
                    backgroundColor: '#F0F2F5',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer'
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#121417', fontFamily: 'Work Sans', textAlign: 'center' }}>
                      Upload
                    </span>
                  </button>
                </div>
              </div>

              {/* Submit Trade Offer Button */}
              <div style={{ padding: '12px 16px' }}>
                <button
                  onClick={handleSubmitTradeOffer}
                  disabled={submittingTrade}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 16px',
                    width: '100%',
                    height: '40px',
                    backgroundColor: submittingTrade ? '#9CA3AF' : '#268CF5',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontFamily: 'Work Sans',
                    cursor: submittingTrade ? 'not-allowed' : 'pointer',
                  }}
                >
                  {submittingTrade ? 'Submitting...' : 'Submit Trade Offer'}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
