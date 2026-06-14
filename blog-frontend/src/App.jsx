import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MainPage from './pages/MainPage';
import About from './pages/About';
import PostDetail from './pages/PostDetail';
import CategoryPage from './pages/CategoryPage'; 
import LoginPage from './pages/LoginPage'; // 1. 로그인 페이지 컴포넌트 임포트 추가!
import WritePage from './pages/WritePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            {/* 메인 페이지 라우트 */}
            <Route path="/" element={<MainPage />} />
            
            {/* 소개(About) 페이지 라우트 추가! */}
            <Route path="/about" element={<About />} />

            {/* 게시글 상세 페이지 라우트 추가! (:id는 유동적인 숫자 ID를 뜻함) */}
            <Route path="/posts/:id" element={<PostDetail />} />
            
            {/* 카테고리별 페이지 라우트 추가 */}
            <Route path="/category/:categoryId" element={<CategoryPage />} />

            {/* 2. 관리자 로그인 페이지 비밀 선로 개설! */}
            <Route path="/login" element={<LoginPage />} />
            {/* 3. 글쓰기 비밀통로 개설 */} 
            <Route path="/write" element={<WritePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;