/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",  // ⭐ 이 부분 추가
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Pretendard Variable"', 'Pretendard', '-apple-system', 'BlinkMacSystemFont',
          'system-ui', 'Roboto', '"Apple SD Gothic Neo"', '"Noto Sans KR"', 'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}