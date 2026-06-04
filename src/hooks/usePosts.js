import { useEffect, useState } from 'react';
import { fetchPosts, searchPosts } from '../utils/api';
import { useStore } from '../store/store';

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 스토어에서 검색어 가져오기
  const searchQuery = useStore((state) => state.searchQuery);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let response;
        
        if (searchQuery.trim()) {
          // 검색어가 있으면 검색 API 호출
          response = await searchPosts(searchQuery);
        } else {
          // 없으면 전체 게시글 조회
          response = await fetchPosts();
        }
        
        setPosts(response.data.results || response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('게시글을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [searchQuery]);
  
  return { posts, loading, error };
};