import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStore } from '../store/store';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const loginStore = useStore((state) => state.login);

  const BACKEND_URL = 'https://blog-backend-35eq.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(false);

    try {
      setLoading(true);
      // 백엔드에 ID/PW 던지기
      const response = await axios.post(`${BACKEND_URL}/api/token/`, {
        username,
        password,
      });

      // 성공 시 access 토큰을 낚아채서 Zustand 금고에 저장
      const accessToken = response.data.access;
      loginStore(accessToken);

      // 로그인 성공 후 메인 페이지로 강제 이동
      navigate('/');
    } catch (err) {
      console.error('로그인 실패:', err);
      setError('아이디 또는 비밀번호가 올바르지 않습니다. 🇦🇹');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-100 shadow-xl">
        <div className="text-center mb-8">
          <span className="text-4xl block mb-2">🔐</span>
          <h2 className="text-2xl font-extrabold text-gray-950">가디언 로그인</h2>
          <p className="text-xs text-gray-400 mt-1">오직 블로그 주인만 진입할 수 있습니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 text-sm transition"
              placeholder="아이디 입력"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 text-sm transition"
              placeholder="비밀번호 입력"
            />
          </div>

          {error && <p className="text-xs font-semibold text-red-600 animate-pulse">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-950 text-white py-3 rounded-xl text-sm font-bold hover:bg-red-600 transition shadow-md disabled:bg-gray-300"
          >
            {loading ? '열쇠 검증 중...' : '로그인하기'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;