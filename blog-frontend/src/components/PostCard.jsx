import { Link } from 'react-router-dom';

function PostCard({ post }) {
  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  return (
    <Link to={`/posts/${post.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 h-full hover:scale-105 transform">
        {/* 제목 */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {post.title}
        </h3>

        {/* 카테고리 배지 */}
        <div className="mb-3">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
            {post.category_name}
          </span>
        </div>

        {/* 날짜 */}
        <p className="text-sm text-gray-500 mb-4">
          📅 {formatDate(post.created_at)}
        </p>

        {/* 조회수 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            👁️ {post.view_count} views
          </span>
          <span className="text-blue-600 font-medium text-sm group-hover:text-blue-800">
            읽기 →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;