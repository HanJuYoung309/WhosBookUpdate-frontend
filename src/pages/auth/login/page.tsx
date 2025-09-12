import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 폰트 및 아이콘 CDN 링크
const cdnLinks = `
  <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css" rel="stylesheet">
`;

// 동적으로 CSS를 추가하여 remixon 아이콘을 로드합니다.
if (typeof document !== 'undefined') {
  const head = document.head || document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(cdnLinks));
  head.appendChild(style);
}

// 메인 앱 컴포넌트
export default function App() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // useNavigate 훅을 컴포넌트 내부에서 호출

  const API_URL = 'http://localhost:8080/member';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setUser({ email: formData.email });
        setMessage('로그인에 성공했습니다!');
        
        // 로그인 성공 후 메인 페이지로 이동
        navigate('/'); 

      } else {
        const errorText = await response.text();
        setMessage(`로그인 실패: ${errorText}`);
      }
    } catch (error) {
      setMessage('네트워크 오류 또는 서버에 연결할 수 없습니다.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setMessage('로그아웃되었습니다.');
  };

  const handleSocialLogin = (provider: string) => {
    setMessage(`${provider} 로그인 기능은 현재 준비 중입니다.`);
    console.log(`${provider} 로그인 시도`);
  };

  // 로그인 성공 시 보여줄 메인 화면
  if (user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900">환영합니다!</h2>
          <p className="text-gray-600">성공적으로 로그인되었습니다.</p>
          <p className="text-sm text-gray-500 break-all">이메일: {user.email}</p>
          <button
            onClick={handleLogout}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium cursor-pointer"
          >
            로그아웃
          </button>
        </div>
      </div>
    );
  }

  // 로그인 페이지
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
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {message && (
              <div className={`p-3 rounded-lg text-sm text-center ${message.includes('성공') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium whitespace-nowrap transition-colors
                ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer'}`}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>
          </div>

          {/* Social Login */}
          <div className="mt-6 space-y-3">
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

          {/* Sign Up Link */}
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