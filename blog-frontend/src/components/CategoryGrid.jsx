import React from 'react';
import { Link } from 'react-router-dom';
import PostCard from './PostCard';

function CategoryGrid({ categoryName, categoryId, posts }) {
  const displayPosts = posts.slice(0, 3);

  return (
    <section className="mb-8">

      {/* CATEGORY HEADER */}
      <div className="flex items-end justify-between mb-4">

        <div>
          <div className="text-[9px] font-mono text-[#555] tracking-[0.25em] mb-1">
            CATEGORY
          </div>

          <h2 className="text-lg font-black font-mono tracking-wider text-white uppercase">
            <span className="text-[#39ff14]">#</span>{' '}
            {categoryName}
          </h2>
        </div>

        <Link
          to={`/category/${categoryId}`}
          className="
            text-[9px]
            font-mono
            tracking-wider
            text-[#555]
            hover:text-[#39ff14]
            transition-colors
          "
        >
          VIEW ALL →
        </Link>
      </div>

      {/* POSTS */}
      {displayPosts.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {displayPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
            />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-[#333] py-10 text-center">
          <p className="text-xs font-mono text-[#555]">
            // NO POSTS FOUND
          </p>
        </div>
      )}

    </section>
  );
}

export default CategoryGrid;