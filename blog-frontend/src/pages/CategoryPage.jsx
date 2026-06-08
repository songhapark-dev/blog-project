import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/PostCard';

function CategoryPage() {
  const { categoryId } = useParams(); // URL 주소에서 카테고리 ID를 추출 (예: /category/3)
  const [posts, setPosts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = 'https://blog-backend-35eq.onrender.com';

  useEffect(() => {
    setLoading(true);
    
    // 1. 전체 게시글 중 해당 카테고리 글만 필터링해서 가져오기 (혹은 백엔드 카테고리별 API 요청)
    // 장고 DRF는 보통 /posts/?category=ID 형태로 필터링을 지원합니다.
    axios.get(`${BACKEND_URL}/posts/?category=${categoryId}`)
      .then((res) => {
        setPosts(res.data);
        
        // 데이터가 있다면 첫 번째 글에서 카테고리 이름을 추출하여 타이틀로 사용
        if (res.data.length > 0) {
          setCategoryName(res.data[0].category_name);
        } else {
          // 글이 없을 경우를 대비해 카테고리 이름만 따로 가져오는 예외 처리
          setCategoryName('게시판');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("카테고리 글을 불러오는데 실패했습니다:", err);
        setLoading(false);
      });
  }, [categoryId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 🏷️ 상단 카테고리 헤더 타이틀 */}
      <div className="border-b border-gray-100 pb-6 mb-10">
        <h1 className="text-3xl font-extrabold text-gray-950 flex items-center gap-2">
          <span className="text-red-500">#</span> {categoryName}
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          총 <span className="font-semibold text-gray-700">{posts.length}개</span>의 게시글이 있습니다.
        </p>
      </div>

      {/* 🎴 그리드 레이아웃 스타일 적용 */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        /* 텅 비어있을 때 예외 디자인 */
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-lg mb-4">아직 작성된 게시글이 없습니다. 📭</p>
          <Link to="/" className="text-sm bg-gray-900 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-500 transition">
            홈으로 가기
          </Link>
        </div>
      )}
    </div>
  );
}

export default CategoryPage;