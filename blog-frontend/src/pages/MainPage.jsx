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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
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
    <div>
      {/* 프로필 섹션 (메인 배너) */}
      <section className="mb-16 text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🌍 내 블로그
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            오스트리아 생활, 독일어 학습, 코딩 여정
          </p>
          <p className="text-gray-500">
            기술과 삶의 경험을 나누는 공간입니다.
          </p>
        </div>
      </section>

      {/* 카테고리별 게시글 섹션 */}
      {categories.length > 0 ? (
        <div>
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
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            카테고리가 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}

export default MainPage;