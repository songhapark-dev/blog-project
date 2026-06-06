import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MainPage from './pages/MainPage';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            {/* 🏠 메인 페이지 라우트 */}
            <Route path="/" element={<MainPage />} />
            
            {/* 🇦🇹 소개(About) 페이지 라우트 추가! */}
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;