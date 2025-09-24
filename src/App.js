import React from 'react';
import { useAuth } from './hooks/useAuth';
import { useForm } from './hooks/useForm';
import LoginPage from './pages/LoginPage.jsx';
import WelcomePage from './components/WelcomePage';
import { useNavigate } from 'react-router-dom';

// 폰트 및 아이콘 CDN 링크
const cdnLinks = `
  <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css" rel="stylesheet">
`;

// 동적으로 CSS를 추가하여 remixicon 아이콘을 로드합니다.
if (typeof document !== 'undefined') {
  const head = document.head || document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(cdnLinks));
  head.appendChild(style);
}

export default function App() {
  const { user, isLoading, message, login, logout, socialLogin } = useAuth();
  const { formData, handleInputChange } = useForm({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
    if (success) {
      navigate('/'); // WelcomePage로 이동하도록 변경하는 것이 더 자연스럽습니다.
    }
  };

  // 로그인 성공 시 환영 페이지 표시
  if (user) {
    return <WelcomePage user={user} onLogout={logout} />;
  }

  // 로그인 페이지 표시
  return (
    <LoginPage
      formData={formData}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      message={message}
      isLoading={isLoading}
      onSocialLogin={socialLogin}
    />
  );
}