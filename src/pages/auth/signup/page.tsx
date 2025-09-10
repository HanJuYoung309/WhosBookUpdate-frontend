import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface FormData {
  name: string;
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
  introduction: string;
  status: 'active' | 'busy' | 'away';
}

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    introduction: '',
    status: 'active'
  });
  
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [agreePrivacy, setAgreePrivacy] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messageColor, setMessageColor] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 백엔드 서버 주소를 여기에 입력해주세요.
  const API_BASE_URL = 'http://localhost:8080/member/signup';

  // 입력 필드 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 이미지 변경 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB 제한
        setMessage('파일 크기는 5MB 이하로 선택해주세요.');
        setMessageColor('text-red-600');
        return;
      }
      
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 프로필 이미지 제거 핸들러
  const removeProfileImage = () => {
    setProfileImage(null);
    setProfileImagePreview('');
    const fileInput = document.getElementById('profileImage') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  // 폼 제출 핸들러 (회원가입 로직)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.');
      setMessageColor('text-red-600');
      setIsLoading(false);
      return;
    }
    
    if (!agreeTerms || !agreePrivacy) {
      setMessage('이용약관과 개인정보처리방침에 동의해주세요.');
      setMessageColor('text-red-600');
      setIsLoading(false);
      return;
    }

    try {
      // 서버가 기대하는 JSON 형식으로 데이터 전송
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          nickname: formData.nickname,
          email: formData.email,
          password: formData.password,
          introduction: formData.introduction,
          status: formData.status
        }),
      });

      if (response.ok) {
        setMessage('회원가입이 성공적으로 완료되었습니다!');
        setMessageColor('text-green-600');
        // TODO: 회원가입 성공 후 프로필 이미지 업로드 로직 추가 (별도의 API 필요)
      } else {
        const errorData = await response.json();
        setMessage(`회원가입 실패: ${errorData.message}`);
        setMessageColor('text-red-600');
      }
    } catch (error) {
      console.error('Network or server error:', error);
      setMessage('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setMessageColor('text-red-600');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = (provider: 'google' | 'kakao') => {
    console.log(`${provider} 회원가입 시도`);
  };

  const isPasswordValid = formData.password.length >= 8;
  const isPasswordMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';

  const statusOptions = [
    { value: 'active', label: '활동중', color: 'bg-green-500' },
    { value: 'busy', label: '바쁨', color: 'bg-yellow-500' },
    { value: 'away', label: '자리비움', color: 'bg-gray-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-blue-600 mb-2" style={{ fontFamily: '"Pacifico", serif' }}>
              후즈북
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">회원가입</h2>
          <p className="text-gray-600">후즈북 커뮤니티에 참여하세요</p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                  {profileImagePreview ? (
                    <img 
                      src={profileImagePreview} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-gray-400">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.299.695 18.294 18.294 0 0 1-8.525 2.126c-.829 0-1.644-.13-2.433-.374a18.36 18.36 0 0 1-1.905-.664 2.25 2.25 0 0 1-1.026-.845.75.75 0 0 1-.299-.695Z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {profileImagePreview && (
                  <button
                    type="button"
                    onClick={removeProfileImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M6 18L18 6M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>
              <div>
                <label htmlFor="profileImage" className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium whitespace-nowrap">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex items-center justify-center mr-2 inline-flex">
                    <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
                    <path fillRule="evenodd" d="M9.303 2.25a.75.75 0 0 1 .79-.375 49.106 49.106 0 0 1 1.778.078c.846.126 1.45.698 1.45 1.554V3.75c0 .32.203.585.488.663A6.745 6.745 0 0 1 17.25 5.25a.75.75 0 0 1 .494.419 7.556 7.556 0 0 0 4.108 3.535.75.75 0 0 1 .375.772v1.442a.75.75 0 0 1-.397.662 48.062 48.062 0 0 1-5.187 2.113.75.75 0 0 1-.652-.162l-1.41-1.127a.75.75 0 0 0-.968.109l-.497.662a.75.75 0 0 1-.776.223 10.706 10.706 0 0 0-1.579-.115.75.75 0 0 1-.806-.806 9.255 9.255 0 0 1-.115-1.578.75.75 0 0 1 .223-.776l.662-.497a.75.75 0 0 0 .109-.968l-1.127-1.41a.75.75 0 0 1-.162-.652c.691-1.312 1.453-2.658 2.28-3.996a.75.75 0 0 1 .663-.488H9.303Z" clipRule="evenodd" />
                    <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
                  </svg>
                  프로필 사진 선택
                </label>
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-1 text-center">JPG, PNG 파일만 가능 (최대 5MB)</p>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="실명을 입력하세요"
                />
              </div>

              <div>
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
                  닉네임 <span className="text-red-500">*</span>
                </label>
                <input
                  id="nickname"
                  name="nickname"
                  type="text"
                  required
                  value={formData.nickname}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="사용할 닉네임을 입력하세요"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일 <span className="text-red-500">*</span>
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

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-12 ${
                      formData.password && !isPasswordValid ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="8자 이상의 비밀번호"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      {showPassword ? (
                        <path d="M12 4.5c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zM4.5 13.5c0-4.14 3.36-7.5 7.5-7.5 4.14 0 7.5 3.36 7.5 7.5S16.14 21 12 21 4.5 17.64 4.5 13.5zM12 17c-2.48 0-4.5-2.02-4.5-4.5S9.52 8 12 8s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5zm0-7.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z" />
                      ) : (
                        <path d="M12 4.5c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zM4.5 13.5c0-4.14 3.36-7.5 7.5-7.5 4.14 0 7.5 3.36 7.5 7.5S16.14 21 12 21 4.5 17.64 4.5 13.5z" />
                      )}
                    </svg>
                  </button>
                </div>
                {formData.password && !isPasswordValid && (
                  <p className="mt-1 text-sm text-red-600">비밀번호는 8자 이상이어야 합니다.</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 확인 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-12 ${
                      formData.confirmPassword && !isPasswordMatch ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="비밀번호를 다시 입력하세요"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      {showConfirmPassword ? (
                        <path d="M12 4.5c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zM4.5 13.5c0-4.14 3.36-7.5 7.5-7.5 4.14 0 7.5 3.36 7.5 7.5S16.14 21 12 21 4.5 17.64 4.5 13.5zM12 17c-2.48 0-4.5-2.02-4.5-4.5S9.52 8 12 8s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5zm0-7.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z" />
                      ) : (
                        <path d="M12 4.5c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zM4.5 13.5c0-4.14 3.36-7.5 7.5-7.5 4.14 0 7.5 3.36 7.5 7.5S16.14 21 12 21 4.5 17.64 4.5 13.5z" />
                      )}
                    </svg>
                  </button>
                </div>
                {formData.confirmPassword && !isPasswordMatch && (
                  <p className="mt-1 text-sm text-red-600">비밀번호가 일치하지 않습니다.</p>
                )}
              </div>
            </div>

            {/* Status Selection */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                상태
              </label>
              <div className="relative">
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none pr-8 cursor-pointer"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-400">
                    <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center mt-2">
                <div className={`w-3 h-3 rounded-full mr-2 ${statusOptions.find(opt => opt.value === formData.status)?.color}`}></div>
                <span className="text-sm text-gray-600">
                  현재 상태: {statusOptions.find(opt => opt.value === formData.status)?.label}
                </span>
              </div>
            </div>

            {/* Introduction */}
            <div>
              <label htmlFor="introduction" className="block text-sm font-medium text-gray-700 mb-2">
                자기소개
              </label>
              <textarea
                id="introduction"
                name="introduction"
                rows={4}
                value={formData.introduction}
                onChange={handleInputChange}
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                placeholder="간단한 자기소개를 작성해주세요. (최대 500자)"
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">독서 취향, 관심 분야 등을 소개해보세요</p>
                <span className="text-xs text-gray-500">{formData.introduction.length}/500</span>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="space-y-3">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                />
                <span className="ml-2 text-sm text-gray-600">
                  <span className="text-red-500">*</span> 이용약관에 동의합니다.{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 cursor-pointer">보기</a>
                </span>
              </label>
              
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                />
                <span className="ml-2 text-sm text-gray-600">
                  <span className="text-red-500">*</span> 개인정보처리방침에 동의합니다.{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 cursor-pointer">보기</a>
                </span>
              </label>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`text-center p-3 rounded-lg ${messageColor === 'text-green-600' ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className={`font-medium ${messageColor}`}>{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium cursor-pointer whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                '회원가입'
              )}
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

          {/* Social Sign Up */}
          <div className="mt-6 space-y-3">
            <button
              onClick={() => handleSocialSignUp('google')}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" fill="currentColor" className="w-5 h-5 text-red-500 mr-3">
                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 49.3 149.3 124.3 149.3 135.5 0 240.3-138.8 192-259.9l-2.7-14.8H248v92.7h151.7c-45.4 118.5-131.5 204.6-258.9 204.6-118.1 0-213.9-95.8-213.9-213.9S131.1 43 248 43c51.9 0 92 18.2 124 49.9l-67.5 64.9c-32.1-31.8-73.1-50-124-50-86.4 0-156.4 70-156.4 156.4s70 156.4 156.4 156.4c86.4 0 156.4-70 156.4-156.4z" />
              </svg>
              <span className="text-gray-700 font-medium">구글로 회원가입</span>
            </button>
            
            <button
              onClick={() => handleSocialSignUp('kakao')}
              className="w-full flex items-center justify-center px-4 py-3 bg-yellow-400 rounded-lg hover:bg-yellow-500 transition-colors cursor-pointer whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-brown-600 mr-3">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.8 14.2c-1.32-.82-2.26-1.92-2.26-3.26 0-1.42 1.04-2.5 2.5-2.5s2.5 1.08 2.5 2.5c0 1.34-.94 2.44-2.26 3.26zm3.6-6.4c1.32.82 2.26 1.92 2.26 3.26 0 1.42-1.04 2.5-2.5 2.5s-2.5-1.08-2.5-2.5c0-1.34.94-2.44 2.26-3.26z" />
              </svg>
              <span className="text-brown-600 font-medium">카카오로 회원가입</span>
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
