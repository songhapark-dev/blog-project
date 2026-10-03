import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { useStore } from '../store/store';
import MarkdownIt from 'markdown-it';

const mdParser = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
});

function WritePage() {
  const navigate = useNavigate();
  const token = useStore((state) => state.token);
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 카테고리 및 썸네일 정보
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null); // ✅ 미리보기 추가
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
        
        if (data && data.length > 0) {
          setSelectedCategory(data[0].id);
        }
      })
      .catch(err => console.error('카테고리 로드 실패', err));
  }, [isAuthenticated, navigate]);

  // ✅ Promise 버전: 썸네일, 게시글 이미지 모두 사용 가능
  const uploadImageToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('파일이 없습니다'));
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      axios.post(`${BACKEND_URL}/posts/upload_image/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => {
          const uploadedUrl = response.data.image;

          if (!uploadedUrl) {
            reject(new Error('업로드된 이미지 URL이 없습니다'));
            return;
          }

          console.log('🔥 RESPONSE DATA:', response.data);
          console.log('🔥 UPLOADED URL:', uploadedUrl);
          console.log('🔥 UPLOADED URL TYPE:', typeof uploadedUrl);

          resolve(uploadedUrl);
        })
        .catch((err) => {
          console.error('이미지 업로드 실패:', err.response?.data || err);
          reject(err);
        });
    });
  };

  // ✅ 에디터의 이미지 업로드 핸들러
  const handleImageUpload = async (file, callback) => {
    try {
      const url = await uploadImageToCloudinary(file);
      callback(url);
    } catch (err) {
      console.error('본문 이미지 업로드 실패:', err);
      alert('이미지 업로드에 실패했습니다.');
      callback(null);
    }
  };

  // ✅ 썸네일 선택 핸들러
  const handleThumbnailSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      // 로컬 미리보기 (임시 URL)
      setThumbnailPreview(URL.createObjectURL(file));
      console.log('📷 썸네일 선택됨:', file.name, file.size);
    }
  };

  // ✅ 발행하기 버튼 클릭 이벤트 (async/await 사용)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('제목을 입력해주세요!');
      return;
    }

    if (!selectedCategory) {
      alert('카테고리를 선택해주세요!');
      return;
    }

    setLoading(true);

    try {
      let thumbnailUrl = null;

      // ✅ Step 1: 썸네일이 있으면 먼저 클라우디네리에 업로드
      if (thumbnail) {
        console.log('🚀 썸네일 업로드 시작...');
        thumbnailUrl = await uploadImageToCloudinary(thumbnail);
        console.log('✅ 썸네일 클라우디네리 URL 획득:', thumbnailUrl);
      }

      // ✅ Step 2: 게시글 데이터 준비 (클라우디네리 URL 포함)
      const formData = new FormData();
      formData.append('category', selectedCategory);
      formData.append('title', title);
      formData.append('content', content);
      
      // ✅ 핵심: 파일이 아닌 클라우디네리 URL을 전송
      if (thumbnailUrl) {
        formData.append('image', thumbnailUrl);
        console.log('📤 게시글 formData에 이미지 URL 추가:', thumbnailUrl);
      }

      // ✅ Step 3: 게시글 저장
      const response = await axios.post(`${BACKEND_URL}/posts/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('✅ 게시글 발행 완료:', response.data);
      alert('📝 에세이 발행 완료!');
      navigate('/');

    } catch (err) {
      console.error('글 발행 실패:', err.response?.data || err);
      alert(err.response?.data?.message || '글 작성 권한이 없거나 오류가 발생했습니다.');
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
              onChange={handleThumbnailSelect}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            {/* ✅ 썸네일 미리보기 추가 */}
            {thumbnailPreview && (
              <div className="mt-3 relative">
                <img 
                  src={thumbnailPreview} 
                  alt="썸네일 미리보기" 
                  className="w-full h-40 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    setThumbnail(null);
                    setThumbnailPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold hover:bg-red-600"
                >
                  ✕ 제거
                </button>
              </div>
            )}
          </div>
        </div>

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

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            본문 마크다운
          </label>
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
            placeholder="여기에 글을 자유롭게 마크다운으로 작성하세요."
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