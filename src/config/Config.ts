// src/config/displayConfig.ts

// 초기 값은 클라이언트에서만 접근 가능하니 기본값 설정
export const DISPLAY_CONFIG = {
    getAspectRatio: () => {
      if (typeof window === "undefined") {
        return 16 / 9; // 서버 환경에서는 기본값 (예: 16:9 비율)
      }
      return window.innerWidth / window.innerHeight;
    },
    width: () => (typeof window === "undefined" ? 1920 : window.innerWidth), // 기본값 예시
    height: () => (typeof window === "undefined" ? 1080 : window.innerHeight),
  };