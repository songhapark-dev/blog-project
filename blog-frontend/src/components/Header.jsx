import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import SearchBar from './SearchBar';

function Header() {
  const navigate = useNavigate();
  const setSelectedCategory = useStore((state) => state.setSelectedCategory);
  const setSearchQuery = useStore((state) => state.setSearchQuery);

  const handleLogoClick = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* 상단: 로고 + 네비게이션 */}
        <div className="flex items-center justify-between mb-4">
          {/* 🇦🇹 로고 호버 컬러를 레드 톤으로 통일 */}
          <button
            onClick={handleLogoClick}
            className="text-2xl font-bold text-gray-900 hover:text-red-500 transition"
          >
            🇦🇹 Songha's Blog
          </button>

          {/* 네비게이션 링크 (연락처 제거 및 톤 정렬) */}
          <nav className="flex gap-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-red-500 font-medium transition"
            >
              홈
            </Link>
            
            <Link 
              to="/about" 
              className="text-gray-600 hover:text-red-500 font-medium transition"
            >
              소개
            </Link>
          </nav>
        </div>

        {/* 중단: 검색창 */}
        <div className="flex justify-center mb-4">
          <div className="w-full max-w-md">
            <SearchBar />
          </div>
        </div>

        {/* 하단: 프로필 미니 섹션 (위트 있는 한 줄로 교체) */}
        <div className="text-center text-xs text-gray-500 pb-1">
          <p>Servus! 비엔나에서 전하는 좌충우돌 생존 기록 ☕</p>
        </div>
      </div>
    </header>
  );
}

export default Header;