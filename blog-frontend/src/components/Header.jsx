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
      <div
        className="
          w-full
          px-[clamp(0.5rem,2vw,1.5rem)]
          py-[clamp(0.75rem,1.5vw,1rem)]
        "
      >

        {/* HEADER CONTENT */}
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-x-[clamp(0.5rem,2vw,2rem)]
            gap-y-3
            w-full
          "
        >

          {/* =================================================
              LOGO
          ================================================= */}

          <button
            onClick={handleLogoClick}
            className="
              flex
              items-center
              gap-[clamp(0.5rem,1vw,0.75rem)]
              shrink-0
              bg-transparent
              border-none
              p-0
              focus:outline-none
            "
          >

            {/* Smile Icon — 크기 유지 */}
            <img
              src="/smile_icon.png"
              alt="Songha's Blog"
              className="
                w-16
                h-16
                object-contain
                shrink-0
              "
            />

            {/* Logo Text */}
            <div className="flex flex-col items-start">

              {/* Blog Name */}
              <div
                className="
                  font-mono
                  text-[clamp(1.5rem,2.7vw,1.875rem)]
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
                  mt-[clamp(0.35rem,0.6vw,0.5rem)]
                  font-mono
                  text-[clamp(0.4rem,0.7vw,0.625rem)]
                  font-bold
                  tracking-[clamp(0.08em,0.15vw,0.18em)]
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


          {/* =================================================
              NAVIGATION
          ================================================= */}

          <nav
            className="
              flex
              items-center
              gap-[clamp(0rem,0.3vw,0.25rem)]
              shrink
              min-w-0
              font-mono
              font-bold
            "
          >

            {/* ABOUT */}
            <Link
              to="/about"
              className="
                px-[clamp(0.4rem,0.9vw,1.25rem)]
                py-[clamp(0.3rem,0.5vw,0.5rem)]
                text-[clamp(0.9rem,1.45vw,1rem)]
                text-[#8b4cff]
                border
                border-transparent
                hover:border-[#8b4cff]
                hover:bg-[#8b4cff]/10
                hover:shadow-[0_0_8px_rgba(139,76,255,0.35)]
                transition-all
                whitespace-nowrap
                shrink
              "
            >
              ABOUT
            </Link>


            {/* WRITE */}
            {isAuthenticated && (
              <Link
                to="/write"
                className="
                  px-[clamp(0.4rem,0.9vw,1.25rem)]
                  py-[clamp(0.3rem,0.5vw,0.5rem)]
                  text-[clamp(0.9rem,1.45vw,1rem)]
                  text-[#704cff]
                  border
                  border-transparent
                  hover:border-[#704cff]
                  hover:bg-[#704cff]/10
                  hover:shadow-[0_0_8px_rgba(112,76,255,0.35)]
                  transition-all
                  whitespace-nowrap
                  shrink
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
                  px-[clamp(0.4rem,0.9vw,1.25rem)]
                  py-[clamp(0.3rem,0.5vw,0.5rem)]
                  text-[clamp(0.9rem,1.45vw,1rem)]
                  text-[#a43cff]
                  border
                  border-transparent
                  hover:border-[#a43cff]
                  hover:bg-[#a43cff]/10
                  hover:shadow-[0_0_8px_rgba(164,60,255,0.35)]
                  transition-all
                  whitespace-nowrap
                  shrink
                "
              >
                MANAGE
              </Link>
            )}

          </nav>


          {/* =================================================
              LOGIN / LOGOUT
          ================================================= */}

          <div
            className="
              ml-auto
              shrink-0
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
                  text-[clamp(0.85rem,1.35vw,1rem)]
                  font-bold
                  text-white
                  hover:text-[#39ff14]
                  transition-colors
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
                  text-[clamp(0.85rem,1.35vw,1rem)]
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


          {/* =================================================
              SEARCH
          ================================================= */}

          <div
            className="
              shrink
              min-w-[160px]
              w-[clamp(160px,22vw,300px)]
            "
          >
            <SearchBar />
          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;