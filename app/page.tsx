import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import AuctionCard from '@/components/AuctionCard';
import { auctionApi } from '@/lib/api/auction.api';

export default async function Home() {
  // 서버에서 데이터 가져오기
  const [featuredItems, endingSoonItems] = await Promise.all([
    auctionApi.getFeaturedAuctions(),
    auctionApi.getEndingSoonAuctions(),
  ]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <Header />

      {/* Main Content */}
      <main
        className="flex"
        style={{
          padding: '20px 160px',
          justifyContent: 'stretch',
          alignItems: 'stretch',
          alignSelf: 'stretch'
        }}
      >
        <div className="flex flex-col" style={{ flex: 1 }}>
          {/* Search Bar */}
          <SearchBar />

          {/* Featured Items Section */}
          <section className="flex flex-col" style={{ alignSelf: 'stretch' }}>
            {/* Section Title */}
            <div
              className="flex flex-col justify-center"
              style={{
                alignSelf: 'stretch',
                padding: '20px 16px 12px',
                height: '80px'
              }}
            >
              <h2
                className="font-bold"
                style={{
                  fontSize: '22px',
                  lineHeight: '28px',
                  color: '#121417',
                  fontFamily: 'Work Sans'
                }}
              >
                Featured Items
              </h2>
            </div>

            {/* Cards Grid */}
            <div
              className="flex"
              style={{
                alignItems: 'center',
                alignSelf: 'stretch'
              }}
            >
              <div
                className="flex"
                style={{
                  justifyContent: 'stretch',
                  alignItems: 'stretch',
                  gap: '12px',
                  padding: '16px',
                  flex: 1
                }}
              >
                {featuredItems.map((item) => (
                  <AuctionCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    currentBid={`$${item.current_price?.toLocaleString() || '0'}`}
                    imageSrc={item.image_urls?.[0] || '/images/placeholder.png'}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Ending Soon Section */}
          <section
            className="flex flex-col"
            style={{
              justifyContent: 'stretch',
              alignItems: 'stretch',
              alignSelf: 'stretch',
              gap: '12px',
              padding: '16px'
            }}
          >
            {/* Section Title */}
            <div
              className="flex flex-col justify-center"
              style={{
                alignSelf: 'stretch',
                padding: '20px 16px 12px',
                height: '80px'
              }}
            >
              <h2
                className="font-bold"
                style={{
                  fontSize: '22px',
                  lineHeight: '28px',
                  color: '#121417',
                  fontFamily: 'Work Sans'
                }}
              >
                Ending Soon
              </h2>
            </div>

            {/* Cards Grid */}
            <div
              className="flex"
              style={{
                alignSelf: 'stretch',
                gap: '12px'
              }}
            >
              {endingSoonItems.map((item) => (
                <AuctionCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  currentBid={`$${item.current_price?.toLocaleString() || '0'}`}
                  imageSrc={item.image_urls?.[0] || '/images/placeholder.png'}
                  compact
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
