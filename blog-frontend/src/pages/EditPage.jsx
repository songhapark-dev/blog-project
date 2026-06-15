import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css'; 
import { useStore } from '../store/store';

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
        // 카테고리 목록과 수정할 기존 글 데이터를 동시에 낚아챕니다.
        const [categoriesRes, postRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/categories/`),
          axios.get(`${BACKEND_URL}/posts/${id}/`)
        ]);

        const catData = categoriesRes.data.results || categoriesRes.data;
        setCategories(catData);

        // 기존 글 데이터를 입력 폼에 싹 주입합니다.
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

  // 2. 본문 이미지 실시간 드롭 업로드 파이프라인 (WritePage 검증본 완벽 이식)
  const handleImageUpload = async (file) => {
    let categoryId = selectedCategory;
    if (!categoryId && categories && categories.length > 0) {
      categoryId = categories[0].id;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', categoryId);
    formData.append('title', `inline_img_${Date.now()}`);
    formData.append('content', 'inline_image_holder');

    try {
      // 본문 이미지는 임시 Post로 생성하여 저장소 주소를 획득합니다.
      const response = await axios.post(`${BACKEND_URL}/posts/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      return response.data.image || response.data.file || 'https://via.placeholder.com/150'; 
    } catch (err) {
      console.error('본문 이미지 업로드 실패:', err.response?.data || err);
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
    
    // 만약 관리자가 썸네일 파일을 새로 갈아 끼웠을 때만 데이터 전송에 장착
    if (thumbnail) {
      formData.append('image', thumbnail);
    }

    try {
      // 핵심: 새로 생성(POST)하는 것이 아니라 기존 글을 겨냥하여 갱신(PUT) 타격!
      await axios.put(`${BACKEND_URL}/posts/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      alert('✏️ 에세이가 성공적으로 수정되었습니다!');
      navigate(`/posts/${id}`); // 수정 완료 후 해당 글 상세 보기 페이지로 바로 이동
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
        {/* 카테고리 및 대표 이미지 변경 패널 */}
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

        {/* 제목 입력창 */}
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

        {/* 마크다운 에디터 본문 (파서 장착 완비) */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">본문 마크다운 수정</label>
          <MdEditor
            value={content}
            style={{ height: '600px', borderRadius: '12px' }}
            renderHTML={(text) => {
              let html = text
                .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                .replace(/\!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-xl my-4 shadow-md mx-auto block" />')
                .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-blue-600 underline">$1</a>')
                .replace(/\n/g, '<br />');
              return <div className="prose max-w-none p-4" dangerouslySetInnerHTML={{ __html: html }} />;
            }}
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