import { useEffect, useState } from 'react';
import { fetchPost, incrementView } from '../utils/api';

export const usePostDetail = (postId) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 게시글 조회
        const response = await fetchPost(postId);
        setPost(response.data);
        
        // 조회수 증가
        await incrementView(postId);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('게시글을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [postId]);
  
  return { post, loading, error };
};