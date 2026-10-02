import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import SearchBar from './SearchBar';

function Header() {
  const navigate = useNavigate();

  // Zustand
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const logout = useStore((state) => state.logout);

  const setSelectedCategory = useStore(
    (state) => state.setSelectedCategory
  );
  const setSearchQuery = useStore(
    (state) => state.setSearchQuery
  );

  const handleLogoClick = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    navigate('/');
  };

  const handleLogoutClick = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout();
      alert('안전하게 로그아웃 되었습니다. 🔐');
      navigate('/');
    }
  };

  return (
    <header
      className="
        sticky top-0 z-50
        bg-black
        border-b-2 border-[#39ff14]
        shadow-[0_0_12px_rgba(57,255,20,0.35)]
      "
    >
      <div
        className="
          w-full
          px-5
          py-3
          flex
          items-center
          gap-6
        "
      >

        {/* ─────────────────────
            LOGO
        ───────────────────── */}
        <button
          onClick={handleLogoClick}
          className="
            flex
            items-center
            gap-2
            shrink-0
            bg-transparent
            border-none
            text-[#39ff14]
            font-mono
            text-lg
            font-bold
            tracking-tight
            hover:text-[#00aaff]
            transition-colors
            focus:outline-none
          "
        >
          <img
            src="/smile_icon.png"
            alt="Songha's Blog"
            className="
              w-8
              h-8
              object-contain
              shrink-0
            "
          />
          

          <span>
            Songha's Blog.exe
          </span>
        </button>


        {/* ─────────────────────
            NAVIGATION
        ───────────────────── */}
        <nav
          className="
            flex
            items-center
            gap-5
            font-mono
            text-sm
            font-bold
            tracking-wide
          "
        >
          <Link
            to="/"
            className="
              text-[#39ff14]
              hover:text-[#00aaff]
              hover:drop-shadow-[0_0_6px_rgba(0,170,255,0.9)]
              transition-all
            "
          >
            HOME
          </Link>

          <Link
            to="/about"
            className="
              text-[#00aaff]
              hover:text-[#bf00ff]
              hover:drop-shadow-[0_0_6px_rgba(191,0,255,0.9)]
              transition-all
            "
          >
            ABOUT
          </Link>

          {/* 로그인 상태일 때만 기존 기능 유지 */}
          {isAuthenticated && (
            <>
              <Link
                to="/write"
                className="
                  text-[#bf00ff]
                  hover:text-[#39ff14]
                  hover:drop-shadow-[0_0_6px_rgba(57,255,20,0.9)]
                  transition-all
                "
              >
                WRITE
              </Link>

              <Link
                to="/manage"
                className="
                  text-[#39ff14]
                  hover:text-[#bf00ff]
                  hover:drop-shadow-[0_0_6px_rgba(191,0,255,0.9)]
                  transition-all
                "
              >
                MANAGE
              </Link>
            </>
          )}
        </nav>


        {/* ─────────────────────
            SEARCH
        ───────────────────── */}
        <div className="ml-auto">
          <SearchBar />
        </div>


        {/* ─────────────────────
            AUTH
            기존 기능 유지
        ───────────────────── */}
        {isAuthenticated ? (
          <button
            onClick={handleLogoutClick}
            className="
              shrink-0
              text-[10px]
              font-mono
              font-bold
              text-[#666]
              hover:text-[#ff4444]
              transition-colors
            "
            title="Logout"
          >
            LOGOUT
          </button>
        ) : (
          <Link
            to="/login"
            className="
              shrink-0
              text-[10px]
              font-mono
              font-bold
              text-[#666]
              hover:text-[#bf00ff]
              transition-colors
            "
          >
            LOGIN
          </Link>
        )}

      </div>
    </header>
  );
}

export default Header;