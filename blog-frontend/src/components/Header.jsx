import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import SearchBar from './SearchBar';

function Header() {
  const navigate = useNavigate();
  
  // Zustand 금고에서 인증 상태와 로그아웃 함수 낚아채기
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const logout = useStore((state) => state.logout);
  
  const setSelectedCategory = useStore((state) => state.setSelectedCategory);
  const setSearchQuery = useStore((state) => state.setSearchQuery);

  const handleLogoClick = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    navigate('/');
  };

  // 로그아웃 처리 핸들러
  const handleLogoutClick = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout();
      alert('안전하게 로그아웃 되었습니다. 🔐');
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* 상단: 로고 + 네비게이션 */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleLogoClick}
            className="text-2xl font-bold text-gray-900 hover:text-red-500 transition focus:outline-none"
          >
            🇦🇹 Songha's Blog
          </button>

          {/* 네비게이션 및 관리자 메뉴 묶음 */}
          <nav className="flex items-center gap-6">
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

            {/* 관리자 로그인 상태에 따른 가변형 메뉴 바인딩 */}
            {isAuthenticated ? (
              <>
                <Link
                  to="/write"
                  className="text-blue-600 hover:text-blue-800 font-semibold transition"
                >글쓰기
                </Link>
                <Link
                  to="/manage"
                  className="text-purple-600 hover:text-purple-800 font-semibold transition"
                >게시물 관리
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg font-medium transition"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-xs bg-gray-950 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-medium transition shadow-sm"
              >
                로그인
              </Link>
            )}
          </nav>
        </div>

        {/* 중단: 검색창 */}
        <div className="flex justify-center mb-4">
          <div className="w-full max-w-md">
            <SearchBar />
          </div>
        </div>

        {/* 하단: 프로필 미니 섹션 */}
        <div className="text-center text-xs text-gray-500 pb-1">
          <p>Servus! 비엔나에서 전하는 좌충우돌 생존 기록 ☕</p>
        </div>
      </div>
    </header>
  );
}

export default Header;