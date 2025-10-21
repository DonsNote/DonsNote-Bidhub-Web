'use client';

import Link from 'next/link';

/**
 * 404 Not Found Page
 * 페이지를 찾을 수 없을 때 표시되는 페이지
 */

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 숫자 */}
        <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>

        {/* 메시지 */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          페이지를 찾을 수 없습니다
        </h2>

        <p className="text-gray-600 mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            홈으로 이동
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            이전 페이지
          </button>
        </div>

        {/* 도움말 링크 */}
        <div className="mt-12">
          <p className="text-sm text-gray-500 mb-2">도움이 필요하신가요?</p>
          <div className="flex justify-center gap-4">
            <Link
              href="/"
              className="text-sm text-blue-600 hover:underline"
            >
              홈
            </Link>
            <Link
              href="/my-bid"
              className="text-sm text-blue-600 hover:underline"
            >
              내 입찰
            </Link>
            <a
              href="https://www.github.com/donsnote"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              문의하기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
