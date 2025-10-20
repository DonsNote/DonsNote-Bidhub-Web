import { Auction, ApiResponse } from '@/types/auction';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const auctionApi = {
  // 모든 경매 조회
  getAllAuctions: async (): Promise<Auction[]> => {
    const response = await fetch(`${API_BASE_URL}/auctions`);
    const data: ApiResponse<Auction[]> = await response.json();
    return data.data || [];
  },

  // Featured 경매 조회
  getFeaturedAuctions: async (): Promise<Auction[]> => {
    const response = await fetch(`${API_BASE_URL}/auctions/featured`);
    const data: ApiResponse<Auction[]> = await response.json();
    return data.data || [];
  },

  // Ending Soon 경매 조회
  getEndingSoonAuctions: async (): Promise<Auction[]> => {
    const response = await fetch(`${API_BASE_URL}/auctions/ending-soon`);
    const data: ApiResponse<Auction[]> = await response.json();
    return data.data || [];
  },

  // 특정 경매 조회
  getAuctionById: async (id: string | number): Promise<Auction | null> => {
    const response = await fetch(`${API_BASE_URL}/auctions/${id}`);

    if (!response.ok) {
      console.error('Failed to fetch auction:', response.status);
      return null;
    }

    const data: ApiResponse<Auction> = await response.json();
    return data.data || null;
  },

  // 입찰하기
  placeBid: async (id: string, bidAmount: number, bidderId: string): Promise<Auction | null> => {
    const response = await fetch(`${API_BASE_URL}/auctions/${id}/bid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bidAmount, bidderId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to place bid');
    }

    const data: ApiResponse<Auction> = await response.json();
    return data.data || null;
  },

  // 경매 생성
  createAuction: async (auctionData: {
    title: string;
    description: string;
    starting_price: number;
    reserve_price?: number;
    image_urls: string[];
    category_id?: string;
    end_time: string;
    seller_id: string;
    condition?: string;
    location?: string;
    shipping_cost?: number;
  }): Promise<Auction | null> => {
    const response = await fetch(`${API_BASE_URL}/auctions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(auctionData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create auction');
    }

    const data: ApiResponse<Auction> = await response.json();
    return data.data || null;
  },
};
