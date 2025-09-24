import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../features/auth/AuthForm';
import { useAuth } from '../hooks/useAuth';
import { loginUser } from '../services/authService';

/**
 * 로그인 페이지 컴포넌트
 * 이 컴포넌트는 UI를 표시하고 훅과 서비스를 연결하는 역할을 합니다.
 */
export default function LoginPage() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, handleLogin, handleLogout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setMessage('');
    try {
      const success = await loginUser(formData);
      if (success) {
        handleLogin(formData.email);
        setMessage('로그인에 성공했습니다!');
        navigate('/'); // 로그인 성공 후 메인 페이지로 이동
      } else {
        setMessage('로그인 실패: 이메일 또는 비밀번호를 확인해주세요.');
      }
    } catch (error) {
      setMessage('네트워크 오류 또는 서버에 연결할 수 없습니다.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 사용자가 로그인되어 있으면 메인 화면을 표시
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

  // 로그인 폼을 표시
  return <AuthForm onSubmit={handleSubmit} isLoading={isLoading} message={message} />;
}
