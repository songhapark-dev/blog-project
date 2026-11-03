import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/PostCard';
import { useStore } from '../store/store';

const BACKEND_URL = 'https://blog-backend-35eq.onrender.com';

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim();

  const setSearchQuery = useStore((state) => state.setSearchQuery);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 주소창의 검색어를 검색창에도 반영 (새로고침·링크 공유 시)
  useEffect(() => {
    setSearchQuery(query);
  }, [query, setSearchQuery]);

  useEffect(() => {
    if (!query) return; // 검색어가 없으면 요청하지 않음

    let cancelled = false;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        // 백엔드 검색 API: 제목 + 본문에서 검색 (페이지네이션 끝까지 수집)
        let results = [];
        let url = `${BACKEND_URL}/posts/search/?q=${encodeURIComponent(query)}`;

        while (url) {
          const res = await axios.get(url);
          const batch = res.data.results || res.data;
          if (!Array.isArray(batch)) break;
          results = [...results, ...batch];
          url = res.data.next || null;
        }

        if (!cancelled) setPosts(results);
      } catch (err) {
        console.error('검색 실패:', err);
        if (!cancelled) setError('검색 중 오류가 발생했습니다.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchResults();

    // 결과가 오기 전에 검색어가 바뀌면 이전 결과는 버림
    return () => {
      cancelled = true;
    };
  }, [query]);

  if (query && loading) {
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
      {/* 상단 검색 헤더 */}
      <section className="w-full bg-[#151515]">
        <div className="max-w-6xl mx-auto px-4 py-6 md:px-6 md:py-10">
          <div className="text-[10px] font-mono text-[#777] tracking-[0.25em] mb-2">
            SEARCH
          </div>
          <h1 className="text-2xl md:text-3xl font-black font-mono tracking-wider text-white break-all">
            <span className="text-[#39ff14]">&gt;</span>{' '}
            {query ? `"${query}"` : '검색어를 입력하세요'}
          </h1>
          {query && !error && (
            <p className="mt-3 text-xs md:text-sm font-mono text-[#aaa]">
              {'// '}
              <span className="font-bold text-[#d4d4d4]">{posts.length}</span> RESULTS
            </p>
          )}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {query && posts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          query && (
            <div className="text-center py-20 bg-black border border-[#333]">
              <p className="text-[#aaa] font-mono mb-6">
                {error || '검색 결과가 없습니다.'}
              </p>
              <Link
                to="/"
                className="inline-block border border-[#333] bg-black text-white hover:text-[#39ff14] hover:border-[#39ff14] hover:shadow-[0_0_12px_rgba(57,255,20,0.35)] px-4 py-2 font-mono font-bold text-sm transition-all"
              >
                HOME
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default SearchPage;
