import { Link } from 'react-router-dom';

function PostCard({ post }) {
  // 백엔드 실전 서버 도메인 주소 정의
  const BACKEND_URL = 'https://blog-backend-35eq.onrender.com';

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  // 백엔드가 완전한 URL을 주지 않고 상대 경로만 줬을 때를 위한 안전장치
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // 이미 https:// 등으로 시작하는 완전한 주소라면 그대로 반환
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // 상대 경로(/media/...)라면 백엔드 베이스 URL을 붙여서 완전한 주소로 조립
    return `${BACKEND_URL}${imagePath}`;
  };

  return (
    <Link to={`/posts/${post.id}`} className="group block h-full">
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-full hover:-translate-y-2 transform overflow-hidden border border-gray-100 flex flex-col">
        
        {/* 이미지가 있을 때 상단 썸네일 영역 활성화 */}
        {post.image ? (
          <div className="w-full h-48 overflow-hidden bg-gray-50 border-b border-gray-100 relative">
            <img 
              src={getImageUrl(post.image)} // 👈 조립된 완전한 이미지 주소 주입!
              alt={post.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {post.category_name || '일반'}
            </span>
          </div>
        ) : (
          /* 이미지가 없는 글일 경우 디자인 깨짐 방지 */
          <div className="p-6 pb-0">
            <span className="inline-block bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full">
              {post.category_name || '일반'}
            </span>
          </div>
        )}

        {/* 본문 영역 */}
        <div className="p-6 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-500 transition-colors duration-300">
              {post.title}
            </h3>
            <p className="text-gray-500 text-sm line-clamp-3 mb-4 leading-relaxed">
              {post.content || '본문 내용이 없습니다.'}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
              <span>📅</span> {formatDate(post.created_at)}
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                👁️ {post.view_count} views
              </span>
              <span className="text-red-500 font-semibold text-sm group-hover:text-red-600 transition-colors flex items-center gap-1">
                보기 <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}

export default PostCard;