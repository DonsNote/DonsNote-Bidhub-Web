const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface Bid {
  id: string;
  itemId: string;
  name: string;
  status: string;
  myBid: number;
  currentBid: number;
  timeLeft: string | null;
  image: string;
  canRebid: boolean;
  itemStatus: string;
}

export interface Listing {
  id: string;
  name: string;
  highestBid: number;
  timeLeft: string | null;
  status: string;
  image: string;
  bidCount: number;
  viewCount: number;
}

export interface BidHistory {
  id: string;
  bidder: string;
  amount: number;
  time: string;
}

export const bidApi = {
  /**
   * Get all bids for a user (Bidding History)
   */
  async getMyBids(userId: string): Promise<Bid[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/bids/my-bids/${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch bids');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching my bids:', error);
      throw error;
    }
  },

  /**
   * Get all listings for a user (My Listings)
   */
  async getMyListings(userId: string): Promise<Listing[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/bids/my-listings/${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching my listings:', error);
      throw error;
    }
  },

  /**
   * Get bid history for an item
   */
  async getItemBids(itemId: string): Promise<BidHistory[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/bids/item/${itemId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch item bids');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching item bids:', error);
      throw error;
    }
  }
};
