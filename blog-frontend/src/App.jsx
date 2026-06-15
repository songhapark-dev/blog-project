import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MainPage from './pages/MainPage';
import About from './pages/About';
import PostDetail from './pages/PostDetail';
import CategoryPage from './pages/CategoryPage'; 
import LoginPage from './pages/LoginPage';
import WritePage from './pages/WritePage';
// 추가: 방금 신설한 게시물 관리 및 수정용 컴포넌트 임포트
import ManagePage from './pages/ManagePage';
import EditPage from './pages/EditPage'; 

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            {/* 메인 페이지 라우트 */}
            <Route path="/" element={<MainPage />} />
            
            {/* 소개(About) 페이지 라우트 */}
            <Route path="/about" element={<About />} />

            {/* 게시글 상세 페이지 라우트 (:id는 유동적인 숫자 ID를 뜻함) */}
            <Route path="/posts/:id" element={<PostDetail />} />
            
            {/* 카테고리별 페이지 라우트 */}
            <Route path="/category/:categoryId" element={<CategoryPage />} />

            {/* 관리자 로그인 페이지 비밀 선로 */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* 글쓰기 비밀 통로 */} 
            <Route path="/write" element={<WritePage />} />

            {/* 4-1. 관제 센터 관리자 전용 대시보드 주소 개설 */}
            <Route path="/manage" element={<ManagePage />} />

            {/* 4-2. 특정 글을 정밀 타격하여 고치기 위한 수정용 주소 개설 */}
            <Route path="/edit/:id" element={<EditPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;