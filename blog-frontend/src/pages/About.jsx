import React from 'react';

const About = () => {
  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundImage: "url('/background_big.png')",
        backgroundRepeat: 'repeat',
        backgroundSize: '600px auto',
        backgroundPosition: 'top center',
        backgroundColor: '#000',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-10 md:px-6 md:py-14">

        {/* ABOUT CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">

          {/* INTRODUCTION */}
          <div className="md:col-span-2">

            <div className="space-y-7 text-white/75 text-base md:text-lg leading-relaxed font-mono">

              <p>
                로컬 약국 경력만 6년, 30대 중반이라는 적지 않은 나이에
                굳이 안정적인 궤도를 이탈해 사서 고생 중인 늦깎이 이직러.
              </p>

              <p>
                현재 아무런 기반도, 연고도 없이 오직 약국을 벗어나보자는
                마음 하나로{' '}
                <strong className="text-white">
                  여행 비자 하나 들고 훌쩍 오스트리아 비엔나
                </strong>
                로 날아와 맨땅에 헤딩 중.
              </p>

              <p>
                이 여정이 과연 인생 2막을 여는 대성공이 될지,
                아니면 돈과 시간만 날린 대폭망이 될지
                흥미진진하게 지켜봐 주시라!
              </p>

            </div>
          </div>


          {/* SIDEBAR */}
          <aside className="md:pt-8 space-y-10">

            {/* IDENTITY */}
            <div>
              <h2 className="text-lg font-black font-mono text-white mb-4">
                <span className="text-white ">//</span> Identity
              </h2>

              <div className="space-y-2 font-mono">
                <p className="text-sm text-white/70">
                  6년 차 면허 소지 약사 (Pharm.D)
                </p>

                <p className="text-sm text-white/70">
                  코딩 입문러
                </p>

                <p className="text-sm text-white/70">
                  석사학위 준비중
                </p>
              </div>
            </div>


            {/* NOW EXPLORING */}
            <div>
              <h2 className="text-lg font-black font-mono text-white mb-4">
                <span className="text-white">//</span> Now Exploring
              </h2>

              <div className="space-y-3 font-mono text-sm">

                <div className="text-white/70">
                  <span className="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-md font-medium">
                    독일어 🇩🇪
                  </span>

                  <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-md font-medium">
                    Python 💻
                  </span>

                  <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-md font-medium">
                    Wiener Leben ☕
                  </span>
                </div>

              </div>
            </div>

          </aside>

        </div>

      </div>
    </div>
  );
};

export default About;