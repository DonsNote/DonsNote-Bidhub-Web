import Image from 'next/image';
import Link from 'next/link';

interface AuctionCardProps {
  id: string;
  title: string;
  currentBid: string;
  imageSrc: string;
  compact?: boolean;
  priority?: boolean;
}

export default function AuctionCard({ id, title, currentBid, imageSrc, compact = false, priority = false }: AuctionCardProps) {
  const cardGap = compact ? '12px' : '16px';
  const bottomPadding = compact ? '12px' : '0px';

  return (
    <Link href={`/auction/${id}`} style={{ textDecoration: 'none', flex: 1, display: 'flex' }}>
      <div
        className="flex flex-col rounded-lg"
        style={{
          alignSelf: 'stretch',
          gap: cardGap,
          paddingBottom: bottomPadding,
          flex: 1,
          cursor: 'pointer'
        }}
      >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{
          width: '100%',
          aspectRatio: '1.75',
          borderRadius: '15px',
          boxShadow: '0 7px 15px rgba(0, 0, 0, 0.15)'
        }}
      >
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Info */}
      <div className="flex flex-col">
        <h3
          className="font-medium"
          style={{
            fontSize: '16px',
            lineHeight: '24px',
            color: '#121417',
            fontFamily: 'Work Sans'
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: '14px',
            lineHeight: '21px',
            color: '#61758A',
            fontFamily: 'Work Sans'
          }}
        >
          Current Bid: {currentBid}
        </p>
      </div>
    </div>
    </Link>
  );
}
