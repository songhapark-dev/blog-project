import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useStore } from '../store/store'; // Zustand 금고 연동
import MarkdownIt from 'markdown-it';

const mdParser = new MarkdownIt({
  html: true,        
  linkify: true,     
  breaks: true,      
});

function PostDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const token = useStore((state) => state.token);
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = 'https://blog-backend-35eq.onrender.com';

  useEffect(() => {
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

  // 현장 즉시 삭제(DELETE) 핸들러
  const handleFieldDelete = async () => {
    if (window.confirm(`⚠️ [위험] \n"${post.title}" \n이 에세이를 서버에서 영구 삭제하시겠습니까?`)) {
      try {
        await axios.delete(`${BACKEND_URL}/posts/${id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        alert('포스팅이 삭제되었습니다.');
        navigate('/'); 
      } catch (err) {
        console.error('현장 삭제 에러:', err);
        alert('삭제 권한이 없거나 백엔드 에러가 발생했습니다.');
      }
    }
  };

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
      <header className="mb-6 pb-6 border-b border-gray-100">
        <span className="inline-block bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
          {post.category_name || '일반'}
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex gap-4">
            <span>📅 {formatDate(post.created_at)}</span>
            <span>👁️ {post.view_count} views</span>
          </div>
          
          {isAuthenticated && (
            <div className="flex gap-2 animate-fade-in">
              <button
                onClick={() => navigate(`/edit/${post.id}`)}
                className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold text-xs rounded-lg transition"
              >
                수정하기
              </button>
              <button
                onClick={handleFieldDelete}
                className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs rounded-lg transition"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 2. 대문 대표 이미지 영역 [버그 방지 및 Cloudinary 절대 경로 단일화 완료] */}
      {post.image && (
        <div className="w-full max-h-[450px] overflow-hidden rounded-xl mb-8 shadow-sm bg-gray-50">
          <img 
            src={post.image} // 🎯 백엔드 시리얼라이저 설정을 전적으로 신뢰하여 절대주소 그대로 다이렉트 주입!
            alt={post.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("상세페이지 대표 이미지 로드 실패 주소:", e.target.src);
            }}
          />
        </div>
      )}

      {/* 3. 본문 텍스트 영역 (마크다운 파싱 정상 작동 확인 완료) */}
      <div 
        className="text-gray-800 text-base md:text-lg leading-relaxed space-y-4 font-normal break-words min-h-[200px] prose max-w-none"
        dangerouslySetInnerHTML={{ __html: mdParser.render(post.content || '') }}
      />

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