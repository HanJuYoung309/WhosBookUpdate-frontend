import React, { useState, createContext, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// AuthContext를 생성합니다.
interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider 컴포넌트로 로그인 상태를 관리합니다.
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // 세션의 유효성을 확인하여 로그인 상태를 업데이트하는 함수
  const checkLoginStatus = async () => {
    try {
      // 세션 쿠키가 유효한지 확인하는 백엔드 API 호출
      await axios.get('http://localhost:8080/member/me', {
        withCredentials: true
      });
      // 요청 성공 시 세션이 유효하므로 로그인 상태로 설정
      setIsLoggedIn(true);
    } catch (error) {
      // 요청 실패 시 (예: 401 Unauthorized), 세션이 없거나 만료된 것으로 간주
      setIsLoggedIn(false);
      console.log("세션이 유효하지 않아 로그아웃 상태로 처리됩니다.");
    }
  };

  useEffect(() => {
    // 컴포넌트가 처음 마운트될 때 로그인 상태를 확인합니다.
    checkLoginStatus();
  }, []);

  const login = () => {
    // 실제 로그인 API 호출 후 상태를 업데이트하는 로직으로 대체되어야 합니다.
    setIsLoggedIn(true);
    // 로그인 성공 후 메인 페이지로 이동
    navigate('/');
  };

const logout = async () => {
  try {
    // 서버에 로그아웃 요청
    await axios.post('http://localhost:8080/logout', {}, {
      withCredentials: true
    });
  } catch (error) {
    // 오류가 발생해도 로그 만 출력하고 계속 진행
    //console.warn('서버 로그아웃 요청 실패:', error.message);
  } finally {
    // 서버 요청 성공/실패와 상관없이 항상 클라이언트 상태 정리
    setIsLoggedIn(false);
    alert('로그아웃되었습니다.');
    navigate('/');
  }
};

  const value = { isLoggedIn, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// AuthContext를 사용하기 위한 훅
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Curator 및 Curation 인터페이스와 데이터는 변경 없음.
interface Curator {
  id: number;
  name: string;
  bio: string;
  followers: number;
  curations: number;
  likes: number;
  profileImage: string;
}

interface Curation {
  id: number;
  title: string;
  description: string;
  curator: string;
  curatorId: number;
  likes: number;
  comments: number;
  bookCount: number;
  tags: string[];
  createdAt: string;
  coverImage: string;
}

const HomeContent = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'curators' | 'curations'>('curations');
  const [showNotification, setShowNotification] = useState(false);

  // '큐레이터 되기' 링크 클릭 핸들러
  const handleCurationLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setShowNotification(true);
      
      setTimeout(() => {
        setShowNotification(false);
        navigate('/login');
      }, 2000);
    }
  };
  
  const topCurators: Curator[] = [
    {
      id: 1,
      name: '김독서',
      bio: '문학과 철학을 사랑하는 독서광입니다.',
      followers: 15420,
      curations: 45,
      likes: 8932,
      profileImage: 'https://readdy.ai/api/search-image?query=Professional%20Korean%20book%20curator%2C%20warm%20smile%2C%20holding%20books%2C%20cozy%20library%20background%2C%20soft%20lighting%2C%20portrait%20photography%20style%2C%20friendly%20and%20intellectual%20appearance&width=100&height=100&seq=curator1&orientation=squarish'
    },
    {
      id: 2,
      name: '박문학',
      bio: '소설과 에세이 전문 큐레이터',
      followers: 12350,
      curations: 38,
      likes: 7245,
      profileImage: 'https://readdy.ai/api/search-image?query=Middle-aged%20Korean%20literary%20curator%2C%20glasses%2C%20thoughtful%20expression%2C%20surrounded%20by%20classic%20books%2C%20warm%20library%20atmosphere%2C%20professional%20portrait%20style&width=100&height=100&seq=curator2&orientation=squarish'
    },
    {
      id: 3,
      name: '이책사랑',
      bio: '자기계발과 비즈니스 도서 추천 전문가',
      followers: 10280,
      curations: 52,
      likes: 6834,
      profileImage: 'https://readdy.ai/api/search-image?query=Young%20Korean%20business%20book%20curator%2C%20confident%20smile%2C%20modern%20office%20setting%20with%20business%20books%2C%20professional%20lighting%2C%20contemporary%20portrait%20style&width=100&height=100&seq=curator3&orientation=squarish'
    },
    {
      id: 4,
      name: '정북마니아',
      bio: '판타지와 SF 소설 큐레이션의 달인',
      followers: 9450,
      curations: 41,
      likes: 5892,
      profileImage: 'https://readdy.ai/api/search-image?query=Creative%20Korean%20fantasy%20book%20curator%2C%20artistic%20background%20with%20fantasy%20novels%2C%20imaginative%20atmosphere%2C%20colorful%20lighting%2C%20artistic%20portrait%20style&width=100&height=100&seq=curator4&orientation=squarish'
    },
    {
      id: 5,
      name: '한책읽기',
      bio: '역사와 인문학 도서 전문 큐레이터',
      followers: 8760,
      curations: 35,
      likes: 5234,
      profileImage: 'https://readdy.ai/api/search-image?query=Scholarly%20Korean%20history%20book%20curator%2C%20traditional%20Korean%20study%20room%2C%20historical%20books%2C%20warm%20candlelight%2C%20academic%20atmosphere%2C%20classical%20portrait%20style&width=100&height=100&seq=curator5&orientation=squarish'
    }
  ];

  const topCurations: Curation[] = [
    {
      id: 1,
      title: '마음을 치유하는 힐링 도서 10선',
      description: '일상에 지친 마음을 달래주는 따뜻한 책들을 소개합니다. 에세이부터 소설까지 다양한 장르의 힐링 도서를 만나보세요.',
      curator: '김독서',
      curatorId: 1,
      likes: 2847,
      comments: 156,
      bookCount: 10,
      tags: ['힐링', '에세이', '소설', '마음치유'],
      createdAt: '2024-01-15',
      coverImage: 'https://readdy.ai/api/search-image?query=Peaceful%20healing%20books%20collection%2C%20soft%20pastel%20colors%2C%20cozy%20reading%20nook%20with%20tea%2C%20warm%20sunlight%2C%20serene%20atmosphere%2C%20minimalist%20composition%20with%20books%20and%20plants&width=300&height=200&seq=curation1&orientation=landscape'
    },
    {
      id: 2,
      title: '2024년 꼭 읽어야 할 현대 소설',
      description: '올해 출간된 화제작부터 숨은 보석 같은 작품까지, 현대 소설의 트렌드를 한눈에 살펴볼 수 있는 큐레이션입니다.',
      curator: '박문학',
      curatorId: 2,
      likes: 2134,
      comments: 89,
      bookCount: 12,
      tags: ['현대소설', '신간', '문학', '베스트셀러'],
      createdAt: '2024-01-20',
      coverImage: 'https://readdy.ai/api/search-image?query=Modern%20Korean%20novels%20display%2C%20contemporary%20book%20covers%2C%20clean%20white%20background%2C%20artistic%20arrangement%2C%20bright%20lighting%2C%20professional%20book%20photography%20style&width=300&height=200&seq=curation2&orientation=landscape'
    },
    {
      id: 3,
      title: '성공하는 사람들의 필독서',
      description: '글로벌 CEO들과 성공한 기업가들이 추천하는 자기계발서와 비즈니스 도서를 엄선했습니다.',
      curator: '이책사랑',
      curatorId: 3,
      likes: 1892,
      comments: 134,
      bookCount: 15,
      tags: ['자기계발', '비즈니스', 'CEO추천', '성공'],
      createdAt: '2024-01-12',
      coverImage: 'https://readdy.ai/api/search-image?query=Business%20success%20books%20collection%2C%20professional%20office%20setting%2C%20leadership%20and%20success%20themed%20books%2C%20modern%20corporate%20atmosphere%2C%20sleek%20design%2C%20motivational%20mood&width=300&height=200&seq=curation3&orientation=landscape'
    },
    {
      id: 4,
      title: '환상의 세계로 떠나는 판타지 여행',
      description: '현실을 벗어나 마법과 모험이 가득한 판타지 세계로 여러분을 초대합니다. 국내외 명작 판타지 소설 모음.',
      curator: '정북마니아',
      curatorId: 4,
      likes: 1567,
      comments: 78,
      bookCount: 8,
      tags: ['판타지', '모험', '마법', '판타지소설'],
      createdAt: '2024-01-18',
      coverImage: 'https://readdy.ai/api/search-image?query=Fantasy%20books%20collection%2C%20mystical%20atmosphere%2C%20dragons%20and%20castles%20in%20background%2C%20enchanted%20library%20setting%2C%20purple%20and%20gold%20colors&width=300&height=200&seq=curation4&orientation=landscape'
    },
    {
      id: 5,
      title: '역사를 바꾼 인물들의 이야기',
      description: '세계사를 움직인 위대한 인물들의 삶과 철학을 담은 전기와 역사서를 소개합니다.',
      curator: '한책읽기',
      curatorId: 5,
      likes: 1234,
      comments: 67,
      bookCount: 11,
      tags: ['역사', '전기', '인물', '세계사'],
      createdAt: '2024-01-10',
      coverImage: 'https://readdy.ai/api/search-image?query=Historical%20biography%20books%2C%20vintage%20library%20setting%2C%20old%20leather-bound%20books%2C%20classical%20atmosphere%2C%20warm%20golden%20lighting%2C%20scholarly%20environment&width=300&height=200&seq=curation5&orientation=landscape'
    },
    {
      id: 6,
      title: '겨울밤에 읽기 좋은 추리소설',
      description: '추운 겨울밤, 담요를 덮고 읽기 좋은 스릴 넘치는 추리소설들을 모았습니다.',
      curator: '김독서',
      curatorId: 1,
      likes: 987,
      comments: 45,
      bookCount: 9,
      tags: ['추리소설', '미스터리', '겨울', '스릴러'],
      createdAt: '2024-01-08',
      coverImage: 'https://readdy.ai/api/search-image?query=Mystery%20detective%20books%20collection%2C%20dark%20moody%20atmosphere%2C%20winter%20evening%20setting%2C%20fireplace%20background%2C%20cozy%20reading%20corner%2C%20noir%20style%20lighting&width=300&height=200&seq=curation6&orientation=landscape'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600" style={{ fontFamily: '"Pacifico", serif' }}>
                후즈북
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                // 로그인 상태일 때 로그아웃 버튼 표시
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors cursor-pointer whitespace-nowrap"
                >
                  로그아웃
                </button>
              ) : (
                // 로그인하지 않은 상태일 때 로그인/회원가입 버튼 표시
                <>
                  <Link 
                    to="/login"
                    className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    로그인
                  </Link>
                  <Link 
                    to="/signup"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              책과 함께하는 특별한 여행
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              다양한 큐레이터들이 추천하는 책들을 만나보세요. 
              당신만의 독서 여정을 시작하고, 다른 독서가들과 소통해보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/curations"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium cursor-pointer whitespace-nowrap"
              >
                큐레이션 둘러보기
              </Link>
              <Link 
                to="/curation/create"
                onClick={handleCurationLinkClick}
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors text-lg font-medium cursor-pointer whitespace-nowrap text-center"
              >
                큐레이터 되기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setActiveTab('curations')}
              className={`px-6 py-2 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'curations'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              인기 큐레이션
            </button>
            <button
              onClick={() => setActiveTab('curators')}
              className={`px-6 py-2 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'curators'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              인기 큐레이터
            </button>
          </div>
        </div>

        {/* Curations Tab */}
        {activeTab === 'curations' && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">좋아요가 많은 큐레이션</h3>
              <Link 
                to="/curations"
                className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer whitespace-nowrap"
              >
                더보기 →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topCurations.map((curation) => (
                <Link
                  key={curation.id}
                  to={`/curation/${curation.id}`}
                  className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="aspect-[3/2] rounded-t-xl overflow-hidden">
                    <img
                      src={curation.coverImage}
                      alt={curation.title}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-blue-600 font-medium">{curation.curator}</span>
                      <span className="text-sm text-gray-500">{curation.createdAt}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {curation.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {curation.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {curation.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <i className="ri-heart-line w-4 h-4 flex items-center justify-center"></i>
                          <span>{curation.likes.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <i className="ri-chat-3-line w-4 h-4 flex items-center justify-center"></i>
                          <span>{curation.comments}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <i className="ri-book-line w-4 h-4 flex items-center justify-center"></i>
                          <span>{curation.bookCount}권</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Curators Tab */}
        {activeTab === 'curators' && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">좋아요가 많은 큐레이터</h3>
              <Link 
                to="/curators"
                className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer whitespace-nowrap"
              >
                더보기 →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topCurators.map((curator) => (
                <Link
                  key={curator.id}
                  to={`/curator/${curator.id}`}
                  className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer block"
                >
                  <div className="p-6 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                      <img
                        src={curator.profileImage}
                        alt={curator.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      {curator.name}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {curator.bio}
                    </p>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {curator.followers.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">팔로워</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {curator.curations}
                        </div>
                        <div className="text-xs text-gray-500">큐레이션</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">
                          {curator.likes.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">좋아요</div>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Handle follow action
                      }}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer whitespace-nowrap"
                    >
                      팔로우
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold text-blue-600 mb-4" style={{ fontFamily: '"Pacifico", serif' }}>
                후즈북
              </h3>
              <p className="text-gray-600 mb-4">
                책을 사랑하는 사람들이 모여 만드는 큐레이션 플랫폼입니다.
                당신만의 독서 취향을 발견하고 공유해보세요.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                  <i className="ri-google-fill w-5 h-5 flex items-center justify-center text-gray-600"></i>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                  <i className="ri-kakao-talk-fill w-5 h-5 flex items-center justify-center text-gray-600"></i>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">빠른 링크</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 cursor-pointer">큐레이션</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 cursor-pointer">큐레이터</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 cursor-pointer">내 서재</a></li>
                <li><a href="https://readdy.ai/?origin=logo" className="text-gray-600 hover:text-blue-600 cursor-pointer">Made with Readdy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">고객지원</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 cursor-pointer">도움말</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 cursor-pointer">문의하기</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 cursor-pointer">이용약관</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 cursor-pointer">개인정보처리방침</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2024 후즈북. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* 로그인 알림 메시지 */}
      {showNotification && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black text-white px-8 py-4 rounded-lg shadow-2xl z-50 transition-opacity duration-300 animate-fadeInOut">
          <p className="text-center">로그인 후 이용 가능합니다.</p>
        </div>
      )}

      {/* CSS 애니메이션 스타일 (Tailwind CSS를 보완하기 위한 기본 스타일) */}
      <style>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; }
          10%, 90% { opacity: 1; }
        }
        .animate-fadeInOut {
          animation: fadeInOut 2s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default function Home() {
    // AuthProvider로 감싸서 isLoggedIn 상태를 전역적으로 관리
    return (
      <AuthProvider>
        <HomeContent />
      </AuthProvider>
    );
} 