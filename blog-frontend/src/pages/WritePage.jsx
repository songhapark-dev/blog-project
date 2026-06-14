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

  // 언어별 작성 폼 데이터 상태 관리
  const [activeTab, setActiveTab] = useState('ko'); // 'ko', 'de', 'en'
  const [titles, setTitles] = useState({ ko: '', de: '', en: '' });
  const [contents, setContents] = useState({ ko: '', de: '', en: '' });

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
        // 장고 페이지네이션 포장을 뜯고 데이터 낚아채기
        const data = res.data.results || res.data;
        console.log("로드된 카테고리 원본 데이터:", data); // 검증용 로그
        
        setCategories(data);
        
        // 핵심 보강: 데이터가 존재한다면 비동기 지연 없이 그 즉시 첫 번째 ID를 강제 주입!
        if (data && data.length > 0) {
          setSelectedCategory(data[0].id);
        }
      })
      .catch(err => console.error('카테고리 로드 실패', err));
  }, [isAuthenticated, navigate]);

  // 이미지 드래그 앤 드롭 및 붙여넣기 가공 파이프라인 (보강본)
  const handleImageUpload = async (file) => {
    // 만약 카테고리가 아직 선택되지 않았다면 첫 번째 카테고리 ID 강제 지정 또는 방어
    const categoryId = selectedCategory || (categories[0] ? categories[0].id : '');
    
    if (!categoryId) {
      alert('카테고리가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return 'https://via.placeholder.com/150';
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', categoryId); // 확실한 ID 값 주입

    // 장고 시리얼라이저 유효성 검사 통과용 더미 데이터 매핑 (필수 필드 방어막)
    formData.append('title_ko', `inline_img_${Date.now()}`);
    formData.append('content_ko', 'inline_image_holder');
    formData.append('title_de', '');
    formData.append('content_de', '');
    formData.append('title_en', '');
    formData.append('content_en', '');

    try {
      const response = await axios.post(`${BACKEND_URL}/posts/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // 마스터 키 첨부
        },
      });
      
      // 장고가 리턴해준 JSON 데이터 중 이미지 URL 추출
      return response.data.image; 
    } catch (err) {
      console.error('본문 이미지 업로드 실패:', err.response?.data || err); // 콘솔에 장고가 보낸 진짜 에러 이유 출력
      alert('이미지 업로드 형식 오류가 발생했습니다.');
      return 'https://via.placeholder.com/150';
    }
  };

  // 발행하기 버튼 클릭 이벤트
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 자바스크립트 표준 문법인 .trim()으로 수정하여 오타 에러 방지
    if (!titles.ko.trim() && !titles.de.trim() && !titles.en.trim()) {
      alert('최소 한 개 언어 이상의 제목은 입력해야 합니다!');
      return;
    }

    setLoading(true);

    // 장고 modeltranslation 규칙 맞춤형 JSON 덩어리 조립
    const formData = new FormData();
    formData.append('category', selectedCategory);
    if (thumbnail) formData.append('image', thumbnail); // 메인 썸네일

    // 3개 국어 필드 분할 적재
    formData.append('title_ko', titles.ko);
    formData.append('title_de', titles.de);
    formData.append('title_en', titles.en);
    formData.append('content_ko', contents.ko);
    formData.append('content_de', contents.de);
    formData.append('content_en', contents.en);

    try {
      await axios.post(`${BACKEND_URL}/posts/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      alert('🇩🇪 🇰🇷 🇺🇸 글로벌 포스팅 발행 완료!');
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
          <span>📝</span> 글로벌 신규 에세이 작성
        </h1>
        {/* 언어 스위칭 멀티 탭 */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          {[
            { id: 'ko', label: '🇰🇷 한국어' },
            { id: 'de', label: '🇩🇪 Deutsch' },
            { id: 'en', label: '🇺🇸 English' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
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
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ref 파일 테스트</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
          </div>
        </div>

        {/* 현재 활성화된 탭 언어의 제목 입력창 */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            제목 ({activeTab.toUpperCase()})
          </label>
          <input
            type="text"
            value={titles[activeTab]}
            onChange={(e) => setTitles({ ...titles, [activeTab]: e.target.value })}
            placeholder={`${activeTab === 'de' ? 'Titel eingeben' : '제목을 입력하세요.'}`}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 font-semibold focus:outline-none focus:border-red-500 text-base"
          />
        </div>

        {/* 현재 활성화된 탭 언어의 마크다운 에디터 본문 */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            본문 마크다운 ({activeTab.toUpperCase()})
          </label>
          <MdEditor
            value={contents[activeTab]}
            style={{ height: '500px', borderRadius: '12px' }}
            renderHTML={(text) => <div className="prose max-w-none p-3">{text}</div>}
            onChange={({ text }) => setContents({ ...contents, [activeTab]: text })}
            onImageUpload={handleImageUpload}
            placeholder="여기에 글을 작성하고 사진을 드래그하여 쏙쏙 집어넣으세요. 실시간으로 영구 저장 주소로 자동 인식됩니다."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gray-950 text-white font-extrabold rounded-xl hover:bg-red-600 transition shadow-lg disabled:bg-gray-300"
        >
          {loading ? '전 세계 서버로 원클릭 동시 발행 중...' : '🌍 글로벌 무대로 발행하기'}
        </button>
      </form>
    </div>
  );
}

export default WritePage;