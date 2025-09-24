// 실제 API_URL을 사용하세요.
const API_URL = 'http://localhost:8080/member';

/**
 * 로그인 API 호출을 담당하는 서비스 함수
 * 네트워크 요청과 관련된 로직만 처리합니다.
 */
export const loginUser = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    return response.ok;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
