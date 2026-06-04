import { create } from 'zustand';

// ⭐ Zustand 스토어: 전역 상태 관리
export const useStore = create((set) => ({
  // 1️⃣ 검색 관련
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  // 2️⃣ 선택된 카테고리
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  // 3️⃣ 로딩 상태
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  // 4️⃣ 에러 메시지
  error: null,
  setError: (error) => set({ error }),
  
  // 5️⃣ 리셋 함수
  reset: () => set({
    searchQuery: '',
    selectedCategory: null,
    isLoading: false,
    error: null,
  }),
}));