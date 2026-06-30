import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import { fetchPosts } from '../utils/api';
import CategoryGrid from '../components/CategoryGrid';

function MainPage() {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [postsByCategory, setPostsByCategory] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 모든 게시글을 카테고리별로 그룹화 (최종 방어막 장착)
  useEffect(() => {
    const fetchAllPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchPosts();
        
        // 🎯 [수정] response.data 안에 한 번 더 들어있는 진짜 배열(.data)을 꺼내옵니다!
        // 만약 구조가 쌩 배열로 바뀔 때를 대비해 || response.data 까지 안전하게 가드 처리합니다.
        const allPosts = response.data.data || response.data;

        // 카테고리별로 게시글 그룹화
        const grouped = {};
        categories.forEach((category) => {
          grouped[category.id] = {
            name: category.name,
            // 이제 allPosts가 확실한 배열이므로 .filter가 웅장하게 정상 작동합니다!
            posts: allPosts.filter((post) => post.category === category.id),
          };
        });

        setPostsByCategory(grouped);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('게시글을 불러올 수 없습니다.');
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">비엔나에서 데이터 가져오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (categoriesError || error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold mb-4">
            ⚠️ 오류가 발생했습니다.
          </p>
          <p className="text-gray-600">
            {categoriesError || error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* 레퍼런스 스타일: 미니멀 테크 블로그 프로필 상단 */}
      <section className="max-w-4xl mx-auto pt-4 pb-12 border-b border-gray-100 mb-14">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          
          {/* 1. 동그란 프로필 이미지 (좌측 배칭) */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm bg-gray-50">
              <img 
                src="/profile.jpeg"
                alt="Songha Park" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80";
                }}
              />
            </div>
            {/* 감성적인 오스트리아 미니 국기 플로팅 뱃지 */}
            <div className="absolute bottom-1 right-1 bg-white text-base p-1 rounded-full shadow-sm border border-gray-100 leading-none select-none">
              🇦🇹
            </div>
          </div>

          {/* 2. 타이포그래피 소개 글 본진 */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-center md:justify-start gap-2.5">
              <h1 className="text-2xl md:text-3xl font-black text-gray-950 tracking-tight">
                Songha Park
              </h1>
              <span className="inline-block bg-red-50 text-red-600 text-[10px] font-extrabold px-2 py-0.5 rounded-md self-center">
                Pharmacist & Developer
              </span>
            </div>
            
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-medium max-w-2xl">
              아무 연고도 없는 비엔나에 떨어져 독일어, 직장, 코딩까지 <br className="hidden md:inline" />
              0부터 다시 시작하며 사서 고생하는 6년차 한국 약사.
            </p>

            {/* 3. 심플 내비게이션 및 소셜 네트워크 트리오 */}
            <div className="flex justify-center md:justify-start pt-3">
              {/* 1. 직관적인 편지봉투 메일 */}
              <a 
                href="mailto:songhapark.pharm@gmail.com"
                className="w-14 h-14 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:text-[#EA4335] hover:border-[#EA4335] hover:shadow-md transition-all duration-300"
                title="Email"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </a>

              {/* 2. 링크드인 공식 아이콘 */}
              <a 
                href="https://www.linkedin.com/in/songha-park-4ab877378/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-14 h-14 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:text-[#0A66C2] hover:border-[#0A66C2] hover:shadow-md transition-all duration-300"
                title="LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>

              {/* 3. 깃허브 공식 아이콘 */}
              <a 
                href="https://github.com/songhapark-dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-14 h-14 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:text-[#181717] hover:border-[#181717] hover:shadow-md transition-all duration-300"
                title="GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 카테고리별 게시글 섹션 */}
      {categories.length > 0 ? (
        <div className="space-y-16">
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
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">
            장고 어드민에서 첫 카테고리를 기다리는 중입니다.
          </p>
        </div>
      )}
    </div>
  );
}

export default MainPage;