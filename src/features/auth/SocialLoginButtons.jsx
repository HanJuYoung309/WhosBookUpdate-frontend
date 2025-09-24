import React from 'react';

/**
 * 소셜 로그인 버튼을 표시하는 컴포넌트
 * UI와 관련된 로직만 처리합니다.
 */
export default function SocialLoginButtons() {
  const handleSocialLogin = (provider) => {
    // 실제 소셜 로그인 로직은 여기에 구현될 수 있습니다.
    // 현재는 메시지만 표시합니다.
    alert(`${provider} 로그인 기능은 현재 준비 중입니다.`);
    console.log(`${provider} 로그인 시도`);
  };

  return (
    <div className="mt-6 space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">또는</span>
        </div>
      </div>
      <button
        onClick={() => handleSocialLogin('구글')}
        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
      >
        <i className="ri-google-fill w-5 h-5 flex items-center justify-center text-red-500 mr-3"></i>
        <span className="text-gray-700 font-medium">구글로 로그인</span>
      </button>
      <button
        onClick={() => handleSocialLogin('카카오')}
        className="w-full flex items-center justify-center px-4 py-3 bg-yellow-400 rounded-lg hover:bg-yellow-500 transition-colors cursor-pointer whitespace-nowrap"
      >
        <i className="ri-kakao-talk-fill w-5 h-5 flex items-center justify-center text-brown-600 mr-3"></i>
        <span className="text-brown-600 font-medium">카카오로 로그인</span>
      </button>
    </div>
  );
}