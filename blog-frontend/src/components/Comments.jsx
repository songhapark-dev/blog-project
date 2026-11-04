import { useState } from 'react';
import axios from 'axios';
import { useStore } from '../store/store';

const BACKEND_URL = 'https://blog-backend-35eq.onrender.com';
const AUTHOR_MAX = 20;
const CONTENT_MAX = 1000;
const NICKNAME_KEY = 'comment_nickname';

// 닉네임은 다음 댓글을 위해 브라우저에 기억 (안 되는 환경이면 무시)
const loadNickname = () => {
  try {
    return localStorage.getItem(NICKNAME_KEY) || '';
  } catch {
    return '';
  }
};
const saveNickname = (name) => {
  try {
    localStorage.setItem(NICKNAME_KEY, name);
  } catch {
    /* 무시 */
  }
};

// 백엔드 에러 응답 → 화면에 보여줄 한 줄 메시지
const getErrorMessage = (err) => {
  if (err.response?.status === 429) {
    return '댓글을 너무 자주 작성했어요. 잠시 후 다시 시도해 주세요.';
  }
  const data = err.response?.data;
  if (data && typeof data === 'object') {
    const first = Object.values(data).flat()[0];
    if (typeof first === 'string') return first;
  }
  return '댓글 등록 중 오류가 발생했습니다.';
};

const formatDate = (dateString) =>
  new Date(dateString).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

function Comments({ postId, initialComments = [] }) {
  const token = useStore((state) => state.token);
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  // 백엔드는 최신순으로 주므로, 오래된 댓글이 위로 오게 뒤집기
  const [comments, setComments] = useState(() => [...initialComments].reverse());
  const [author, setAuthor] = useState(loadNickname);
  const [content, setContent] = useState('');
  const [website, setWebsite] = useState(''); // 스팸봇용 숨은 칸
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!author.trim()) {
      setError('닉네임을 입력해 주세요.');
      return;
    }
    if (!content.trim()) {
      setError('댓글 내용을 입력해 주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const headers = isAuthenticated ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(
        `${BACKEND_URL}/comments/`,
        { post: postId, author: author.trim(), content: content.trim(), website },
        { headers }
      );
      setComments((prev) => [...prev, res.data]);
      setContent('');
      saveNickname(author.trim());
    } catch (err) {
      console.error('댓글 등록 실패:', err);
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (comment) => {
    if (!window.confirm(`${comment.author}님의 댓글을 삭제할까요?`)) return;
    try {
      await axios.delete(`${BACKEND_URL}/comments/${comment.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => prev.filter((c) => c.id !== comment.id));
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
      alert('삭제 권한이 없거나 오류가 발생했습니다.');
    }
  };

  return (
    <section className="max-w-[760px] mx-auto mt-4 px-5 py-8 md:px-10 md:py-10 bg-[#181818] border border-[#2a2a2a]">
      <h2 className="font-mono font-bold text-white text-lg tracking-wider mb-6">
        COMMENTS{' '}
        <span className="text-[#777] font-normal">{'// '}{comments.length}</span>
      </h2>

      {/* 댓글 목록 */}
      {comments.length > 0 ? (
        <ul className="divide-y divide-[#2a2a2a] border-y border-[#2a2a2a] mb-8">
          {comments.map((comment) => (
            <li key={comment.id} className="py-4">
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <div className="flex items-baseline gap-3 min-w-0">
                  <span className="font-bold text-[#f2f2f2] text-sm truncate">
                    {comment.author}
                  </span>
                  <span className="font-mono text-[11px] text-[#777] shrink-0">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                {isAuthenticated && (
                  <button
                    onClick={() => handleDelete(comment)}
                    className="font-mono text-[11px] font-bold text-[#777] hover:text-[#ff3b5c] transition-colors shrink-0"
                  >
                    DELETE
                  </button>
                )}
              </div>
              <p className="text-[#cfcfcf] text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                {comment.content}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[#777] font-mono text-sm mb-8">
          아직 댓글이 없어요. 첫 댓글을 남겨 주세요.
        </p>
      )}

      {/* 작성 폼 */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          maxLength={AUTHOR_MAX}
          placeholder="닉네임"
          className="w-full sm:w-60 h-10 px-3 bg-black border border-[#333] text-white text-sm placeholder-[#555] outline-none focus:border-[#555] transition-colors"
        />

        {/* 스팸봇 차단용 숨은 칸: 사람에게는 보이지 않음 */}
        <input
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] w-px h-px opacity-0"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={CONTENT_MAX}
          rows={4}
          placeholder="댓글을 남겨 주세요."
          className="w-full px-3 py-2.5 bg-black border border-[#333] text-[#e6e6e6] text-[15px] leading-relaxed placeholder-[#555] outline-none focus:border-[#555] transition-colors resize-y"
        />

        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] text-[#777]">
            {content.length} / {CONTENT_MAX}
          </span>
          <button
            type="submit"
            disabled={submitting}
            className="border border-[#333] bg-black text-white hover:text-[#39ff14] hover:border-[#39ff14] hover:shadow-[0_0_12px_rgba(57,255,20,0.35)] px-4 py-2 font-mono font-bold text-sm transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {submitting ? 'POSTING...' : 'POST'}
          </button>
        </div>

        {error && <p className="text-[#ff3b5c] text-sm">{error}</p>}
      </form>
    </section>
  );
}

export default Comments;
