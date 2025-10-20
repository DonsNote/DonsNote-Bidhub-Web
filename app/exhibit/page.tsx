'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Image from 'next/image';
import { auctionApi } from '@/lib/api/auction.api';
import { authApi } from '@/lib/api/auth.api';

export default function ExhibitPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingBid: '',
    reservePrice: '',
    duration: ''
  });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await authApi.getCurrentUser();
        if (!currentUser) {
          router.push('/login');
          return;
        }
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to load user:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = tagInput.trim();

    // 쉼표, 스페이스, 엔터 키로 태그 추가
    if ((e.key === ',' || e.key === ' ' || e.key === 'Enter') && value) {
      e.preventDefault();
      addTag(value);
    }
    // 백스페이스로 마지막 태그 삭제 (입력 필드가 비어있을 때)
    else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = (tag: string) => {
    // 최대 5개까지만 허용
    if (tags.length >= 5) {
      alert('Maximum 5 tags allowed');
      return;
    }

    // 중복 태그 방지
    if (tags.includes(tag)) {
      setTagInput('');
      return;
    }

    setTags([...tags, tag]);
    setTagInput('');
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const newImages = [...images, ...files].slice(0, 10); // 최대 10개
    setImages(newImages);

    // 미리보기 생성
    const newPreviews: string[] = [];
    newImages.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === newImages.length) {
          setImagePreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleSubmit = async () => {
    // 폼 검증
    if (!formData.title || !formData.description || tags.length === 0 || !formData.startingBid || !formData.duration) {
      alert('Please fill in all required fields');
      return;
    }

    if (!user) {
      alert('You must be logged in to create an auction');
      router.push('/login');
      return;
    }

    try {
      setSubmitting(true);

      // 종료 시간 계산 (현재 시간 + duration 일)
      const endTime = new Date();
      endTime.setDate(endTime.getDate() + parseInt(formData.duration));

      // 이미지 URL 배열 생성 (실제로는 이미지를 업로드하고 URL을 받아와야 함)
      // 임시로 placeholder 이미지 사용
      const imageUrls = imagePreviews.length > 0
        ? imagePreviews
        : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'];

      // 경매 생성
      const auctionData = {
        title: formData.title,
        description: formData.description,
        starting_price: parseFloat(formData.startingBid),
        reserve_price: formData.reservePrice ? parseFloat(formData.reservePrice) : undefined,
        image_urls: imageUrls,
        end_time: endTime.toISOString(),
        seller_id: user.id,
        condition: 'good',
        location: 'Seoul, Korea',
        shipping_cost: 0
      };

      const result = await auctionApi.createAuction(auctionData);

      if (result) {
        alert('Item listed successfully!');
        router.push('/my-bid');
      } else {
        throw new Error('Failed to create auction');
      }
    } catch (error) {
      console.error('Error creating auction:', error);
      alert(error instanceof Error ? error.message : 'Failed to create auction');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <Header />

      <main style={{ display: 'flex', justifyContent: 'center', padding: '20px 160px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '20px 0px', width: '960px' }}>
          {/* Page Title */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '288px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 700, lineHeight: '40px', color: '#121417', fontFamily: 'Work Sans', margin: 0 }}>
                List Your Item
              </h1>
            </div>
          </div>

          {/* Item Title */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '12px 16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ padding: '0px 0px 8px' }}>
                <label style={{ fontSize: '16px', fontWeight: 500, lineHeight: '24px', color: '#121417', fontFamily: 'Work Sans' }}>
                  Item Title
                </label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', padding: '15px', border: '1px solid #DBE0E5', borderRadius: '8px', backgroundColor: '#FFFFFF' }}>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter item title"
                  style={{ width: '100%', fontSize: '16px', lineHeight: '24px', color: '#121417', fontFamily: 'Work Sans', border: 'none', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '12px 16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ padding: '0px 0px 8px' }}>
                <label style={{ fontSize: '16px', fontWeight: 500, lineHeight: '24px', color: '#121417', fontFamily: 'Work Sans' }}>
                  Description
                </label>
              </div>
              <div style={{ display: 'flex', padding: '15px', border: '1px solid #DBE0E5', borderRadius: '8px', backgroundColor: '#FFFFFF', minHeight: '120px' }}>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter item description"
                  style={{ width: '100%', fontSize: '16px', lineHeight: '24px', color: '#121417', fontFamily: 'Work Sans', border: 'none', outline: 'none', resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '12px 16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ padding: '0px 0px 8px' }}>
                <label style={{ fontSize: '16px', fontWeight: 500, lineHeight: '24px', color: '#121417', fontFamily: 'Work Sans' }}>
                  Tags (Max 5)
                </label>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', padding: '10px 15px', border: '1px solid #DBE0E5', borderRadius: '8px', backgroundColor: '#FFFFFF', minHeight: '56px' }}>
                {/* Display existing tags */}
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 12px',
                      backgroundColor: '#268CF5',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#FFFFFF',
                      fontFamily: 'Work Sans'
                    }}
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => removeTag(index)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '16px',
                        height: '16px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        color: '#FFFFFF'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {/* Input field for new tags */}
                {tags.length < 5 && (
                  <input
                    type="text"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder={tags.length === 0 ? "Enter tags (press comma or space)" : ""}
                    style={{
                      flex: 1,
                      minWidth: '150px',
                      fontSize: '16px',
                      lineHeight: '24px',
                      color: '#121417',
                      fontFamily: 'Work Sans',
                      border: 'none',
                      outline: 'none',
                      backgroundColor: 'transparent'
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Starting Bid */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '12px 16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ padding: '0px 0px 8px' }}>
                <label style={{ fontSize: '16px', fontWeight: 500, lineHeight: '24px', color: '#121417', fontFamily: 'Work Sans' }}>
                  Starting Bid
                </label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', padding: '15px', border: '1px solid #DBE0E5', borderRadius: '8px', backgroundColor: '#FFFFFF' }}>
                <input
                  type="number"
                  name="startingBid"
                  value={formData.startingBid}
                  onChange={handleInputChange}
                  placeholder="Enter starting bid"
                  style={{ width: '100%', fontSize: '16px', lineHeight: '24px', color: '#121417', fontFamily: 'Work Sans', border: 'none', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Reserve Price */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '12px 16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ padding: '0px 0px 8px' }}>
                <label style={{ fontSize: '16px', fontWeight: 500, lineHeight: '24px', color: '#121417', fontFamily: 'Work Sans' }}>
                  Reserve Price (Optional)
                </label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', padding: '15px', border: '1px solid #DBE0E5', borderRadius: '8px', backgroundColor: '#FFFFFF' }}>
                <input
                  type="number"
                  name="reservePrice"
                  value={formData.reservePrice}
                  onChange={handleInputChange}
                  placeholder="Enter reserve price"
                  style={{ width: '100%', fontSize: '16px', lineHeight: '24px', color: '#121417', fontFamily: 'Work Sans', border: 'none', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Auction Duration */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '12px 16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ padding: '0px 0px 8px' }}>
                <label style={{ fontSize: '16px', fontWeight: 500, lineHeight: '24px', color: '#121417', fontFamily: 'Work Sans' }}>
                  Auction Duration
                </label>
              </div>
              <div style={{ position: 'relative', height: '56px', border: '1px solid #DBE0E5', borderRadius: '8px', backgroundColor: '#FFFFFF' }}>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    height: '100%',
                    padding: '0 15px',
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: formData.duration ? '#121417' : '#61758A',
                    fontFamily: 'Work Sans',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    appearance: 'none'
                  }}
                >
                  <option value="">Select duration</option>
                  <option value="1">1 Day</option>
                  <option value="3">3 Days</option>
                  <option value="7">7 Days</option>
                  <option value="14">14 Days</option>
                  <option value="30">30 Days</option>
                </select>
                <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1L6 6L11 1" stroke="#61758A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Images */}
          <div style={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '24px',
                padding: '56px 24px',
                border: `2px dashed ${isDragging ? '#268CF5' : '#DBE0E5'}`,
                borderRadius: '8px',
                backgroundColor: isDragging ? '#F0F8FF' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, lineHeight: '23px', color: '#121417', fontFamily: 'Work Sans', margin: 0, textAlign: 'center' }}>
                    Upload Images
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p style={{ fontSize: '14px', lineHeight: '21px', color: '#121417', fontFamily: 'Work Sans', margin: 0, textAlign: 'center' }}>
                    Drag and drop or click to upload images of your item
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0px 16px', height: '40px', backgroundColor: '#F0F2F5', borderRadius: '8px' }}>
                <label htmlFor="image-upload" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, lineHeight: '21px', color: '#121417', fontFamily: 'Work Sans', textAlign: 'center' }}>
                    Upload Images
                  </span>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px', marginTop: '24px' }}>
                {imagePreviews.map((preview, index) => (
                  <div key={index} style={{ position: 'relative', width: '100%', paddingBottom: '100%', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#F0F2F5' }}>
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* List Item Button */}
          <div style={{ display: 'flex', padding: '12px 16px' }}>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0px 16px',
                height: '40px',
                backgroundColor: submitting ? '#9CA3AF' : '#268CF5',
                borderRadius: '8px',
                border: 'none',
                cursor: submitting ? 'not-allowed' : 'pointer',
                width: '100%'
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: 700, lineHeight: '21px', color: '#FFFFFF', fontFamily: 'Work Sans', textAlign: 'center' }}>
                {submitting ? 'Creating...' : 'List Item'}
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
