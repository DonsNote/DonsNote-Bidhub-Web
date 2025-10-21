/**
 * Application Constants
 * 애플리케이션 전체에서 사용되는 상수들
 */

/**
 * 입찰 상태
 */
export const BID_STATUS = {
  WINNING: 'winning',
  OUTBID: 'outbid',
  WON: 'won',
  LOST: 'lost',
  ACTIVE: 'active'
} as const;

/**
 * 경매 아이템 상태
 */
export const ITEM_STATUS = {
  ACTIVE: 'active',
  SOLD: 'sold',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled'
} as const;

/**
 * 트레이드 오퍼 상태
 */
export const TRADE_OFFER_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled'
} as const;

/**
 * 경매 기간 옵션 (일)
 */
export const AUCTION_DURATION_OPTIONS = [
  { label: '3일', value: 3 },
  { label: '7일', value: 7 },
  { label: '14일', value: 14 },
  { label: '30일', value: 30 }
] as const;

/**
 * 아이템 상태 옵션
 */
export const ITEM_CONDITION_OPTIONS = [
  { label: '새 상품', value: 'new' },
  { label: '거의 새 상품', value: 'like_new' },
  { label: '우수', value: 'excellent' },
  { label: '양호', value: 'good' },
  { label: '보통', value: 'fair' },
  { label: '수리 필요', value: 'poor' }
] as const;

/**
 * 페이지네이션 설정
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
} as const;

/**
 * 이미지 업로드 제한
 */
export const IMAGE_UPLOAD = {
  MAX_COUNT: 10,
  MAX_SIZE_MB: 5,
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
  ACCEPTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
} as const;

/**
 * 태그 제한
 */
export const TAG_LIMITS = {
  MIN_COUNT: 1,
  MAX_COUNT: 5,
  MIN_LENGTH: 2,
  MAX_LENGTH: 20
} as const;

/**
 * 입력 필드 제한
 */
export const INPUT_LIMITS = {
  TITLE: {
    MIN: 3,
    MAX: 200
  },
  DESCRIPTION: {
    MIN: 10,
    MAX: 5000
  },
  BID_AMOUNT: {
    MIN: 1,
    MAX: 1000000000
  }
} as const;

/**
 * 로컬 스토리지 키
 */
export const STORAGE_KEYS = {
  USER: 'bidhub_user',
  AUTH_TOKEN: 'bidhub_auth_token',
  THEME: 'bidhub_theme',
  RECENT_SEARCHES: 'bidhub_recent_searches'
} as const;

/**
 * API 엔드포인트
 */
export const API_ENDPOINTS = {
  AUCTIONS: '/auctions',
  FEATURED_AUCTIONS: '/auctions/featured',
  ENDING_SOON: '/auctions/ending-soon',
  BIDS: '/bids',
  MY_BIDS: '/bids/my-bids',
  MY_LISTINGS: '/bids/my-listings',
  TRADE_OFFERS: '/trade-offers'
} as const;

/**
 * 경로 (Routes)
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  AUCTION: '/auction',
  MY_BID: '/my-bid',
  EXHIBIT: '/exhibit'
} as const;

/**
 * 에러 메시지
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
  UNAUTHORIZED: '로그인이 필요합니다.',
  FORBIDDEN: '권한이 없습니다.',
  NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
  SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  VALIDATION_ERROR: '입력값을 확인해주세요.',
  BID_TOO_LOW: '입찰가가 현재가보다 높아야 합니다.',
  AUCTION_ENDED: '이미 종료된 경매입니다.',
  IMAGE_UPLOAD_ERROR: '이미지 업로드에 실패했습니다.'
} as const;

/**
 * 성공 메시지
 */
export const SUCCESS_MESSAGES = {
  BID_PLACED: '입찰이 완료되었습니다!',
  AUCTION_CREATED: '경매가 성공적으로 등록되었습니다!',
  TRADE_OFFER_CREATED: '트레이드 오퍼가 전송되었습니다!',
  LOGIN_SUCCESS: '로그인되었습니다.',
  LOGOUT_SUCCESS: '로그아웃되었습니다.'
} as const;

/**
 * 색상 테마
 */
export const COLORS = {
  PRIMARY: '#268CF5',
  SECONDARY: '#6B7280',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6'
} as const;
