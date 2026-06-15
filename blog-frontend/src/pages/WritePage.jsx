import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css'; // 에디터 기본 스타일 적용
import { useStore } from '../store/store';

function WritePage() {
  const navigate = useNavigate();
  const token = useStore((state) => state.token);
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  // [롤백 완료] 번역 객체 상태를 걷어내고 직관적인 문자열 상태로 단일화
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 카테고리 및 썸네일 정보
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = 'https://blog-backend-35eq.onrender.com';

  // 보안 장치: 로그인 안 된 상태면 홈으로 튕겨내기
  useEffect(() => {
    if (!isAuthenticated) {
      alert('관리자 권한이 필요합니다. 🔒');
      navigate('/login');
      return;
    }
    
    // 카테고리 목록 불러오기
    axios.get(`${BACKEND_URL}/categories/`)
      .then(res => {
        const data = res.data.results || res.data;
        setCategories(data);
        
        // 데이터가 존재한다면 그 즉시 첫 번째 ID를 기본 카테고리로 주입
        if (data && data.length > 0) {
          setSelectedCategory(data[0].id);
        }
      })
      .catch(err => console.error('카테고리 로드 실패', err));
  }, [isAuthenticated, navigate]);

  // 본문 이미지 드래그 앤 드롭 업로드 파이프라인
  const handleImageUpload = async (file) => {
    let categoryId = selectedCategory;
    
    if (!categoryId && categories && categories.length > 0) {
      categoryId = categories[0].id;
    }
    
    if (!categoryId) {
      const selectElement = document.querySelector('select');
      if (selectElement && selectElement.value) {
        categoryId = selectElement.value;
      }
    }

    if (!categoryId) {
      alert('카테고리 데이터를 동기화 중입니다. 잠시 후 다시 시도해주세요.');
      return 'https://via.placeholder.com/150';
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', categoryId);

    // [롤백 완료] 장고 시리얼라이저 단일 필드 규격에 완벽 매칭 (더미 번역 필드 제거)
    formData.append('title', `inline_img_${Date.now()}`);
    formData.append('content', 'inline_image_holder');

    try {
      const response = await axios.post(`${BACKEND_URL}/posts/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      
      // 장고 PostViewSet 성공 시 반환되는 Cloudinary 이미지 주소 주입
      return response.data.image || response.data.file || 'https://via.placeholder.com/150'; 
    } catch (err) {
      console.error('본문 이미지 업로드 실패:', err.response?.data || err);
      alert('이미지 업로드에 실패했습니다.');
      return 'https://via.placeholder.com/150';
    }
  };

  // 발행하기 버튼 클릭 이벤트
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('제목을 입력해주세요!');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('category', selectedCategory);
    if (thumbnail) formData.append('image', thumbnail); // 메인 대문용 썸네일 커버

    // [롤백 완료] 깨끗한 단일 데이터 전송
    formData.append('title', title);
    formData.append('content', content);

    try {
      await axios.post(`${BACKEND_URL}/posts/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      alert('📝 에세이 발행 완료!');
      navigate('/');
    } catch (err) {
      console.error('글 발행 실패:', err);
      alert('글 작성 권한이 없거나 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 bg-white rounded-2xl border border-gray-100 shadow-xl">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h1 className="text-2xl font-extrabold text-gray-950 flex items-center gap-2">
          <span>📝</span> 신규 마크다운 에세이 작성
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 카테고리 및 대표 이미지 세팅 묶음 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">게시판 카테고리</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-500"
            >
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">메인 커버 썸네일</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
          </div>
        </div>

        {/* 단일 제목 입력창 */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 font-semibold focus:outline-none focus:border-red-500 text-base"
          />
        </div>

        {/* 단일 마크다운 에디터 본문 */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            본문 마크다운
          </label>
          <MdEditor
            value={content}
            style={{ height: '600px', borderRadius: '12px' }}
            // 날것의 텍스트를 마크다운 이미지/링크 규격에 맞게 뼈대를 깎아주는 무적의 정규식 파서 장착
            renderHTML={(text) => {
              let html = text
                .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') // 기본 보안 처리
                .replace(/\!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-xl my-4 shadow-md" />') // 이미지 변환 핵심
                .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-blue-600 underline">$1</a>') // 일반 링크 변환
                .replace(/\n/g, '<br />'); // 줄바꿈 반영
              return <div className="prose max-w-none p-4" dangerouslySetInnerHTML={{ __html: html }} />;
            }}
            onChange={({ text }) => setContent(text)}
            onImageUpload={handleImageUpload}
            placeholder="여기에 글을 자유롭게 마크다운으로 작성하세요. 이미지 파일을 드래그 앤 ド롭하면 실시간으로 자동 변환됩니다."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gray-950 text-white font-extrabold rounded-xl hover:bg-red-600 transition shadow-lg disabled:bg-gray-300"
        >
          {loading ? '서버로 안전하게 발행 중...' : '🚀 무대로 발행하기'}
        </button>
      </form>
    </div>
  );
}

export default WritePage;