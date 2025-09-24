import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// It's recommended to add these links directly to your public/index.html <head> tag
// for better performance and to avoid re-rendering.
const cdnLinks = `
  <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css" rel="stylesheet">
`;
if (typeof document !== 'undefined') {
  document.head.insertAdjacentHTML('beforeend', cdnLinks);
}

// Main App Component
export default function App() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  // User state now expects a 'username' field, matching the server response
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const API_URL = 'http://localhost:8080/member';

  // On component mount, check if the user is already logged in via session cookie
  useEffect(() => {
    console.log('App mounted. Checking for existing session...');
    fetchUserInfo();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Utility function to handle API responses
  const handleApiResponse = async (response: Response) => {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      return { message: text, success: response.ok, isPlainText: true };
    }
  };

  // Fetches user information using the session cookie
  const fetchUserInfo = async () => {
    console.log('Attempting to fetch user info with GET /me...');
    try {
      const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        credentials: 'include' // Crucial for sending the session cookie
      });

      const userInfo = await handleApiResponse(response);
      console.log('Response from GET /me:', { status: response.status, body: userInfo });

      if (response.ok && userInfo && userInfo.username) {
        // *** FIX: Check for 'username' which is provided by the server ***
        setUser({ username: userInfo.username });
        console.log('Successfully fetched user info. User state set:', { username: userInfo.username });
        navigate('/'); // Redirect to main page on success
      } else {
        // This will trigger if the session is invalid or the response is unexpected
        console.warn('Could not retrieve valid user info. Clearing user state.');
        setUser(null);
        // Do not navigate here, might be on the login page already
      }
    } catch (error) {
      console.error('Network error during fetchUserInfo:', error);
      setMessage('네트워크 오류로 사용자 정보를 가져올 수 없습니다.');
    }
  };

  // Handles the login form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    console.log('Submitting login form with data:', formData);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include', // Crucial for receiving and storing the session cookie
      });
      
      const data = await handleApiResponse(response);
      console.log('Response from POST /login:', { status: response.status, body: data });

      if (response.ok) {
        setMessage('로그인 성공! 사용자 정보를 가져옵니다...');
        // After successful login, the browser has the cookie. Now fetch user details.
        await fetchUserInfo();
      } else {
        setMessage(`로그인 실패: ${data.message || '이메일 또는 비밀번호를 확인해주세요.'}`);
      }
    } catch (error) {
      setMessage('네트워크 오류 또는 서버에 연결할 수 없습니다.');
      console.error('Login submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handles logout
  const handleLogout = async () => {
    console.log('Logging out...');
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Server logout failed, but proceeding with client-side logout:', error);
    }
    setUser(null);
    setMessage('로그아웃되었습니다.');
    navigate('/login');
  };

  // If user is logged in, show the welcome screen
  if (user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-center p-4">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900">환영합니다, {user.username}님!</h2>
          <p className="text-gray-600">성공적으로 로그인되었습니다.</p>
          <button
            onClick={handleLogout}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium"
          >
            로그아웃
          </button>
        </div>
      </div>
    );
  }

  // Login Page UI (unchanged)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-600 mb-2" style={{ fontFamily: '"Pacifico", serif' }}>
              후즈북
            </h1>
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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
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
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
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
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors
                ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'}`}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
