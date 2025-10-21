'use client';

import { useEffect } from 'react';

/**
 * Global Error Page
 * 앱 전역에서 발생하는 에러를 처리하는 페이지
 */

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅 (프로덕션에서는 외부 서비스로 전송)
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* 에러 아이콘 */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* 에러 메시지 */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              문제가 발생했습니다
            </h2>
            <p className="text-gray-600 mb-6">
              예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
            </p>

            {/* 개발 환경에서만 에러 상세 정보 표시 */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2 font-medium">
                  에러 상세 정보 (개발 모드)
                </summary>
                <div className="bg-gray-100 p-4 rounded-lg overflow-auto">
                  <p className="text-xs text-red-600 font-mono whitespace-pre-wrap break-words">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-gray-500 mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              </details>
            )}

            {/* 액션 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={reset}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                다시 시도
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                홈으로 이동
              </button>
            </div>

            {/* 도움말 */}
            <p className="text-sm text-gray-500 mt-6">
              문제가 계속되면{' '}
              <a
                href="https://www.github.com/donsnote"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                문의해주세요
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
