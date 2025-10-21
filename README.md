# BidHub Web

BidHub의 프론트엔드 웹 애플리케이션입니다. Next.js 15와 React 19를 기반으로 구축되었으며, Supabase를 인증 및 실시간 데이터 동기화에 활용합니다.

## 🛠 기술 스택

### 핵심 프레임워크
- **Next.js**: v15.5.6 (App Router)
- **React**: v19.2.0
- **TypeScript**: v5.9.3

### UI 및 스타일링
- **Tailwind CSS**: v4.1.14 (유틸리티 기반 스타일링)
- **PostCSS**: v8.5.6
- **Autoprefixer**: v10.4.21
- **@tailwindcss/postcss**: v4.1.15

### 인증 및 데이터
- **@supabase/supabase-js**: v2.75.1 (인증, 데이터베이스, 실시간 구독)

### 개발 도구
- **ESLint**: v9.38.0
- **eslint-config-next**: v15.5.6
- **@types/node**: v24.8.1
- **@types/react**: v19.2.2

## 📁 프로젝트 구조

```
Bidhub-Web/
├── app/
│   ├── auction/
│   │   └── [id]/
│   │       └── page.tsx          # 경매 상세 페이지
│   ├── exhibit/
│   │   └── page.tsx              # 경매 출품 페이지
│   ├── login/
│   │   └── page.tsx              # 로그인 페이지
│   ├── signup/
│   │   └── page.tsx              # 회원가입 페이지
│   ├── my-bid/
│   │   └── page.tsx              # 내 입찰/출품 관리 페이지
│   ├── layout.tsx                # 루트 레이아웃
│   ├── page.tsx                  # 홈페이지 (메인)
│   ├── globals.css               # 전역 스타일
│   ├── error.tsx                 # 에러 페이지
│   └── not-found.tsx             # 404 페이지
├── components/
│   ├── ui/
│   │   ├── Button.tsx            # 버튼 컴포넌트
│   │   ├── Input.tsx             # 입력 컴포넌트
│   │   ├── TextArea.tsx          # 텍스트 영역 컴포넌트
│   │   ├── Select.tsx            # 선택 컴포넌트
│   │   ├── Checkbox.tsx          # 체크박스 컴포넌트
│   │   ├── Modal.tsx             # 모달 컴포넌트
│   │   ├── ConfirmDialog.tsx     # 확인 대화상자
│   │   ├── FilterPanel.tsx       # 필터 패널
│   │   ├── ImageUpload.tsx       # 이미지 업로드
│   │   ├── ImageLightbox.tsx     # 이미지 라이트박스
│   │   ├── SearchInput.tsx       # 검색 입력
│   │   └── index.ts              # UI 컴포넌트 exports
│   ├── AuctionCard.tsx           # 경매 아이템 카드
│   ├── Header.tsx                # 헤더 네비게이션
│   ├── Footer.tsx                # 푸터
│   ├── SearchBar.tsx             # 검색 바
│   ├── NotificationDropdown.tsx  # 알림 드롭다운
│   ├── ProtectedRoute.tsx        # 보호된 라우트 컴포넌트
│   ├── Loading.tsx               # 로딩 컴포넌트
│   └── ErrorBoundary.tsx         # 에러 바운더리
├── lib/
│   ├── api/
│   │   ├── auction.api.ts        # 경매 API 클라이언트
│   │   ├── auth.api.ts           # 인증 API 클라이언트
│   │   ├── bid.api.ts            # 입찰 API 클라이언트
│   │   ├── notification.api.ts   # 알림 API 클라이언트
│   │   └── tradeOffer.api.ts     # 트레이드 오퍼 API 클라이언트
│   ├── supabase/
│   │   └── client.ts             # Supabase 클라이언트 설정
│   ├── context/
│   │   └── AuthContext.tsx       # 인증 컨텍스트
│   └── utils/
│       ├── constants.ts          # 상수 정의
│       ├── format.ts             # 포맷 유틸리티
│       ├── imageUpload.ts        # 이미지 업로드 유틸리티
│       ├── validation.ts         # 유효성 검증
│       └── index.ts              # 유틸리티 exports
├── types/
│   └── *.ts                      # TypeScript 타입 정의
├── public/
│   └── images/                   # 정적 이미지 파일
├── .env.local                    # 환경 변수 (git ignored)
├── .env.example                  # 환경 변수 예시
├── tailwind.config.ts            # Tailwind 설정
├── next.config.ts                # Next.js 설정
├── postcss.config.mjs            # PostCSS 설정
├── tsconfig.json                 # TypeScript 설정
├── .eslintrc.json                # ESLint 설정
└── package.json
```

## 🎨 주요 페이지

### 1. 홈페이지 (`/`)
- **Featured Auctions**: 추천 경매 아이템 섹션
- **Ending Soon**: 마감 임박 경매 섹션
- 실시간 가격 업데이트
- 카드 형식 아이템 리스트

### 2. 경매 상세 페이지 (`/auction/[id]`)
- 아이템 이미지 갤러리 (이미지 선택 가능)
- 현재가, 입찰 수, 남은 시간 표시
- 입찰 폼 (로그인 필수)
- 입찰 히스토리 (입찰자당 최신 입찰만 표시)
- Other Trade Offers 섹션
- **실시간 업데이트**: Supabase Realtime으로 가격/입찰 자동 반영

### 3. 로그인 페이지 (`/login`)
- 이메일/비밀번호 로그인
- Supabase Auth 사용
- 로그인 후 메인 페이지로 리다이렉트
- 회원가입 페이지 링크

### 4. 회원가입 페이지 (`/signup`)
- 이메일/비밀번호 회원가입
- Supabase Auth 사용
- 입력 검증 (이메일 형식, 비밀번호 강도)
- 가입 후 로그인 페이지로 리다이렉트

### 5. My Bid 페이지 (`/my-bid`)
- **Bidding History**: 내가 입찰한 경매 목록
  - 입찰 상태 (winning, outbid, lost)
  - 내 입찰가 vs 현재가
  - Rebid 버튼 (outbid 상태인 경우)
- **My Listings**: 내가 출품한 경매 목록
  - 최고 입찰가, 입찰 수, 조회 수
  - Exhibit 버튼 (새 출품)

### 6. 출품 페이지 (`/exhibit`)
- 경매 아이템 등록 폼
  - 제목, 설명
  - 시작가, 희망가 (선택)
  - 기간 선택 (3일, 7일, 14일, 30일)
  - 태그 입력 (최대 5개, 콤마/스페이스로 추가)
  - 이미지 업로드 (드래그 앤 드롭, 최대 10개)
- 폼 검증
- 서버 전송 및 My Bid 페이지로 리다이렉트

## 🔐 인증 시스템

### Supabase Auth 활용
```typescript
// lib/api/auth.api.ts
export const authApi = {
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    // ...
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async logout() {
    await supabase.auth.signOut();
  }
};
```

### 보호된 라우트
로그인 필요 페이지:
- `/my-bid`
- `/exhibit`
- 경매 상세 페이지의 입찰 기능

로그인하지 않은 사용자는 자동으로 `/login`으로 리다이렉트됩니다.

## 📡 API 통신

### API 클라이언트 구조

모든 API 호출은 `lib/api/` 디렉토리의 모듈로 관리됩니다:

#### Auction API (`lib/api/auction.api.ts`)
```typescript
export const auctionApi = {
  getFeaturedAuctions(): Promise<Auction[]>
  getEndingSoonAuctions(): Promise<Auction[]>
  getAuctionById(id: string): Promise<Auction | null>
  placeBid(itemId: string, amount: number, bidderId: string): Promise<void>
  createAuction(auctionData: {...}): Promise<Auction | null>
}
```

#### Bid API (`lib/api/bid.api.ts`)
```typescript
export const bidApi = {
  getMyBids(userId: string): Promise<Bid[]>
  getMyListings(userId: string): Promise<Listing[]>
  getItemBids(itemId: string): Promise<BidHistory[]>
}
```

#### Auth API (`lib/api/auth.api.ts`)
```typescript
export const authApi = {
  login(email: string, password: string): Promise<User>
  signup(email: string, password: string): Promise<User>
  logout(): Promise<void>
  getCurrentUser(): Promise<User | null>
}
```

#### Notification API (`lib/api/notification.api.ts`)
```typescript
export const notificationApi = {
  getNotifications(filters?: {...}): Promise<Notification[]>
  getUnreadCount(): Promise<number>
  markAsRead(id: string): Promise<void>
  markAllAsRead(): Promise<void>
  deleteNotification(id: string): Promise<void>
}
```

#### Trade Offer API (`lib/api/tradeOffer.api.ts`)
```typescript
export const tradeOfferApi = {
  getTradeOffers(itemId: string): Promise<TradeOffer[]>
  createTradeOffer(data: {...}): Promise<TradeOffer>
}
```

### 환경 변수
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## ⚡ 실시간 기능

### Supabase Realtime 구독

경매 상세 페이지에서 실시간 가격 업데이트:

```typescript
useEffect(() => {
  const channel = supabase
    .channel('item-changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'items',
        filter: `id=eq.${itemId}`
      },
      (payload) => {
        // 실시간으로 아이템 데이터 업데이트
        setAuction(prev => ({
          ...prev,
          currentBid: payload.new.current_price,
          bidCount: payload.new.bid_count
        }));
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [itemId]);
```

### 실시간 입찰 히스토리

입찰이 발생하면 히스토리도 자동으로 업데이트됩니다:
```typescript
.on(
  'postgres_changes',
  {
    event: 'INSERT',
    schema: 'public',
    table: 'bids',
    filter: `item_id=eq.${itemId}`
  },
  async () => {
    const bidsData = await bidApi.getItemBids(itemId);
    setBidHistory(bidsData);
  }
)
```

## 🎯 주요 기능

### 1. UI 컴포넌트 시스템
재사용 가능한 UI 컴포넌트 라이브러리:
```typescript
// components/ui/
- Button: 다양한 스타일의 버튼 (primary, secondary, danger)
- Input: 텍스트 입력 컴포넌트
- TextArea: 텍스트 영역 컴포넌트
- Select: 드롭다운 선택 컴포넌트
- Checkbox: 체크박스 컴포넌트
- Modal: 모달 대화상자
- ConfirmDialog: 확인 대화상자
- FilterPanel: 필터 패널
- ImageUpload: 이미지 업로드 (드래그 앤 드롭)
- ImageLightbox: 이미지 확대 보기
- SearchInput: 검색 입력
```

### 2. 알림 시스템
실시간 알림 기능:
```typescript
// NotificationDropdown 컴포넌트
- 헤더에 알림 아이콘 표시
- 읽지 않은 알림 개수 배지
- 드롭다운 알림 목록
- 알림 타입별 아이콘 및 스타일
- 읽음 처리 및 삭제 기능
- 실시간 알림 업데이트
```

### 3. 인증 컨텍스트
전역 인증 상태 관리:
```typescript
// lib/context/AuthContext.tsx
const AuthProvider: React.FC
const useAuth: () => AuthContextType

// 기능:
- 로그인/로그아웃 상태 관리
- 사용자 정보 전역 제공
- 보호된 라우트 처리
- 자동 세션 유지
```

### 4. 이미지 업로드 시스템
드래그 앤 드롭 이미지 업로드:
```typescript
// components/ui/ImageUpload.tsx
- 드래그 앤 드롭 지원
- 파일 선택 버튼
- 미리보기 표시
- 이미지 삭제 기능
- 최대 개수 제한 (10개)
- 파일 크기 검증
```

### 5. 검색 및 필터링
경매 아이템 검색 및 필터:
```typescript
// SearchBar 컴포넌트
- 키워드 검색
- 카테고리 필터
- 가격 범위 필터
- 상태 필터 (진행 중, 종료됨)
- 정렬 옵션 (최신순, 마감 임박, 인기순)
```

### 6. 에러 처리
전역 에러 처리:
```typescript
// ErrorBoundary 컴포넌트
- 컴포넌트 레벨 에러 캡처
- 에러 페이지 표시
- 에러 로깅
- 복구 옵션 제공

// error.tsx, not-found.tsx
- 커스텀 에러 페이지
- 404 페이지
```

### 7. 태그 입력 시스템
```typescript
const [tags, setTags] = useState<string[]>([]);
const [tagInput, setTagInput] = useState('');

const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
  if ((e.key === ',' || e.key === ' ' || e.key === 'Enter') && tagInput.trim()) {
    e.preventDefault();
    if (tags.length < 5 && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  }
};
```

**기능:**
- 콤마, 스페이스, Enter로 태그 추가
- 최대 5개 제한
- 중복 방지
- X 버튼으로 개별 삭제
- 빈 입력에서 Backspace로 마지막 태그 삭제

### 8. 유틸리티 함수
공통 유틸리티 함수들:
```typescript
// lib/utils/
- format.ts: 날짜, 시간, 가격 포맷팅
- validation.ts: 폼 입력 검증
- imageUpload.ts: 이미지 업로드 처리
- constants.ts: 상수 정의
```

### 9. 보호된 라우트
인증이 필요한 페이지 보호:
```typescript
// ProtectedRoute 컴포넌트
- 로그인 상태 확인
- 미인증 시 로그인 페이지로 리다이렉트
- 로딩 상태 처리
```

### 10. 이미지 업로드 (드래그 앤 드롭)
```typescript
const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  const files = Array.from(e.dataTransfer.files);
  handleImageFiles(files);
};

const handleImageFiles = (files: File[]) => {
  if (selectedImages.length + files.length > 10) {
    alert('Maximum 10 images allowed');
    return;
  }

  files.forEach(file => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews(prev => [...prev, reader.result as string]);
    };
    reader.readAsDataURL(file);
  });
};
```

### 11. 남은 시간 계산
```typescript
const calculateTimeLeft = (endTime: string | null): string => {
  if (!endTime) return 'Time expired';

  const now = new Date();
  const end = new Date(endTime);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return 'Ended';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};
```

### 12. 입찰 상태 표시
```typescript
const getBidStatus = (bid: Bid) => {
  if (bid.itemStatus !== 'active') {
    return bid.myBid === bid.currentBid ? 'Won' : 'Lost';
  }
  return bid.status === 'outbid' ? 'Outbid' : 'Winning';
};
```

## 🎨 스타일링

### Tailwind CSS v4
최신 Tailwind CSS v4 사용:
```tsx
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#268CF5',
        secondary: '#6B7280',
        // ...
      },
      fontFamily: {
        sans: ['Work Sans', 'sans-serif'],
      },
    },
  },
}
```

### 유틸리티 클래스
일관된 디자인 시스템:
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <h1 className="text-3xl font-bold text-gray-900">
    Featured Auctions
  </h1>
</div>
```

### CSS 모듈화
전역 스타일과 컴포넌트 스타일 분리:
```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 커스텀 유틸리티 클래스 */
@layer components {
  .btn-primary {
    @apply px-6 py-3 bg-primary text-white rounded-lg;
  }
}
```

### 폼 검증
```typescript
if (!formData.title || !formData.description || tags.length === 0) {
  alert('Please fill in all required fields');
  return;
}
```

## 🚀 성능 최적화

### Next.js Image 컴포넌트
```tsx
<Image
  src={auction.image}
  alt={auction.title}
  fill
  style={{ objectFit: 'cover' }}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### useCallback으로 함수 메모이제이션
```typescript
const handlePlaceBid = useCallback(async () => {
  // 입찰 로직
}, [itemId, user]);
```

### 조건부 렌더링
```tsx
{user && <Link href="/my-bid">My Bid</Link>}
{auction && <div>{auction.title}</div>}
```

## 📚 주요 TypeScript 타입

### Auction
```typescript
interface Auction {
  id: string;
  title: string;
  description: string;
  currentBid: number;
  startingBid: number;
  reservePrice?: number;
  timeLeft: string | null;
  images: string[];
  condition: string;
  location: string;
  shippingCost: number;
  bidCount: number;
  viewCount: number;
  sellerId: string;
}
```

### Bid
```typescript
interface Bid {
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
```

### Listing
```typescript
interface Listing {
  id: string;
  name: string;
  highestBid: number;
  timeLeft: string | null;
  status: string;
  image: string;
  bidCount: number;
  viewCount: number;
}
```

### Notification
```typescript
interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, any>;
}
```

### TradeOffer
```typescript
interface TradeOffer {
  id: string;
  itemId: string;
  offererId: string;
  title: string;
  description: string;
  estimatedValue: number;
  imageUrl: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}
```

## 🏗 아키텍처 패턴

### Next.js App Router
최신 App Router 기반 아키텍처:
```
app/
├── layout.tsx (루트 레이아웃)
├── page.tsx (루트 페이지)
├── error.tsx (에러 핸들링)
├── not-found.tsx (404 처리)
└── [route]/
    └── page.tsx (동적 라우트)
```

### 레이어드 아키텍처
```
Presentation Layer (Components)
         ↓
Business Logic Layer (Hooks, Context)
         ↓
Data Access Layer (API Clients)
         ↓
External Services (Backend API, Supabase)
```

### Component-Based Architecture
재사용 가능한 컴포넌트 구조:
```
Page Component
  ├── Layout Component
  │   ├── Header Component
  │   │   └── NotificationDropdown Component
  │   └── Footer Component
  ├── Main Content
  │   ├── AuctionCard Component (재사용)
  │   ├── SearchBar Component
  │   ├── FilterPanel Component
  │   └── UI Components (Button, Input, etc.)
  └── Error Boundary
```

### State Management
다층 상태 관리:
```typescript
// 전역 상태: React Context
AuthContext - 인증 상태 관리

// 로컬 상태: React Hooks
useState - 컴포넌트 내부 상태
useEffect - 사이드 이펙트
useCallback - 함수 메모이제이션
useMemo - 값 메모이제이션

// 서버 상태: API Fetching
useEffect + API Clients
```

### API Layer Separation
중앙화된 API 관리:
```
Component → API Client → Backend API → Supabase
                ↓
         Error Handling
         Response Transform
         Token Management
```

## 🧪 개발 팁

### Hot Reload
Next.js는 파일 변경 시 자동으로 페이지를 새로고침합니다.

### TypeScript 에러 확인
```bash
npm run build  # 타입 에러 체크
```

### Tailwind IntelliSense
VS Code에서 Tailwind CSS IntelliSense 확장 프로그램 설치 권장

### React DevTools
브라우저 확장 프로그램으로 컴포넌트 상태 디버깅

## 📚 관련 문서

- [Next.js 공식 문서](https://nextjs.org/docs)
- [React 공식 문서](https://react.dev/)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [Supabase 공식 문서](https://supabase.com/docs)

## 👤 작성자

DonsNote - [GitHub](https://github.com/donsnote)

## 📄 라이선스

이 프로젝트는 비공개 프로젝트입니다.
