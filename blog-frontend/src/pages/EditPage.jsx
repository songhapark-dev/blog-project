import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css'; 
import { useStore } from '../store/store';
import MarkdownIt from 'markdown-it';

const mdParser = new MarkdownIt({
  html: true,        
  linkify: true,     
  breaks: true,      
});

function EditPage() {
  const { id } = useParams(); // URL 주소창에서 수정할 글의 ID 추출
  const navigate = useNavigate();
  
  const token = useStore((state) => state.token);
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  // 수정용 문자열 상태 단일화 복구
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 카테고리 및 컴포넌트 제어 상태
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const BACKEND_URL = 'https://blog-backend-35eq.onrender.com';

  // 1. 보안 장치 확인 및 기존 데이터 프리로드(Pre-load) 파이프라인
  useEffect(() => {
    if (!isAuthenticated) {
      alert('관리자 권한이 필요합니다. 🔒');
      navigate('/login');
      return;
    }

    const prepareData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, postRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/categories/`),
          axios.get(`${BACKEND_URL}/posts/${id}/`)
        ]);

        const catData = categoriesRes.data.results || categoriesRes.data;
        setCategories(catData);

        const currentPost = postRes.data;
        setTitle(currentPost.title || '');
        setContent(currentPost.content || '');
        setSelectedCategory(currentPost.category || '');

        setLoading(false);
      } catch (err) {
        console.error('기존 데이터 로드 실패:', err);
        alert('게시글 데이터를 불러오는 과정에서 오류가 발생했습니다.');
        navigate('/manage');
      }
    };

    prepareData();
  }, [id, isAuthenticated, navigate]);

  // 2. [버그 완전 박멸] 본문 이미지 실시간 드롭 업로드 파이프라인 (정석 개조 완료)
  const handleImageUpload = async (file) => {
    if (!file) return 'https://via.placeholder.com/150';

    const formData = new FormData();
    formData.append('image', file); // 오직 이미지 알맹이만 전송

    try {
      // 🎯 격리 주소인 /posts/upload_image/ 로 정확하게 타격하여 유령 게시글 생성을 완벽 차단합니다!
      const response = await axios.post(`${BACKEND_URL}/posts/upload_image/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      
      const uploadedUrl = response.data.image;
      
      if (!uploadedUrl) {
        return 'https://via.placeholder.com/150';
      }

      console.log("Cloudinary 수정페이지 본문 전송 성공:", uploadedUrl);

      // ★ 객체 형태로 반환하여 리액트 에디터 내 문자열 뒤틀림(0.jpeg) 버그를 완벽 차단합니다.
      return {
        url: uploadedUrl,
        title: file.name
      };

    } catch (err) {
      console.error('본문 이미지 격리 업로드 실패:', err.response?.data || err);
      alert('이미지 업로드에 실패했습니다.');
      return 'https://via.placeholder.com/150';
    }
  };

  // 3. 수정 완료 처리 핸들러 (PUT 전송 파이프라인)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('제목은 필수 입력 항목입니다!');
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append('category', selectedCategory);
    formData.append('title', title);
    formData.append('content', content);
    
    if (thumbnail) {
      formData.append('image', thumbnail);
    }

    try {
      await axios.put(`${BACKEND_URL}/posts/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      alert('✏️ 에세이가 성공적으로 수정되었습니다!');
      navigate(`/posts/${id}`); 
    } catch (err) {
      console.error('글 수정 반영 실패:', err.response?.data || err);
      alert('글 수정 권한이 없거나 백엔드 전송 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 bg-white rounded-2xl border border-gray-100 shadow-xl">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h1 className="text-2xl font-extrabold text-gray-950 flex items-center gap-2">
          <span>✏️</span> 에세이 정밀 수정 편집기
        </h1>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-xs font-bold text-gray-400 hover:text-gray-700 transition"
        >
          ❌ 수정 취소
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">게시판 카테고리 변경</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-amber-500"
            >
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">메인 커버 썸네일 변경 (선택)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 font-semibold focus:outline-none focus:border-amber-500 text-base"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">본문 마크다운 수정</label>
          <MdEditor
            value={content}
            style={{ height: '600px', borderRadius: '12px' }}
            renderHTML={(text) => (
              <div 
                className="prose max-w-none p-4 font-normal text-gray-800" 
                dangerouslySetInnerHTML={{ __html: mdParser.render(text) }} 
              />
            )}
            onChange={({ text }) => setContent(text)}
            onImageUpload={handleImageUpload}
            placeholder="마크다운 양식에 맞게 내용을 가공하세요."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl transition shadow-lg disabled:bg-gray-300"
        >
          {submitting ? '실전 서버 데이터 갱신 중...' : '✨ 수정 완료 및 실전 반영'}
        </button>
      </form>
    </div>
  );
}

export default EditPage;