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
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 mx-auto border-2 border-[#333] border-t-[#39ff14]"></div>
          <p className="mt-6 text-white text-xl font-bold font-mono">Loading...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-[#aaa] font-mono mb-4">존재하지 않거나 삭제된 게시글입니다.</p>
          <Link to="/" className="text-[#39ff14] font-mono font-bold hover:underline">← 홈으로 돌아가기</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black px-4 py-6 md:py-10">
      <article className="relative max-w-3xl mx-auto px-5 py-8 md:px-10 md:py-10 bg-[#151515] border border-[#333]">
        {/* PIXEL CORNERS */}
        <div className="absolute top-0 right-0 w-4 h-px bg-[#39ff14]" />
        <div className="absolute top-0 right-0 w-px h-4 bg-[#39ff14]" />
        <div className="absolute bottom-0 left-0 w-4 h-px bg-[#bf00ff]" />
        <div className="absolute bottom-0 left-0 w-px h-4 bg-[#bf00ff]" />

        {/* 1. 상단 메타 정보 (카테고리, 제목, 날짜) */}
        <header className="mb-6 pb-6 border-b border-[#333]">
          <span className="inline-block border border-[#bf00ff] bg-black text-[#bf00ff] text-[10px] font-mono font-bold tracking-widest px-2 py-1 mb-4">
            {post.category_name || 'GENERAL'}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#888]">
            <div className="flex gap-4">
              <span>{formatDate(post.created_at)}</span>
              <span>{'// '}{post.view_count} VIEWS</span>
            </div>

            {isAuthenticated && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/edit/${post.id}`)}
                  className="px-3 py-1.5 border border-[#333] bg-black text-white hover:text-[#39ff14] hover:border-[#39ff14] font-mono font-bold text-xs transition-all"
                >
                  EDIT
                </button>
                <button
                  onClick={handleFieldDelete}
                  className="px-3 py-1.5 border border-[#333] bg-black text-white hover:text-[#ff3b5c] hover:border-[#ff3b5c] font-mono font-bold text-xs transition-all"
                >
                  DELETE
                </button>
              </div>
            )}
          </div>
        </header>

        {/* 2. 대표 이미지 */}
        {post.image && (
          <div className="w-full max-h-[450px] overflow-hidden mb-8 border border-[#333] bg-black">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("상세페이지 대표 이미지 로드 실패 주소:", e.target.src);
              }}
            />
          </div>
        )}

        {/* 3. 본문 (마크다운) */}
        <div
          className="post-content text-[#ddd] text-base md:text-lg leading-relaxed break-words min-h-[200px]"
          dangerouslySetInnerHTML={{ __html: mdParser.render(post.content || '') }}
        />

        {/* 4. 하단 네비게이션 */}
        <footer className="mt-12 pt-6 border-t border-[#333] flex justify-between items-center font-mono">
          <button
            onClick={() => navigate(-1)}
            className="text-[#aaa] hover:text-[#39ff14] font-bold transition-colors text-sm"
          >
            ← BACK
          </button>
          <Link
            to="/"
            className="border border-[#333] bg-black text-white hover:text-[#39ff14] hover:border-[#39ff14] hover:shadow-[0_0_12px_rgba(57,255,20,0.35)] px-4 py-2 font-bold text-sm transition-all"
          >
            LIST
          </Link>
        </footer>
      </article>
    </div>
  );
}

export default PostDetail;
