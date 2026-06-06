import { useEffect, useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { fetchPosts } from '../utils/api';
import CategoryGrid from '../components/CategoryGrid';

function MainPage() {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [postsByCategory, setPostsByCategory] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 모든 게시글을 카테고리별로 그룹화
  useEffect(() => {
    const fetchAllPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchPosts();
        const allPosts = response.data.results || response.data;

        // 카테고리별로 게시글 그룹화
        const grouped = {};
        categories.forEach((category) => {
          grouped[category.id] = {
            name: category.name,
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
      {/* 🇦🇹 변경된 프로필 섹션 (메인 배너) */}
      <section className="mb-16 text-center py-14 bg-gradient-to-r from-red-500/10 via-white to-red-500/10 rounded-2xl border border-gray-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4">
          <span className="text-5xl mb-4 block animate-bounce">🌍</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            나의 오스트리아 생존기
          </h1>
          <p className="text-xl font-medium text-gray-700 mb-3">
            6년 차 로컬 약사의 대책 없는 유럽 이직 & 코딩 v-log
          </p>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            아무 연고도 없이 비엔나에 떨어져 독일어와 싸우고, <br className="hidden sm:inline"/>
            직장을 구하며, 밤마다 코딩을 하는 사서 고생하는 이야기입니다.
          </p>
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