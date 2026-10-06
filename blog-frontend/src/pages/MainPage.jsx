import { useEffect, useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import CategoryGrid from '../components/CategoryGrid';

function MainPage() {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [postsByCategory, setPostsByCategory] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BACKEND_URL = 'https://blog-backend-35eq.onrender.com';

  // Posts를 카테고리별로 그룹화하여 상태에 저장
  useEffect(() => {
  const fetchAllPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      let allPosts = [];
      let url = `${BACKEND_URL}/posts/`;

      while (url) {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`게시글 요청 실패: ${response.status}`);
        }

        const data = await response.json();

        const currentBatch = data.results || data;

        allPosts = [...allPosts, ...currentBatch];

        url = data.next || null;
      }
      

      if (!Array.isArray(allPosts)) {
        throw new TypeError("게시글 데이터가 배열 형식이 아닙니다.");
      }

      const grouped = {};

      categories.forEach((category) => {
        grouped[category.id] = {
          name: category.name,
          posts: allPosts.filter(
            (post) => post.category === category.id
          ),
        };
      });

      setPostsByCategory(grouped);

    } catch (err) {
      console.error("Error fetching all posts:", err);
      setError(
        "게시글을 불러올 수 없습니다. 콘솔의 에러 로그를 확인해 주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  if (categories.length > 0) {
    fetchAllPosts();
  }
}, [categories]);

  // 로딩 상태
  if (categoriesLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">

          <img
            src="/smile_loading.png"
            alt="Loading"
            className="w-24 h-24 mx-auto animate-spin"
          />

          <p className="mt-6 text-white text-xl font-bold font-mono">
            Loading...
          </p>

        </div>
      </div>
    );
  }

  // 에러 상태
  if (categoriesError || error) {
    return (
  <div className="flex items-center justify-center min-h-screen bg-black">
    <div className="text-center">

      <img
        src="/smile_error.png"
        alt="Error"
        className="w-24 h-24 mx-auto"
      />

      <p className="mt-6 text-white text-xl font-bold font-mono">
        ERROR!
      </p>

    </div>
  </div>
);
  }

    return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundImage: "url('/background_big.png')",
        backgroundRepeat: 'repeat',
        backgroundSize: '600px auto',
        backgroundPosition: 'top center',
        backgroundColor: '#000',
      }}
    >
      {/* INTRODUCTION */}
      <section className="w-full bg-[#151515]" >
        <div className="max-w-6xl mx-auto px-4 py-5 md:px-6 md:py-10">

          {/* Profile */}
          <div className="flex flex-col md:flex-row items-center md:items-center gap-5 md:gap-7">

            {/* Profile image */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-black">
                <img
                  src="/profile.jpeg"
                  alt="Songha Park"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80";
                  }}
                />
              </div>
            </div>

            {/* Profile text */}
            <div className="flex-1 text-center md:text-left">

              <div className="flex flex-col sm:flex-row sm:items-center justify-center md:justify-start gap-2.5">
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight font-mono">
                  Songha Park
                </h1>

                <span className="inline-block border border-[#bf00ff] bg-black text-[#bf00ff] text-[10px] font-mono font-bold px-2 py-1 self-center">
                  PHARMACIST
                </span>
              </div>

              <p className="text-sm md:text-base text-[#aaa] leading-relaxed font-medium mt-2 font-mono">
                약사, 비엔나에서 독일어 공부중 <br className="hidden md:inline" />
                심심해 죽겠어서 시작한 일상의 기록
              </p>

              {/* Social links */}
              <div className="flex justify-center md:justify-start gap-6 mt-4">

                {/* Email */}
                <a
                  href="mailto:songhapark.pharm@gmail.com"
                  className="w-10 h-10 flex items-center justify-center border border-[#333] bg-black text-white hover:text-[#39ff14] hover:border-[#39ff14] hover:shadow-[0_0_12px_rgba(57,255,20,0.35)] transition-all duration-300"
                  title="Email"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <polyline points="3 7 12 13 21 7" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/songha-park-4ab877378/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center border border-[#333] bg-black text-white hover:text-[#00a8ff] hover:border-[#00a8ff] hover:shadow-[0_0_12px_rgba(0,168,255,0.35)] transition-all duration-300"
                  title="LinkedIn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6.5 8.5H3.5V20h3V8.5ZM5 3C3.9 3 3 3.9 3 5s.9 2 2 2 2-.9 2-2-.9-2-2-2ZM20.5 13.4c0-3.4-1.8-5.2-4.3-5.2-2 0-2.9 1.1-3.4 1.8V8.5H10V20h2.8v-5.7c0-1.5.3-3 2.2-3 1.9 0 1.9 1.8 1.9 3.1V20H20v-6.6Z" />
                  </svg>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/songhapark-dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center border border-[#333] bg-black text-white hover:text-[#bf00ff] hover:border-[#bf00ff] hover:shadow-[0_0_12px_rgba(191,0,255,0.35)] transition-all duration-300"
                  title="GitHub"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.1c-3.2.7-3.87-1.54-3.87-1.54-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.27 1.19-3.07-.12-.29-.52-1.45.11-3.02 0 0 .97-.31 3.17 1.17a10.9 10.9 0 0 1 5.77 0c2.2-1.48 3.17-1.17 3.17-1.17.63 1.57.23 2.73.11 3.02.74.8 1.19 1.82 1.19 3.07 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.07.78 2.16v3.2c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                  </svg>
                </a>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <div className="max-w-6xl mx-auto px-4">
        {categories.length > 0 ? (
          <div className="space-y-8">
            {categories.map((category) => (
              <CategoryGrid
                key={category.id}
                categoryName={category.name}
                categoryId={category.id}
                posts={postsByCategory[category.id]?.posts || []}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-black border border-[#333]">
            <p className="text-gray-500 text-lg">
              장고 어드민에서 첫 카테고리를 기다리는 중입니다.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default MainPage;