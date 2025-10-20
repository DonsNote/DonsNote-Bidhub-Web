# BidHub Web

BidHub의 프론트엔드 웹 애플리케이션입니다. Next.js 15와 React 19를 기반으로 구축되었으며, Supabase를 인증 및 실시간 데이터 동기화에 활용합니다.

## 🛠 기술 스택

### 핵심 프레임워크
- **Next.js**: v15.1.6 (App Router)
- **React**: v19.0.0
- **TypeScript**: v5.x

### UI 및 스타일링
- **Tailwind CSS**: v3.4.1 (유틸리티 기반 스타일링)
- **Headless UI**: v2.2.0 (접근성 높은 UI 컴포넌트)
- **Heroicons**: v2.2.0 (아이콘)
- **clsx**: v2.1.1 (조건부 클래스명)

### 인증 및 데이터
- **Supabase**: v2.47.10 (인증, 데이터베이스, 실시간 구독)
- **@supabase/ssr**: v0.5.2 (서버 사이드 렌더링 지원)

### 기타
- **next/image**: 이미지 최적화
- **date-fns** 또는 내장 Date API: 시간 처리

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
│   ├── my-bid/
│   │   └── page.tsx              # 내 입찰/출품 관리 페이지
│   ├── layout.tsx                # 루트 레이아웃
│   ├── page.tsx                  # 홈페이지 (메인)
│   └── globals.css               # 전역 스타일
├── components/
│   ├── AuctionCard.tsx           # 경매 아이템 카드
│   ├── Header.tsx                # 헤더 네비게이션
│   └── ...
├── lib/
│   ├── api/
│   │   ├── auction.api.ts        # 경매 API 클라이언트
│   │   ├── auth.api.ts           # 인증 API 클라이언트
│   │   └── bid.api.ts            # 입찰 API 클라이언트
│   └── supabase/
│       └── client.ts             # Supabase 클라이언트 설정
├── public/
│   └── images/                   # 정적 이미지 파일
├── .env.local                    # 환경 변수 (git ignored)
├── tailwind.config.ts            # Tailwind 설정
├── next.config.ts                # Next.js 설정
├── tsconfig.json
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

### 4. My Bid 페이지 (`/my-bid`)
- **Bidding History**: 내가 입찰한 경매 목록
  - 입찰 상태 (winning, outbid, lost)
  - 내 입찰가 vs 현재가
  - Rebid 버튼 (outbid 상태인 경우)
- **My Listings**: 내가 출품한 경매 목록
  - 최고 입찰가, 입찰 수, 조회 수
  - Exhibit 버튼 (새 출품)

### 5. 출품 페이지 (`/exhibit`)
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
  logout(): Promise<void>
  getCurrentUser(): Promise<User | null>
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

### 1. 태그 입력 시스템
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

### 2. 이미지 업로드 (드래그 앤 드롭)
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

### 3. 남은 시간 계산
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

### 4. 입찰 상태 표시
```typescript
const getBidStatus = (bid: Bid) => {
  if (bid.itemStatus !== 'active') {
    return bid.myBid === bid.currentBid ? 'Won' : 'Lost';
  }
  return bid.status === 'outbid' ? 'Outbid' : 'Winning';
};
```

## 🎨 스타일링

### Tailwind CSS
유틸리티 클래스 기반 스타일링:
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <h1 className="text-3xl font-bold text-gray-900">
    Featured Auctions
  </h1>
</div>
```

### 인라인 스타일 (Figma 디자인 준수)
Figma에서 추출한 정확한 디자인 값:
```tsx
<button style={{
  padding: '16px 24px',
  backgroundColor: '#268CF5',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: 600,
  color: '#FFFFFF',
  fontFamily: 'Work Sans'
}}>
  Submit
</button>
```

## ⚙️ 설정 및 실행

### 환경 변수 설정

`.env.local` 파일 생성:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 검사
npm run lint
```

개발 서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## 🏗 아키텍처 패턴

### Client-Side Rendering (CSR)
대부분의 페이지는 클라이언트에서 데이터를 페칭하고 렌더링합니다.

### Component-Based Architecture
```
Page Component
  ├── Header Component
  ├── Main Content
  │   ├── AuctionCard Component (재사용)
  │   ├── BidHistory Component
  │   └── TradeOfferCard Component
  └── Footer
```

### State Management
- **React Hooks**: useState, useEffect, useCallback
- **Local State**: 각 컴포넌트에서 자체 상태 관리
- **Props Drilling**: 필요시 props로 데이터 전달

### API Layer Separation
```
Component → API Client → Backend API
```

모든 API 호출은 `lib/api/` 모듈을 통해 중앙화되어 관리됩니다.

## 📱 반응형 디자인

Tailwind의 반응형 유틸리티 사용:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {/* 모바일: 1열, 태블릿: 2열, 데스크탑: 3-4열 */}
</div>
```

## 🔄 데이터 흐름

### 1. 경매 상세 페이지 입찰 흐름
```
사용자 입력 → placeBid 호출 → 서버 API → Supabase 업데이트
                                              ↓
                                    Realtime 구독 트리거
                                              ↓
                                    UI 자동 업데이트
```

### 2. 로그인 흐름
```
로그인 폼 → authApi.login → Supabase Auth → 세션 생성
                                              ↓
                                         홈으로 리다이렉트
```

### 3. 출품 흐름
```
출품 폼 → createAuction → 서버 API → Supabase Insert
                                        ↓
                                  My Bid 페이지로 리다이렉트
```

## 🎭 사용자 경험 (UX)

### 로딩 상태
```typescript
const [submitting, setSubmitting] = useState(false);

// 제출 중 버튼 비활성화
<button disabled={submitting}>
  {submitting ? 'Submitting...' : 'Submit'}
</button>
```

### 에러 핸들링
```typescript
try {
  await auctionApi.placeBid(itemId, amount, userId);
  alert('Bid placed successfully!');
} catch (error) {
  alert(error instanceof Error ? error.message : 'Failed to place bid');
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
