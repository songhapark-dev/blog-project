import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      {/* 히어로 섹션 */}
      <div className="text-center mb-16 bg-gradient-to-r from-red-500/10 via-gray-100 to-red-500/10 py-12 rounded-2xl border border-gray-200 shadow-sm animate-fade-in">
        <span className="text-5xl mb-4 block">🇦🇹</span>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          한국 로컬 약사의 오스트리아 생존기
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
          약밥만 먹던 30대 약사, 연고도 없이 비엔나에 떨어지다!
        </p>
      </div>

      {/* 자기소개 본문 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2 space-y-6 text-base leading-relaxed">
          <p>
            로컬 약국 경력만 6년, 30대 중반이라는 적지 않은 나이에 굳이 안정적인 궤도를 이탈해 사서 고생 중인 늦깎이 이직러 
            <strong className="text-red-600 font-semibold"> 박송하(Songha Park)</strong>입니다.
          </p>
          <p>
            현재 아무런 기반도, 연고도 없이 오직 약국을 벗어나보자는 마음 하나로 
            <strong> 여행 비자 하나 들고 훌쩍 오스트리아 비엔나</strong>로 날아와 맨땅에 헤딩중.
          </p>
          <p>
            이 블로그는 낯선 유럽 땅에서 <span className="underline decoration-red-400 font-medium">제약회사 직장 구하기</span>, 
            <span className="underline decoration-blue-400 font-medium">독일어 괴물과 맞짱 뜨기</span>, 그리고 아주 낯설고 매력적인 오스트리아 문화에 
            적응해 나가는 좌충우돌 라이프를 솔직하고 위트 있게 기록하는 공간입니다.
          </p>
          <p className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-gray-700 italic">
            "이 여정이 과연 인생 2막의 찬란한 대성공이 될지, 아니면 돈과 시간을 날린 
            대폭망이 될지 흥미진진하게 지켜봐 주세요"
          </p>
        </div>

        {/* 사이드바: 보유 기술 및 관심사 */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-inner space-y-6">
          <div>
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              🧪 Identity
            </h3>
            <p className="text-sm text-gray-600">6년 차 면허 소지 약사 (Pharm.D)</p>
            <p className="text-sm text-gray-600">아마추어 파이썬/리액트 개발자</p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              🚀 Now Exploring
            </h3>
            <div className="flex flex-wrap gap-1.5">
              <span className="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-md font-medium">독일어 🇩🇪</span>
              <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-md font-medium">React / Django 💻</span>
              <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-md font-medium">비엔나 라이프 ☕</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-200 my-8" />

      {/* 연락처 및 SNS 섹션 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-900">📬 Contact & Channels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <a href="mailto:songhapark.pharm@gmail.com" className="flex items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
            📧 <span className="text-gray-600 hover:text-black">songhapark.pharm@gmail.com</span>
          </a>
          <a href="https://www.linkedin.com/in/songha-park-4ab877378/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
            💼 <span className="text-blue-600 font-medium hover:underline">LinkedIn 프로필</span>
          </a>
          <a href="https://github.com/songhapark-dev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
            🐙 <span className="text-gray-900 font-medium hover:underline">GitHub 저장소</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;