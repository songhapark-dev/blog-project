import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useStore } from '../store/store';

function ManagePage() {
  const navigate = useNavigate();
  const token = useStore((state) => state.token);
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const BACKEND_URL = 'https://blog-backend-35eq.onrender.com';

  // 보안 통제 및 실전 서버 게시글 전체 연동
  useEffect(() => {
    if (!isAuthenticated) {
      alert('관리자 전용 비밀 구역입니다. 🔒');
      navigate('/login');
      return;
    }

    fetchManagePosts();
  }, [isAuthenticated, navigate]);

  // 글 목록 새로고침 함수
  const fetchManagePosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/posts/`);
      const data = response.data.results || response.data;
      setPosts(data);
    } catch (err) {
      console.error('관리자용 글 목록 로드 실패:', err);
      alert('데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 원클릭 실전 삭제(DELETE) 파이프라인
  const handleDelete = async (id, title) => {
    if (window.confirm(`⚠️ [위험] "${title}" \n이 글을 실전 서버에서 영구 삭제하시겠습니까?`)) {
      try {
        await axios.delete(`${BACKEND_URL}/posts/${id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        alert('🗑️ 글이 흔적도 없이 삭제되었습니다.');
        // 삭제 성공 후 내 화면에서 해당 글 즉시 지워서 갱신
        setPosts(posts.filter(post => post.id !== id));
      } catch (err) {
        console.error('글 삭제 실패:', err);
        alert('삭제 권한이 없거나 백엔드 통신 오류가 발생했습니다.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 bg-white rounded-2xl border border-gray-100 shadow-xl">
      {/* 대시보드 상단 헤더 */}
      <div className="flex justify-between items-center border-b pb-5 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-950 flex items-center gap-2">
            <span>🛠️</span> 실전 게시물 관제 센터
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            현재 렌더(Render) 클라우드에 누적된 글 개수: <span className="font-bold text-purple-600">{posts.length}개</span>
          </p>
        </div>
        <Link
          to="/write"
          className="px-4 py-2 bg-gray-950 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition shadow-sm"
        >
          ➕ 새 글 쓰기
        </Link>
      </div>

      {/* 관리자 전용 데이터 테이블 레이아웃 */}
      {posts.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">제목</th>
                <th className="px-6 py-4">카테고리 ID</th>
                <th className="px-6 py-4">조회수</th>
                <th className="px-6 py-4">작성일</th>
                <th className="px-6 py-4 text-center">제어 액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4 text-gray-400 text-xs font-mono">{post.id}</td>
                  <td className="px-6 py-4 font-bold text-gray-900 max-w-xs truncate">
                    <Link to={`/posts/${post.id}`} className="hover:text-red-500 underline decoration-gray-200">
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded-lg">
                      {post.category_name || post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">👀 {post.view_count}</td>
                  <td className="px-6 py-4 text-xs text-gray-400">
                    {new Date(post.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  {/* 제어 기어 패널 */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => navigate(`/edit/${post.id}`)}
                        className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold text-xs rounded-lg transition"
                      >
                        ✏️ 수정
                      </button>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs rounded-lg transition"
                      >
                        🗑️ 삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="text-base mb-2">클라우드 서버에 게시글이 한 개도 존재하지 않습니다. 📭</p>
          <p className="text-xs">상단의 새 글 쓰기 버튼을 눌러 첫 역사를 기록해 보세요!</p>
        </div>
      )}
    </div>
  );
}

export default ManagePage;