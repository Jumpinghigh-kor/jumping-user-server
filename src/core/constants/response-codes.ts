// 공통 응답 코드
export const COMMON_RESPONSE_CODES = {
  SUCCESS: '0000',
  FAIL: '9999',
  NO_DATA: '1000',
  DUPLICATE: '1001'
} as const;

// 출석 관련 응답 코드
export const CHECKIN_RESPONSE_CODES = {
  MEMBER_NOT_FOUND: '1001',    // 회원 정보 불일치
  NO_MEMBERSHIP: '1002',       // 유효한 회원권 없음
} as const; 