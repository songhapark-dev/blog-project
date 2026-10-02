import { Link } from 'react-router-dom';

function PostCard({ post }) {
  const BACKEND_URL = 'https://blog-backend-35eq.onrender.com';

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    if (
      imagePath.startsWith('http://') ||
      imagePath.startsWith('https://')
    ) {
      return imagePath;
    }

    return `${BACKEND_URL}${imagePath}`;
  };

  return (
    <Link
      to={`/posts/${post.id}`}
      className="group block relative aspect-[4/3] overflow-hidden bg-black border border-[#333] hover:border-[#39ff14] transition-all duration-300"
    >
      {/* IMAGE */}
      {post.image ? (
        <img
          src={getImageUrl(post.image)}
          alt={post.title}
          className="
            absolute inset-0
            w-full h-full
            object-cover
            transition-all duration-500
            group-hover:scale-105
            group-hover:opacity-25
          "
        />
      ) : (
        <div
          className="
            absolute inset-0
            bg-gradient-to-br
            from-[#111]
            via-[#1a1a1a]
            to-[#111]
            group-hover:opacity-25
            transition-opacity duration-500
          "
        />
      )}

      {/* DARK OVERLAY */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-t
          from-black/80
          via-black/20
          to-transparent
          group-hover:from-white/60
          group-hover:via-white/30
          group-hover:to-white/20
          transition-all duration-500
        "
      />

      {/* CATEGORY */}
      <div
        className="
          absolute top-3 left-3
          text-[9px] font-mono tracking-widest
          text-[#39ff14]
          border border-[#39ff14]
          px-2 py-1
          bg-black/70
          group-hover:bg-white/80
          group-hover:text-black
          group-hover:border-black
          transition-all duration-300
        "
      >
        {post.category_name || 'GENERAL'}
      </div>

      {/* TITLE */}
      <div
        className="
          absolute inset-x-0 bottom-0
          p-4
          transition-all duration-300
        "
      >
        <h3
          className="
            text-white
            font-bold
            text-base
            leading-tight
            line-clamp-3
            drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
            group-hover:text-black
            group-hover:drop-shadow-none
            group-hover:font-black
            transition-all duration-300
          "
        >
          {post.title}
        </h3>

        {/* DATE / VIEWS */}
        <div
          className="
            mt-2
            text-[9px]
            font-mono
            text-white/60
            opacity-0
            translate-y-2
            group-hover:opacity-100
            group-hover:translate-y-0
            group-hover:text-black/70
            transition-all duration-300
          "
        >
          {new Date(post.created_at).toLocaleDateString('ko-KR')}
          {' // '}
          {post.view_count} VIEWS
        </div>
      </div>

      {/* PIXEL CORNERS */}
      <div className="absolute top-0 right-0 w-3 h-px bg-[#39ff14] opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-0 right-0 w-px h-3 bg-[#39ff14] opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="absolute bottom-0 left-0 w-3 h-px bg-[#bf00ff] opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-px h-3 bg-[#bf00ff] opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}

export default PostCard;