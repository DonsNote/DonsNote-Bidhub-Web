'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Notification, NotificationType } from '@/types/notification.types';
import { notificationApi } from '@/lib/api/notification.api';

/**
 * Notification Dropdown Component
 * 헤더의 알림 드롭다운
 */

interface NotificationDropdownProps {
  user: any;
}

export default function NotificationDropdown({ user }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // 읽지 않은 알림 개수 로드
  useEffect(() => {
    if (!user) return;

    const loadUnreadCount = async () => {
      try {
        const count = await notificationApi.getUnreadCount();
        setUnreadCount(count);
      } catch (error) {
        console.error('Failed to load unread count:', error);
      }
    };

    loadUnreadCount();

    // 30초마다 업데이트
    const interval = setInterval(loadUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [user]);

  // 드롭다운 열 때 알림 목록 로드
  const handleToggle = async () => {
    if (!isOpen && user) {
      setLoading(true);
      try {
        const data = await notificationApi.getNotifications({ limit: 10 });
        setNotifications(data);
      } catch (error) {
        console.error('Failed to load notifications:', error);
      } finally {
        setLoading(false);
      }
    }
    setIsOpen(!isOpen);
  };

  // 알림 읽음 처리
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      try {
        await notificationApi.markAsRead(notification.id);
        setNotifications(prev =>
          prev.map(n => (n.id === notification.id ? { ...n, read: true } : n))
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }
    setIsOpen(false);
  };

  // 모두 읽음 처리
  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  // 알림 타입별 아이콘
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.BID_PLACED:
        return '🎯';
      case NotificationType.BID_OUTBID:
        return '⚠️';
      case NotificationType.AUCTION_ENDING:
        return '⏰';
      case NotificationType.AUCTION_WON:
        return '🎉';
      case NotificationType.AUCTION_LOST:
        return '😢';
      case NotificationType.TRADE_OFFER:
        return '🔄';
      case NotificationType.TRADE_ACCEPTED:
        return '✅';
      case NotificationType.TRADE_REJECTED:
        return '❌';
      default:
        return '📢';
    }
  };

  // 상대 시간 표시 (예: "5분 전")
  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 알림 벨 버튼 */}
      <button
        onClick={handleToggle}
        style={{
          position: 'relative',
          width: '40px',
          height: '40px',
          backgroundColor: '#F0F2F5',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: 'none',
          cursor: 'pointer'
        }}
        aria-label="알림"
      >
        {/* 종 아이콘 */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 6.66667C15 5.34058 14.4732 4.06881 13.5355 3.13113C12.5979 2.19345 11.3261 1.66667 10 1.66667C8.67392 1.66667 7.40215 2.19345 6.46447 3.13113C5.52678 4.06881 5 5.34058 5 6.66667C5 12.5 2.5 14.1667 2.5 14.1667H17.5C17.5 14.1667 15 12.5 15 6.66667Z"
            stroke="#121417"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.4417 17.5C11.2952 17.7526 11.0849 17.9622 10.8319 18.1079C10.5789 18.2537 10.292 18.3304 10 18.3304C9.70803 18.3304 9.42117 18.2537 9.16816 18.1079C8.91515 17.9622 8.70486 17.7526 8.55835 17.5"
            stroke="#121417"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* 읽지 않은 알림 배지 */}
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: '18px',
              height: '18px',
              padding: '0 5px',
              fontSize: '10px',
              fontWeight: 700,
              fontFamily: 'Work Sans',
              lineHeight: '1',
              color: '#FFFFFF',
              backgroundColor: '#EF4444',
              borderRadius: '9px',
              border: '2px solid #FFFFFF'
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '48px',
            right: '0',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            minWidth: '320px',
            maxWidth: '380px',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          {/* 헤더 */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #E5E8EB',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h3
              style={{
                fontSize: '16px',
                lineHeight: '24px',
                fontWeight: 600,
                color: '#121417',
                fontFamily: 'Work Sans',
                margin: 0
              }}
            >
              알림
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                style={{
                  fontSize: '14px',
                  lineHeight: '21px',
                  color: '#268CF5',
                  fontWeight: 500,
                  fontFamily: 'Work Sans',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                모두 읽음
              </button>
            )}
          </div>

          {/* 알림 목록 */}
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {loading ? (
              <div
                style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  fontSize: '14px',
                  lineHeight: '21px',
                  color: '#61758A',
                  fontFamily: 'Work Sans'
                }}
              >
                로딩 중...
              </div>
            ) : notifications.length === 0 ? (
              <div
                style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  fontSize: '14px',
                  lineHeight: '21px',
                  color: '#61758A',
                  fontFamily: 'Work Sans'
                }}
              >
                알림이 없습니다
              </div>
            ) : (
              <>
                {notifications.map((notification, index) => (
                  <div key={notification.id}>
                    {notification.link ? (
                      <Link
                        href={notification.link}
                        onClick={() => handleNotificationClick(notification)}
                        style={{
                          display: 'block',
                          padding: '12px 16px',
                          backgroundColor: !notification.read ? '#F0F7FF' : 'transparent',
                          borderBottom: index < notifications.length - 1 ? '1px solid #F0F2F5' : 'none',
                          textDecoration: 'none',
                          transition: 'background-color 0.2s',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          if (notification.read) {
                            e.currentTarget.style.backgroundColor = '#F0F2F5';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = !notification.read ? '#F0F7FF' : 'transparent';
                        }}
                      >
                        <NotificationItem
                          notification={notification}
                          getNotificationIcon={getNotificationIcon}
                          getRelativeTime={getRelativeTime}
                        />
                      </Link>
                    ) : (
                      <div
                        onClick={() => handleNotificationClick(notification)}
                        style={{
                          padding: '12px 16px',
                          backgroundColor: !notification.read ? '#F0F7FF' : 'transparent',
                          borderBottom: index < notifications.length - 1 ? '1px solid #F0F2F5' : 'none',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          if (notification.read) {
                            e.currentTarget.style.backgroundColor = '#F0F2F5';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = !notification.read ? '#F0F7FF' : 'transparent';
                        }}
                      >
                        <NotificationItem
                          notification={notification}
                          getNotificationIcon={getNotificationIcon}
                          getRelativeTime={getRelativeTime}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          {/* 푸터 */}
          {notifications.length > 0 && (
            <div
              style={{
                borderTop: '1px solid #E5E8EB'
              }}
            >
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'transparent',
                  textAlign: 'center',
                  fontSize: '14px',
                  lineHeight: '21px',
                  color: '#268CF5',
                  fontWeight: 500,
                  fontFamily: 'Work Sans',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F2F5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                모든 알림 보기
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 알림 아이템 컴포넌트
function NotificationItem({
  notification,
  getNotificationIcon,
  getRelativeTime,
}: {
  notification: Notification;
  getNotificationIcon: (type: NotificationType) => string;
  getRelativeTime: (dateString: string) => string;
}) {
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
      {/* 아이콘 */}
      <div style={{ flexShrink: 0, fontSize: '20px', lineHeight: '24px' }}>
        {getNotificationIcon(notification.type)}
      </div>

      {/* 내용 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: '14px',
            lineHeight: '21px',
            fontWeight: 500,
            color: '#121417',
            fontFamily: 'Work Sans',
            marginBottom: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {notification.title}
        </p>
        <p
          style={{
            fontSize: '13px',
            lineHeight: '19px',
            color: '#61758A',
            fontFamily: 'Work Sans',
            marginBottom: '4px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {notification.message}
        </p>
        <p
          style={{
            fontSize: '12px',
            lineHeight: '18px',
            color: '#9CA9B8',
            fontFamily: 'Work Sans'
          }}
        >
          {getRelativeTime(notification.createdAt)}
        </p>
      </div>

      {/* 읽지 않음 표시 */}
      {!notification.read && (
        <div style={{ flexShrink: 0, paddingTop: '6px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#268CF5',
              borderRadius: '50%'
            }}
          ></div>
        </div>
      )}
    </div>
  );
}
