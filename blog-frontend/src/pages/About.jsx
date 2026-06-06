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
            로컬 약국 경력만 6년, 30대 중반이라는 적지 않은 나이에 굳이 안정적인 궤도를 이탈해 사서 고생 중인 늦깎이 이직러.
          </p>
          <p>
            현재 아무런 기반도, 연고도 없이 오직 약국을 벗어나보자는 마음 하나로 
            <strong> 여행 비자 하나 들고 훌쩍 오스트리아 비엔나</strong>로 날아와 맨땅에 헤딩중.
          </p>
          <p>
            이 여정이 과연 인생 2막을 여는 대성공이 될지, 아니면 돈과 시간만 날린 
            대폭망이 될지 흥미진진하게 지켜봐 주시라!
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
      {/* 📬 완벽하게 정돈된 공식 라인 아이콘 채널 섹션 */}
      <div className="mt-16 pt-8 border-t border-gray-100 max-w-2xl mx-auto">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center mb-6">
          Find Me On
        </p>
        
        <div className="flex justify-center gap-5">
          {/* 1. 직관적인 편지봉투 메일 (호버 시 구글 레드 #EA4335) */}
          <a 
            href="mailto:songhapark.pharm@gmail.com"
            className="w-14 h-14 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:text-[#EA4335] hover:border-[#EA4335] hover:shadow-md transition-all duration-300"
            title="Email"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </a>

          {/* 2. 링크드인 공식 아이콘 (호버 시 링크드인 블루 #0A66C2) */}
          <a 
            href="https://www.linkedin.com/in/songha-park-4ab877378/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-14 h-14 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:text-[#0A66C2] hover:border-[#0A66C2] hover:shadow-md transition-all duration-300"
            title="LinkedIn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>

          {/* 3. 깃허브 공식 아이콘 (호버 시 깃허브 블랙 #181717) */}
          <a 
            href="https://github.com/songhapark-dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-14 h-14 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:text-[#181717] hover:border-[#181717] hover:shadow-md transition-all duration-300"
            title="GitHub"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;