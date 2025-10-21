/**
 * Formatting Utilities
 * 숫자, 날짜, 문자열 포맷팅을 위한 유틸리티 함수들
 */

/**
 * 숫자를 통화 형식으로 포맷팅
 * @param amount - 금액
 * @param currency - 통화 기호 (기본값: '$')
 * @returns 포맷팅된 통화 문자열
 * @example formatCurrency(1234.56) => "$1,234.56"
 */
export const formatCurrency = (amount: number, currency: string = '$'): string => {
  return `${currency}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
};

/**
 * 숫자를 간단한 형식으로 포맷팅 (1K, 1M 등)
 * @param num - 숫자
 * @returns 포맷팅된 문자열
 * @example formatNumber(1234) => "1.2K"
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * 남은 시간을 계산하고 포맷팅
 * @param endTime - 종료 시간 (ISO 문자열 또는 null)
 * @returns 포맷팅된 시간 문자열
 * @example calculateTimeLeft('2025-01-30T10:00:00Z') => "2d 5h"
 */
export const calculateTimeLeft = (endTime: string | null): string => {
  if (!endTime) return 'Time expired';

  const now = new Date();
  const end = new Date(endTime);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return 'Ended';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
};

/**
 * 날짜를 포맷팅
 * @param date - Date 객체 또는 ISO 문자열
 * @param format - 포맷 타입 ('short' | 'long' | 'time')
 * @returns 포맷팅된 날짜 문자열
 */
export const formatDate = (
  date: Date | string,
  format: 'short' | 'long' | 'time' = 'short'
): string => {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) return 'Invalid date';

  switch (format) {
    case 'short':
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    case 'long':
      return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    case 'time':
      return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    default:
      return d.toLocaleDateString();
  }
};

/**
 * 상대적인 시간 표시 (예: "2분 전", "3시간 전")
 * @param date - Date 객체 또는 ISO 문자열
 * @returns 상대 시간 문자열
 */
export const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return '방금 전';
};

/**
 * 문자열을 말줄임표로 자르기
 * @param text - 원본 텍스트
 * @param maxLength - 최대 길이
 * @returns 잘린 텍스트
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * 퍼센트 계산 및 포맷팅
 * @param current - 현재 값
 * @param total - 전체 값
 * @returns 포맷팅된 퍼센트 문자열
 */
export const formatPercentage = (current: number, total: number): string => {
  if (total === 0) return '0%';
  const percentage = (current / total) * 100;
  return `${percentage.toFixed(1)}%`;
};

/**
 * 전화번호 포맷팅
 * @param phone - 전화번호
 * @returns 포맷팅된 전화번호
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return phone;
};
