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
  const { id } = useParams();
  const navigate = useNavigate();
  
  const token = useStore((state) => state.token);
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null); // ✅ 추가
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const BACKEND_URL = 'https://blog-backend-35eq.onrender.com';

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

  // Cloudinary Upload (Promise version - Thumbnail & Editor Image)
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

          console.log('🔥 EDIT 클라우디네리 업로드 완료:', uploadedUrl);
          resolve(uploadedUrl);
        })
        .catch((err) => {
          console.error('수정 페이지 이미지 업로드 실패:', err.response?.data || err);
          reject(err);
        });
    });
  };

  // Editor Image Upload Handler
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

  // Thumbnail Selection Handler
  const handleThumbnailSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
      console.log('📷 썸네일 선택:', file.name, file.size);
    }
  };

  // Post Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('제목은 필수 입력 항목입니다!');
      return;
    }

    setSubmitting(true);

    try {
      let thumbnailUrl = null;

      // Step 1: if a new thumbnail is selected, upload it to Cloudinary
      if (thumbnail) {
        console.log('🚀 썸네일 클라우디네리 업로드 시작...');
        thumbnailUrl = await uploadImageToCloudinary(thumbnail);
        console.log('✅ 썸네일 URL 획득:', thumbnailUrl);
      }

      // Step 2: Prepare post data for submission
      const postData = {
        category: selectedCategory,
        title: title,
        content: content,
      };

      // if a new thumbnail was uploaded, include its URL in the post data
      if (thumbnailUrl) {
        postData.image = thumbnailUrl;    
      }
      // else: image 필드를 보내지 않음 → 백엔드가 기존 값 유지

      const response = await axios.put(`${BACKEND_URL}/posts/${id}/`, postData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('✅ 게시글 수정 완료:', response.data);
      alert('에세이가 성공적으로 수정되었습니다!');
      navigate(`/posts/${id}`);

    } catch (err) {
      console.error('글 수정 반영 실패:', err.response?.data || err);
      alert(err.response?.data?.message || '글 수정 권한이 없거나 백엔드 전송 오류가 발생했습니다.');
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
          {submitting ? '실전 서버 데이터 갱신 중...' : '수정 완료 및 실전 반영'}
        </button>
      </form>
    </div>
  );
}

export default EditPage;