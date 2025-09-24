import { useState, useEffect } from 'react';

/**
 * 인증 상태를 관리하는 커스텀 훅
 * 사용자 상태(로그인 여부)와 관련된 로직을 캡슐화합니다.
 */
export function useAuth() {
  const [user, setUser] = useState(null);

  // 로컬 스토리지에 사용자 상태를 저장하고 불러오는 로직을 추가할 수 있습니다.
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (email) => {
    const newUser = { email };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return { user, handleLogin, handleLogout };
}