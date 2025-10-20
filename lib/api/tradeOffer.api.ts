const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface TradeOffer {
  id: string;
  itemId: string;
  offererId: string;
  title: string;
  description: string;
  estimatedValue: number;
  imageUrl: string;
  status: string;
  createdAt: string;
}

export const tradeOfferApi = {
  /**
   * Get all trade offers for a specific item
   */
  async getTradeOffersByItem(itemId: string): Promise<TradeOffer[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/trade-offers/item/${itemId}`);

      if (!response.ok) {
        console.log('No trade offers available for this item');
        return [];
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.log('Failed to fetch trade offers, returning empty array');
      return [];
    }
  },

  /**
   * Create a new trade offer
   */
  async createTradeOffer(
    itemId: string,
    offererId: string,
    title: string,
    description: string,
    estimatedValue: number,
    imageUrl?: string
  ): Promise<TradeOffer | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/trade-offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          offererId,
          title,
          description,
          estimatedValue,
          imageUrl,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create trade offer');
      }

      const data = await response.json();
      return data.data || null;
    } catch (error: any) {
      console.error('Error creating trade offer:', error);
      throw error;
    }
  },
};
