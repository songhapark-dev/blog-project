import PostCard from './PostCard';

function CategoryGrid({ categoryName, posts, categoryId }) {
  return (
    <div className="mb-16">
      {/* 카테고리 제목 */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 border-b-4 border-blue-600 pb-3 inline-block">
          {categoryName}
        </h2>
        <p className="text-gray-600 mt-2">
          {posts.length}개의 게시글
        </p>
      </div>

      {/* 게시글 그리드 */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            아직 게시글이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}

export default CategoryGrid;