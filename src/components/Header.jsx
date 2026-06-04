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
          {/* 로고 */}
          <button
            onClick={handleLogoClick}
            className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition"
          >
            📝 My Blog
          </button>

          {/* 네비게이션 링크 */}
          <nav className="flex gap-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              홈
            </Link>
            <a
              href="#about"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              소개
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              연락처
            </a>
          </nav>
        </div>

        {/* 중단: 검색창 */}
        <div className="flex justify-center mb-4">
          <div className="w-full max-w-md">
            <SearchBar />
          </div>
        </div>

        {/* 하단: 프로필 미니 섹션 (선택) */}
        <div className="text-center text-sm text-gray-600 pb-2">
          <p>Welcome to My Blog</p>
        </div>
      </div>
    </header>
  );
}

export default Header;