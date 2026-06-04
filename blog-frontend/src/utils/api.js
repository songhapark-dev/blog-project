import axios from 'axios';

// API 베이스 URL (환경변수에서 가져옴)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API 함수들

// 1️⃣ 게시글 관련
export const fetchPosts = (page = 1) => {
  return api.get('/posts/', { params: { page } });
};

export const fetchPost = (id) => {
  return api.get(`/posts/${id}/`);
};

export const searchPosts = (query) => {
  return api.get('/posts/search/', { params: { q: query } });
};

export const incrementView = (id) => {
  return api.post(`/posts/${id}/view/`);
};

// 2️⃣ 카테고리 관련
export const fetchCategories = () => {
  return api.get('/categories/');
};

export const fetchCategoryPosts = (categoryId, page = 1) => {
  return api.get('/posts/', { params: { category: categoryId, page } });
};

// 3️⃣ 댓글 관련
export const fetchComments = (postId) => {
  return api.get('/comments/', { params: { post: postId } });
};

// 4️⃣ 에러 처리 인터셉터 (선택사항)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;