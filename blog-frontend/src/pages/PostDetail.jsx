import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function PostDetail() {
  const { id } = useParams(); // URL에서 게시글 ID 추출
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = 'https://blog-backend-35eq.onrender.com';

  useEffect(() => {
    // 백엔드로부터 상세 게시글 데이터 가져오기
    axios.get(`${BACKEND_URL}/posts/${id}/`)
      .then((res) => {
        setPost(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("게시글을 불러오는데 실패했습니다:", err);
        setLoading(false);
      });
  }, [id]);

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">존재하지 않거나 삭제된 게시글입니다.</p>
        <Link to="/" className="text-red-500 font-medium hover:underline">← 홈으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-8 bg-white rounded-2xl border border-gray-100 shadow-sm mt-4">
      {/* 1. 상단 메타 정보 (카테고리, 제목, 날짜) */}
      <header className="mb-8 pb-6 border-b border-gray-100">
        <span className="inline-block bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
          {post.category_name || '일반'}
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center text-sm text-gray-400 gap-4">
          <span>📅 {formatDate(post.created_at)}</span>
          <span>👁️ {post.view_count} views</span>
        </div>
      </header>

      {/* src/pages/PostDetail.jsx 의 이미지 렌더링 영역 수정 */}
      {post.image && (
        <div className="w-full max-h-[450px] overflow-hidden rounded-xl mb-8 shadow-sm bg-gray-50">
          <img 
            src={
              post.image.startsWith('http') 
                ? post.image 
                : `${BACKEND_URL}${post.image.startsWith('/') ? post.image : '/' + post.image}`
            } // 슬래시(/)가 있든 없든 무조건 완벽한 주소로 결합하는 치트키 로직!
            alt={post.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // 혹시라도 이미지 로드 실패 시 무한 루프 방지 및 콘솔에 범인 주소 찍기
              console.error("상세페이지 이미지 로드 실패 주소:", e.target.src);
            }}
          />
        </div>
      )}

      {/* 3. 본문 텍스트 영역 (white-space-pre-wrap으로 줄바꿈 보존) */}
      <div className="text-gray-800 text-base md:text-lg leading-relaxed space-y-4 whitespace-pre-wrap font-normal break-words min-h-[200px]">
        {post.content}
      </div>

      {/* 4. 하단 네비게이션 버튼 */}
      <footer className="mt-12 pt-6 border-t border-gray-100 flex justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="text-gray-600 hover:text-red-500 font-medium transition flex items-center gap-1 text-sm"
        >
          ← 뒤로 가기
        </button>
        <Link 
          to="/" 
          className="bg-gray-900 text-white hover:bg-red-500 px-4 py-2 rounded-xl font-medium text-sm transition shadow-sm"
        >
          목록으로
        </Link>
      </footer>
    </article>
  );
}

export default PostDetail;