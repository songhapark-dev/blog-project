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
          currentCategory ? currentCategory.name : 'BOARD'
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
      {/* 상단 카테고리 헤더 */}
      <section className="w-full bg-[#151515]">
        <div className="max-w-6xl mx-auto px-4 py-6 md:px-6 md:py-10">
          <div className="text-[10px] font-mono text-[#777] tracking-[0.25em] mb-2">
            CATEGORY
          </div>
          <h1 className="text-2xl md:text-3xl font-black font-mono tracking-wider text-white uppercase">
            <span className="text-[#39ff14]">#</span> {categoryName}
          </h1>
          <p className="mt-3 text-xs md:text-sm font-mono text-[#aaa]">
            {'// '}
            <span className="font-bold text-[#d4d4d4]">{posts.length}</span> POSTS
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 게시글 그리드 */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-black border border-[#333]">
            <p className="text-[#aaa] font-mono mb-6">
              아직 작성된 게시글이 없습니다.
            </p>
            <Link
              to="/"
              className="inline-block border border-[#333] bg-black text-white hover:text-[#39ff14] hover:border-[#39ff14] hover:shadow-[0_0_12px_rgba(57,255,20,0.35)] px-4 py-2 font-mono font-bold text-sm transition-all"
            >
              HOME
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
