import React from 'react';
import { Link } from 'react-router-dom';
import PostCard from './PostCard';

function CategoryGrid({ categoryName, categoryId, posts }) {
  // 🎯 1. 대문(MainPage)에는 최신 게시글 딱 3개까지만 잘라서 보여주기!
  const displayPosts = posts.slice(0, 3);

  return (
    <div className="mb-14">
      {/* 🏷️ 섹션 헤더 영역: 타이틀과 바로가기 버튼이 나란히 배치되도록 Flex 조정 */}
      <div className="flex justify-between items-end border-b border-gray-100 pb-3 mb-6">
        
        {/* 좌측: 카테고리 이름 */}
        <h3 className="text-xl font-extrabold text-gray-950 flex items-center gap-1.5">
          <span className="text-red-500">#</span> {categoryName}
        </h3>
        
        {/* 🎯 우측: 송하님이 구상하신 '[게시판이름] 바로가기 →' 버튼 */}
        <Link
          to={`/category/${categoryId}`}
          className="text-xs md:text-sm font-semibold text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1 group pb-0.5"
        >
          {categoryName} 바로가기 
          <span className="transform group-hover:translate-x-1 transition-transform inline-block">→</span>
        </Link>
      </div>

      {/* 🎴 3열 그리드 레이아웃 스타일 */}
      {displayPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        /* 글이 하나도 없을 때 보여줄 예외 컴포넌트 */
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-400">아직 이 게시판에 등록된 글이 없습니다. 🇦🇹</p>
        </div>
      )}
    </div>
  );
}

export default CategoryGrid;