import { useEffect, useState } from 'react';
import { fetchCategories } from '../utils/api';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetchCategories();
        setCategories(response.data.results || response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('카테고리를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return { categories, loading, error };
};