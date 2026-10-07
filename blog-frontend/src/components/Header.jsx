import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import SearchBar from './SearchBar';

function Header() {
  const navigate = useNavigate();

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
      "
    >

      {/* HEADER FRAME */}
      <div
        className="
          w-full
          px-4 sm:px-6
          py-3
          flex
          flex-wrap
          items-center
          gap-3 sm:gap-8
        "
      >

        {/* ─────────────────────────────
            LEFT : LOGO
        ───────────────────────────── */}

        <button
          onClick={handleLogoClick}
          className="
            flex
            items-center
            gap-3
            shrink-0
            bg-transparent
            border-none
            focus:outline-none
          "
        >

          {/* Smile Icon */}
          <img
            src="/smile_icon.png"
            alt="Songha's Blog"
            className="
              w-20
              h-20
              object-contain
              shrink-0
            "
          />

          {/* Logo Text */}
          <div className="flex flex-col items-start">

            <div
              className="
                font-mono
                text-lg sm:text-3xl
                font-bold
                leading-none
                tracking-tight
                whitespace-nowrap
              "
            >
              <span className="text-white">
                Songha's Blog.
              </span>

              <span
                className="
                  text-[#39ff14]
                  drop-shadow-[0_0_7px_rgba(57,255,20,0.8)]
                "
              >
                exe
              </span>
            </div>

            {/* Subtitle */}
            <div
              className="
                hidden sm:block
                mt-2
                font-mono
                text-[10px]
                font-bold
                tracking-[0.18em]
                whitespace-nowrap
              "
            >
              <span className="text-[#008cff]">
                // VIENNA.
              </span>{' '}

              <span className="text-[#4b7cff]">
                PHARMACY.
              </span>{' '}

              <span className="text-[#704cff]">
                CODE.
              </span>{' '}

              <span className="text-[#a43cff]">
                LIFE.
              </span>
            </div>

          </div>
        </button>


        {/* ─────────────────────────────
            CENTER : NAVIGATION
        ───────────────────────────── */}

        <nav
          className="
            flex
            items-center
            gap-1
            ml-0 sm:ml-6
            w-full sm:w-auto
            overflow-x-auto
            font-mono
            font-bold
          "
        >


          {/* ABOUT */}
          <Link
            to="/about"
            className="
              px-5
              py-2
              text-lg
              text-[#8b4cff]
              border border-transparent
              hover:border-[#8b4cff]
              hover:bg-[#8b4cff]/10
              hover:shadow-[0_0_8px_rgba(139,76,255,0.35)]
              transition-all
              shrink-0
            "
          >
            ABOUT
          </Link>


          {/* WRITE */}
          {isAuthenticated && (
            <Link
              to="/write"
              className="
                px-5
                py-2
                text-lg
                text-[#704cff]
                border border-transparent
                hover:border-[#704cff]
                hover:bg-[#704cff]/10
                hover:shadow-[0_0_8px_rgba(112,76,255,0.35)]
                transition-all
                shrink-0
              "
            >
              WRITE
            </Link>
          )}


          {/* MANAGE */}
          {isAuthenticated && (
            <Link
              to="/manage"
              className="
                px-5
                py-2
                text-lg
                text-[#a43cff]
                border border-transparent
                hover:border-[#a43cff]
                hover:bg-[#a43cff]/10
                hover:shadow-[0_0_8px_rgba(164,60,255,0.35)]
                transition-all
                shrink-0
              "
            >
              MANAGE
            </Link>
          )}

        </nav>

        <div
          className="
            basis-full
            sm:basis-auto
            sm:ml-auto
            flex
            items-center
            gap-4
            w-full
            sm:w-auto
          "
        >


          {/* LOGIN / LOGOUT */}
          {isAuthenticated ? (
            <button
              onClick={handleLogoutClick}
              className="
                bg-transparent
                border-none
                p-0
                font-mono
                text-xs
                font-bold
                text-white
                hover:text-[#39ff14]
                transition-colors
                focus:outline-none
                shrink-0
              "
            >
              LOGOUT
            </button>
          ) : (
            <Link
              to="/login"
              className="
                font-mono
                text-xs
                font-bold
                text-white
                hover:text-[#39ff14]
                transition-colors
                shrink-0
              "
            >
              LOGIN
            </Link>
          )}

          {/* SEARCH */}
          <div className="w-full sm:w-auto">
            <SearchBar />
          </div>
        </div>
      </div>
      
    </header>
  );
}

export default Header;