import Image from 'next/image';

export default function SearchBar() {
  return (
    <div style={{ padding: '12px 16px' }}>
      <div
        className="flex rounded-lg overflow-hidden"
        style={{
          height: '48px',
          alignSelf: 'stretch'
        }}
      >
        {/* Search Icon */}
        <div
          className="flex items-center"
          style={{
            backgroundColor: '#F0F2F5',
            paddingLeft: '16px',
            borderRadius: '8px 0 0 8px'
          }}
        >
          <div style={{ width: '24px', height: '24px' }}>
            <Image
              src="/images/search-icon.svg"
              alt="Search"
              width={24}
              height={24}
            />
          </div>
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search for items"
          className="flex-1"
          style={{
            backgroundColor: '#F0F2F5',
            padding: '8px 16px 8px 8px',
            fontSize: '16px',
            lineHeight: '24px',
            color: '#61758A',
            fontFamily: 'Work Sans',
            border: 'none',
            outline: 'none',
            borderRadius: '0 8px 8px 0'
          }}
        />
      </div>
    </div>
  );
}
