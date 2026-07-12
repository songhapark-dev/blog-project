import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/PostCard';

function CategoryPage() {
  const { categoryId } = useParams();
  const [posts, setPosts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = 'https://blog-backend-35eq.onrender.com';

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);

        // 1. 게시글 전체 데이터를 DRF 페이지네이션의 next가 없을 때까지 수집
        let allPosts = [];
        let url = `${BACKEND_URL}/posts/`;

        while (url) {
          const res = await axios.get(url);

          // 페이지네이션 구조(results)와 일반 배열 구조 모두 대응
          const currentBatch = res.data.results || res.data;

          if (Array.isArray(currentBatch)) {
            allPosts = [...allPosts, ...currentBatch];
          } else {
            // 예상하지 못한 응답 구조일 경우 무한 루프 방지
            break;
          }

          // 다음 페이지가 있으면 계속 추적, 없으면 null로 종료
          url = res.data.next || null;
        }

        // 2. 카테고리 목록 가져오기
        const categoriesRes = await axios.get(
          `${BACKEND_URL}/categories/`
        );

        const allCategories =
          categoriesRes.data.results || categoriesRes.data;

        // 3. 전체 게시글 중 현재 카테고리에 해당하는 글만 필터링
        const filteredPosts = allPosts.filter((post) => {
          const postCategoryId =
            typeof post.category === 'object'
              ? post.category?.id
              : post.category;

         return String(postCategoryId) === String(categoryId);
        });

        console.log('필터링된 글 개수:', filteredPosts.length);

        setPosts(filteredPosts);

        // 4. 현재 카테고리 이름 찾기
        const currentCategory = Array.isArray(allCategories)
          ? allCategories.find(
              (cat) => String(cat.id) === String(categoryId)
            )
          : null;

        setCategoryName(
          currentCategory ? currentCategory.name : '게시판'
        );
      } catch (err) {
        console.error(
          '카테고리 데이터를 가져오는데 실패했습니다:',
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 상단 카테고리 헤더 */}
      <div className="border-b border-gray-100 pb-6 mb-10">
        <h1 className="text-3xl font-extrabold text-gray-950 flex items-center gap-2">
          <span className="text-red-500">#</span> {categoryName}
        </h1>

        <p className="text-sm text-gray-400 mt-2">
          총{' '}
          <span className="font-semibold text-gray-700">
            {posts.length}개
          </span>
          의 게시글이 있습니다.
        </p>
      </div>

      {/* 게시글 그리드 */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-lg mb-4">
            아직 작성된 게시글이 없습니다. 📭
          </p>

          <Link
            to="/"
            className="text-sm bg-gray-900 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition"
          >
            홈으로 가기
          </Link>
        </div>
      )}
    </div>
  );
}

export default CategoryPage;

