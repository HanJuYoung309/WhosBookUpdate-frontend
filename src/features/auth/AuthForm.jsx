import React, { useState } from 'react';
import SocialLoginButtons from './SocialLoginButtons';

/**
 * 로그인 및 회원가입 폼을 표시하는 컴포넌트
 * UI와 관련된 로직만 처리하며, 인증 로직은 부모 컴포넌트에서 전달받습니다.
 */
export default function AuthForm({ onSubmit, isLoading, message }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <a href="#" className="inline-block">
            <h1 className="text-3xl font-bold text-blue-600 mb-2" style={{ fontFamily: '"Pacifico", serif' }}>
              후즈북
            </h1>
          </a>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">로그인</h2>
          <p className="text-gray-600">책과 함께하는 특별한 여행을 시작하세요</p>
        </div>
        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
            {/* 이메일 입력 필드 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="example@email.com"
              />
            </div>
            {/* 비밀번호 입력 필드 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-12"
                  placeholder="비밀번호를 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className={`ri-eye-line ${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}`}></i>
                </button>
              </div>
            </div>
            {/* 로그인 유지 및 비밀번호 찾기 */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">로그인 상태 유지</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                비밀번호를 잊으셨나요?
              </a>
            </div>
            {/* 메시지 표시 */}
            {message && (
              <div className={`p-3 rounded-lg text-sm text-center ${message.includes('성공') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}
            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium whitespace-nowrap transition-colors
                ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer'}`}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>
          {/* 소셜 로그인 버튼 */}
          <SocialLoginButtons />
          {/* 회원가입 링크 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              아직 계정이 없으신가요?{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
                회원가입
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}