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
        sticky
        top-0
        z-50
        bg-black
      "
    >

      {/* =====================================================
          HEADER FRAME
          Desktop : LOGO | NAV + LOGIN | SEARCH
          Mobile  : LOGO
                    NAV + LOGIN
                    SEARCH
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-[auto_minmax(0,1fr)_auto]
          items-center
          gap-y-4
          md:gap-y-0
          md:gap-x-8
          w-full
          px-4
          sm:px-6
          py-4
        "
      >

        {/* =====================================================
            1. LOGO
        ===================================================== */}

        <button
          onClick={handleLogoClick}
          className="
            flex
            items-center
            gap-3
            shrink-0
            bg-transparent
            border-none
            p-0
            focus:outline-none
            justify-self-start
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
          <div className="flex flex-col items-start shrink-0">

            {/* Blog Name */}
            <div
              className="
                font-mono
                text-3xl
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


        {/* =====================================================
            2. NAVIGATION + LOGIN
            하나의 독립된 영역
        ===================================================== */}

        <div
          className="
            flex
            items-center
            min-w-0
            w-full
          "
        >

          {/* NAVIGATION */}
          <nav
            className="
              flex
              items-center
              gap-1
              min-w-0
              flex-1
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
                border
                border-transparent
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
                  border
                  border-transparent
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
                  border
                  border-transparent
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


          {/* LOGIN / LOGOUT */}
          <div
            className="
              shrink-0
              ml-4
              pl-4
            "
          >
            {isAuthenticated ? (
              <button
                onClick={handleLogoutClick}
                className="
                  bg-transparent
                  border-none
                  p-0
                  font-mono
                  text-lg
                  font-bold
                  text-white
                  hover:text-[#39ff14]
                  transition-colors
                  focus:outline-none
                  whitespace-nowrap
                "
              >
                LOGOUT
              </button>
            ) : (
              <Link
                to="/login"
                className="
                  font-mono
                  text-base
                  font-bold
                  text-white
                  hover:text-[#39ff14]
                  transition-colors
                  whitespace-nowrap
                "
              >
                LOGIN
              </Link>
            )}
          </div>

        </div>


        {/* =====================================================
            3. SEARCH
            Desktop : 오른쪽
            Mobile  : 독립된 다음 줄
        ===================================================== */}

        <div
          className="
            w-full
            md:w-auto
            md:justify-self-end
          "
        >
          <SearchBar />
        </div>

      </div>
    </header>
  );
}

export default Header;