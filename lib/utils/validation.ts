/**
 * Validation Utilities
 * 폼 입력 검증을 위한 유틸리티 함수들
 */

import { INPUT_LIMITS, TAG_LIMITS } from './constants';

/**
 * 이메일 유효성 검증
 * @param email - 이메일 주소
 * @returns 유효성 여부
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * UUID 유효성 검증
 * @param uuid - UUID 문자열
 * @returns 유효성 여부
 */
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * URL 유효성 검증
 * @param url - URL 문자열
 * @returns 유효성 여부
 */
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 제목 유효성 검증
 * @param title - 제목
 * @returns { valid: boolean, error?: string }
 */
export const validateTitle = (title: string): { valid: boolean; error?: string } => {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: '제목을 입력해주세요.' };
  }
  if (title.length < INPUT_LIMITS.TITLE.MIN) {
    return { valid: false, error: `제목은 최소 ${INPUT_LIMITS.TITLE.MIN}자 이상이어야 합니다.` };
  }
  if (title.length > INPUT_LIMITS.TITLE.MAX) {
    return { valid: false, error: `제목은 최대 ${INPUT_LIMITS.TITLE.MAX}자까지 입력 가능합니다.` };
  }
  return { valid: true };
};

/**
 * 설명 유효성 검증
 * @param description - 설명
 * @returns { valid: boolean, error?: string }
 */
export const validateDescription = (description: string): { valid: boolean; error?: string } => {
  if (!description || description.trim().length === 0) {
    return { valid: false, error: '설명을 입력해주세요.' };
  }
  if (description.length < INPUT_LIMITS.DESCRIPTION.MIN) {
    return { valid: false, error: `설명은 최소 ${INPUT_LIMITS.DESCRIPTION.MIN}자 이상이어야 합니다.` };
  }
  if (description.length > INPUT_LIMITS.DESCRIPTION.MAX) {
    return { valid: false, error: `설명은 최대 ${INPUT_LIMITS.DESCRIPTION.MAX}자까지 입력 가능합니다.` };
  }
  return { valid: true };
};

/**
 * 입찰 금액 유효성 검증
 * @param amount - 입찰 금액
 * @param currentBid - 현재 입찰가
 * @returns { valid: boolean, error?: string }
 */
export const validateBidAmount = (
  amount: number,
  currentBid: number
): { valid: boolean; error?: string } => {
  if (isNaN(amount) || amount <= 0) {
    return { valid: false, error: '유효한 금액을 입력해주세요.' };
  }
  if (amount <= currentBid) {
    return { valid: false, error: '입찰가는 현재가보다 높아야 합니다.' };
  }
  if (amount < INPUT_LIMITS.BID_AMOUNT.MIN) {
    return { valid: false, error: `최소 입찰가는 $${INPUT_LIMITS.BID_AMOUNT.MIN}입니다.` };
  }
  if (amount > INPUT_LIMITS.BID_AMOUNT.MAX) {
    return { valid: false, error: `최대 입찰가는 $${INPUT_LIMITS.BID_AMOUNT.MAX}입니다.` };
  }
  return { valid: true };
};

/**
 * 태그 유효성 검증
 * @param tags - 태그 배열
 * @returns { valid: boolean, error?: string }
 */
export const validateTags = (tags: string[]): { valid: boolean; error?: string } => {
  if (tags.length < TAG_LIMITS.MIN_COUNT) {
    return { valid: false, error: `최소 ${TAG_LIMITS.MIN_COUNT}개의 태그를 입력해주세요.` };
  }
  if (tags.length > TAG_LIMITS.MAX_COUNT) {
    return { valid: false, error: `최대 ${TAG_LIMITS.MAX_COUNT}개까지 입력 가능합니다.` };
  }

  for (const tag of tags) {
    if (tag.length < TAG_LIMITS.MIN_LENGTH) {
      return { valid: false, error: `태그는 최소 ${TAG_LIMITS.MIN_LENGTH}자 이상이어야 합니다.` };
    }
    if (tag.length > TAG_LIMITS.MAX_LENGTH) {
      return { valid: false, error: `태그는 최대 ${TAG_LIMITS.MAX_LENGTH}자까지 입력 가능합니다.` };
    }
  }

  return { valid: true };
};

/**
 * 비밀번호 강도 검증
 * @param password - 비밀번호
 * @returns { valid: boolean, error?: string }
 */
export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (password.length < 8) {
    return { valid: false, error: '비밀번호는 최소 8자 이상이어야 합니다.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: '대문자를 포함해야 합니다.' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: '소문자를 포함해야 합니다.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: '숫자를 포함해야 합니다.' };
  }
  return { valid: true };
};

/**
 * 날짜 유효성 검증 (미래 날짜인지)
 * @param date - 날짜
 * @returns { valid: boolean, error?: string }
 */
export const validateFutureDate = (date: Date | string): { valid: boolean; error?: string } => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();

  if (isNaN(d.getTime())) {
    return { valid: false, error: '유효한 날짜를 입력해주세요.' };
  }
  if (d <= now) {
    return { valid: false, error: '종료 시간은 현재보다 미래여야 합니다.' };
  }
  return { valid: true };
};
