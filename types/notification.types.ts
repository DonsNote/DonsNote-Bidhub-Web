/**
 * Notification Types
 * 알림 시스템을 위한 타입 정의
 */

export enum NotificationType {
  BID_PLACED = 'bid_placed',
  BID_OUTBID = 'bid_outbid',
  AUCTION_ENDING = 'auction_ending',
  AUCTION_WON = 'auction_won',
  AUCTION_LOST = 'auction_lost',
  TRADE_OFFER = 'trade_offer',
  TRADE_ACCEPTED = 'trade_accepted',
  TRADE_REJECTED = 'trade_rejected',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
  metadata?: {
    auctionId?: string;
    itemTitle?: string;
    bidAmount?: number;
    bidderId?: string;
    bidderName?: string;
    tradeOfferId?: string;
  };
}

export interface NotificationFilters {
  read?: boolean;
  type?: NotificationType;
  limit?: number;
  offset?: number;
}
