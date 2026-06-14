import { create } from 'zustand';

export const useStore = create((set) => ({
  // 검색 관련
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  // 선택된 카테고리
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  // 로딩 상태
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  // 에러 메시지
  error: null,
  setError: (error) => set({ error }),

  // 🔐 추가: 인증(Auth) 관련 상태 및 함수
  // 브라우저 로컬스토리지에 기존 토큰이 있는지 확인하여 초기화합니다.
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  // 로그인 성공 시 토큰을 보관하는 함수
  login: (token) => {
    localStorage.setItem('token', token);
    set({ token, isAuthenticated: true });
  },

  // 로그아웃 시 흔적을 지우는 함수
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, isAuthenticated: false });
  },
  
  // 리셋 함수 (인증 정보는 리셋되면 안 되므로 기존 상태들만 초기화)
  reset: () => set({
    searchQuery: '',
    selectedCategory: null,
    isLoading: false,
    error: null,
  }),
}));