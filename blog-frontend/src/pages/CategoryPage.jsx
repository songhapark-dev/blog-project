import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/PostCard';

function CategoryPage() {
  const { categoryId } = useParams(); 
  const [posts, setPosts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = 'https://blog-backend-35eq.onrender.com';

  useEffect(() => {
    setLoading(true);
    
    // 백엔드 필터 오류 방지: 전체 글과 카테고리명을 동시에 가져와서 프론트에서 정교하게 조립합니다.
    const fetchCategoryData = async () => {
      try {
        const [postsRes, categoriesRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/posts/`),
          axios.get(`${BACKEND_URL}/categories/`)
        ]);

        // 1. DRF 페이지네이션 껍데기(results) 방어막 대책
        const allPosts = postsRes.data.results || postsRes.data;
        const allCategories = categoriesRes.data.results || categoriesRes.data;

        // 2. 현재 카테고리 ID와 일치하는 글들만 쏙쏙 골라내기 (String 변환 비교로 안전하게)
        const filteredPosts = allPosts.filter(
          (post) => String(post.category) === String(categoryId)
        );
        setPosts(filteredPosts);

        // 3. 글이 0개여도 백엔드 카테고리 목록에서 정확한 게시판 이름 찾아오기!
        const currentCategory = allCategories.find(
          (cat) => String(cat.id) === String(categoryId)
        );
        setCategoryName(currentCategory ? currentCategory.name : '게시판');

        setLoading(false);
      } catch (err) {
        console.error("카테고리 데이터를 가져오는데 실패했습니다:", err);
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 상단 카테고리 헤더 타이틀 완벽 복구 */}
      <div className="border-b border-gray-100 pb-6 mb-10">
        <h1 className="text-3xl font-extrabold text-gray-950 flex items-center gap-2">
          <span className="text-red-500">#</span> {categoryName}
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          총 <span className="font-semibold text-gray-700">{posts.length}개</span>의 게시글이 있습니다.
        </p>
      </div>

      {/* 그리드 레이아웃 스타일 */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-lg mb-4">아직 작성된 게시글이 없습니다. 📭</p>
          <Link to="/" className="text-sm bg-gray-900 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition">
            홈으로 가기
          </Link>
        </div>
      )}
    </div>
  );
}

export default CategoryPage;