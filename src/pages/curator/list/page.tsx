
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface Curator {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  followers: number;
  following: number;
  curations: number;
  likes: number;
  specialties: string[];
  location: string;
  joinedDate: string;
  isFollowing: boolean;
  isVerified: boolean;
}

const SPECIALTIES = [
  '전체', '문학', '소설', '에세이', '자기계발', '비즈니스', 
  '역사', '철학', '과학', '예술', '심리학', '경제', '여행', '요리'
];

const SORT_OPTIONS = [
  { id: 'popular', name: '인기순' },
  { id: 'followers', name: '팔로워순' },
  { id: 'curations', name: '큐레이션순' },
  { id: 'latest', name: '최신가입순' }
];

const generateMockCurators = (count: number): Curator[] => {
  const curators: Curator[] = [];
  const names = [
    '김서현', '이준호', '박미영', '정현우', '최예은', '장민석', '한지우', '오세진',
    '노하늘', '윤서영', '임재현', '조민정', '강도윤', '배민석', '송예은', '양수빈',
    '김독서', '박문학', '이책사랑', '정북마니아', '한책읽기', '최소설', '장에세이', '오철학'
  ];
  
  const bios = [
    '문학과 철학을 사랑하는 독서광입니다.',
    '소설과 에세이 전문 큐레이터',
    '자기계발과 비즈니스 도서 추천 전문가',
    '판타지와 SF 소설 큐레이션의 달인',
    '역사와 인문학 도서 전문 큐레이터',
    '현대 문학과 고전을 아우르는 독서 멘토',
    '실용서와 자기계발서 전문가',
    '심리학과 인간관계 도서 큐레이터',
    '경제와 투자 도서 추천 전문가',
    '여행과 문화 관련 도서 큐레이터',
    '과학과 기술 도서 전문가',
    '예술과 디자인 도서 큐레이터'
  ];

  const locations = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
  
  const specialtiesList = [
    ['문학', '소설', '에세이'],
    ['자기계발', '비즈니스', '경제'],
    ['역사', '철학', '인문학'],
    ['과학', '기술', '미래'],
    ['예술', '디자인', '문화'],
    ['심리학', '인간관계', '소통'],
    ['여행', '문화', '라이프스타일'],
    ['요리', '건강', '웰빙']
  ];

  for (let i = 1; i <= count; i++) {
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomBio = bios[Math.floor(Math.random() * bios.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const randomSpecialties = specialtiesList[Math.floor(Math.random() * specialtiesList.length)];
    const followers = Math.floor(Math.random() * 50000) + 100;
    const curations = Math.floor(Math.random() * 100) + 5;
    
    curators.push({
      id: i.toString(),
      name: `${randomName}${i > names.length ? i : ''}`,
      bio: randomBio,
      avatar: `https://readdy.ai/api/search-image?query=Professional%20Korean%20book%20curator%20profile%20photo%2C%20friendly%20smile%2C%20warm%20lighting%2C%20studio%20portrait%2C%20modern%20aesthetic%2C%20clean%20background%2C%20intellectual%20appearance&width=120&height=120&seq=curator${i}&orientation=squarish`,
      followers,
      following: Math.floor(Math.random() * 1000) + 50,
      curations,
      likes: Math.floor(followers * curations * 0.1) + Math.floor(Math.random() * 5000),
      specialties: randomSpecialties,
      location: `${randomLocation}, 대한민국`,
      joinedDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      isFollowing: Math.random() > 0.8,
      isVerified: Math.random() > 0.7
    });
  }
  
  return curators;
};

const ITEMS_PER_PAGE = 16;

export default function CuratorListPage() {
  const [curators, setCurators] = useState<Curator[]>([]);
  const [displayedCurators, setDisplayedCurators] = useState<Curator[]>([]);
  const [filteredCurators, setFilteredCurators] = useState<Curator[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('전체');
  const [selectedSort, setSelectedSort] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isInfiniteScroll, setIsInfiniteScroll] = useState(false);
  
  const observer = useRef<IntersectionObserver>();
  
  const lastCuratorElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && isInfiniteScroll) {
        loadMoreCurators();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, isInfiniteScroll]);

  useEffect(() => {
    const mockData = generateMockCurators(120);
    setCurators(mockData);
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [curators, selectedSpecialty, selectedSort, searchQuery]);

  useEffect(() => {
    if (isInfiniteScroll) {
      setDisplayedCurators(filteredCurators.slice(0, ITEMS_PER_PAGE));
      setCurrentPage(1);
      setHasMore(filteredCurators.length > ITEMS_PER_PAGE);
    } else {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      setDisplayedCurators(filteredCurators.slice(startIndex, endIndex));
    }
  }, [filteredCurators, currentPage, isInfiniteScroll]);

  const applyFiltersAndSort = () => {
    let filtered = [...curators];

    // 전문분야 필터
    if (selectedSpecialty !== '전체') {
      filtered = filtered.filter(curator => 
        curator.specialties.includes(selectedSpecialty)
      );
    }

    // 검색 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(curator => 
        curator.name.toLowerCase().includes(query) ||
        curator.bio.toLowerCase().includes(query) ||
        curator.specialties.some(specialty => specialty.toLowerCase().includes(query)) ||
        curator.location.toLowerCase().includes(query)
      );
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (selectedSort) {
        case 'followers':
          return b.followers - a.followers;
        case 'curations':
          return b.curations - a.curations;
        case 'latest':
          return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
        case 'popular':
        default:
          return (b.followers + b.likes * 0.1) - (a.followers + a.likes * 0.1);
      }
    });

    setFilteredCurators(filtered);
    setCurrentPage(1);
  };

  const loadMoreCurators = () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    setTimeout(() => {
      const nextPageStart = displayedCurators.length;
      const nextPageEnd = nextPageStart + ITEMS_PER_PAGE;
      const nextItems = filteredCurators.slice(nextPageStart, nextPageEnd);
      
      if (nextItems.length > 0) {
        setDisplayedCurators(prev => [...prev, ...nextItems]);
        setHasMore(nextPageEnd < filteredCurators.length);
      } else {
        setHasMore(false);
      }
      setLoading(false);
    }, 500);
  };

  const toggleFollow = (curatorId: string) => {
    setCurators(prev =>
      prev.map(curator => {
        if (curator.id === curatorId) {
          return {
            ...curator,
            isFollowing: !curator.isFollowing,
            followers: curator.isFollowing ? curator.followers - 1 : curator.followers + 1
          };
        }
        return curator;
      })
    );
  };

  const totalPages = Math.ceil(filteredCurators.length / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600" style={{ fontFamily: '"Pacifico", serif' }}>
                후즈북
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/curations"
                className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                큐레이션
              </Link>
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
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">큐레이터 둘러보기</h1>
          <p className="text-gray-600">다양한 분야의 전문 큐레이터들을 만나보세요</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="큐레이터, 전문분야 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            {/* Specialty Filter */}
            <div className="flex flex-wrap gap-2">
              {SPECIALTIES.map(specialty => (
                <button
                  key={specialty}
                  onClick={() => setSelectedSpecialty(specialty)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedSpecialty === specialty
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm pr-8"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>

            {/* Pagination Mode Toggle */}
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setIsInfiniteScroll(false)}
                className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
                  !isInfiniteScroll ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                페이지네이션
              </button>
              <button
                onClick={() => setIsInfiniteScroll(true)}
                className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
                  isInfiniteScroll ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                무한스크롤
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            총 <span className="font-semibold text-gray-900">{filteredCurators.length}</span>명의 큐레이터
            {searchQuery && (
              <span> | 검색어: <span className="font-semibold">"{searchQuery}"</span></span>
            )}
          </p>
        </div>

        {/* Curator Grid */}
        {displayedCurators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {displayedCurators.map((curator, index) => (
              <div
                key={curator.id}
                ref={index === displayedCurators.length - 1 ? lastCuratorElementRef : null}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-6 text-center">
                  {/* Avatar with verification badge */}
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <img
                      src={curator.avatar}
                      alt={curator.name}
                      className="w-full h-full rounded-full object-cover object-top"
                    />
                    {curator.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <i className="ri-check-line text-white text-xs"></i>
                      </div>
                    )}
                  </div>

                  {/* Name and Location */}
                  <Link 
                    to={`/curator/${curator.id}`}
                    className="block hover:text-blue-600 transition-colors"
                  >
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      {curator.name}
                    </h4>
                  </Link>
                  <p className="text-xs text-gray-500 mb-3">{curator.location}</p>

                  {/* Bio */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {curator.bio}
                  </p>

                  {/* Specialties */}
                  <div className="flex flex-wrap justify-center gap-1 mb-4">
                    {curator.specialties.slice(0, 2).map(specialty => (
                      <span
                        key={specialty}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                    {curator.specialties.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{curator.specialties.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {curator.followers.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">팔로워</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {curator.curations}
                      </div>
                      <div className="text-xs text-gray-500">큐레이션</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-blue-600">
                        {curator.likes.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">좋아요</div>
                    </div>
                  </div>

                  {/* Follow Button */}
                  <button
                    onClick={() => toggleFollow(curator.id)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap text-sm ${
                      curator.isFollowing
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {curator.isFollowing ? '팔로잉' : '팔로우'}
                  </button>

                  {/* Join Date */}
                  <p className="text-xs text-gray-400 mt-3">
                    {new Date(curator.joinedDate).getFullYear()}년 가입
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <i className="ri-user-search-line text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-600 mb-4">다른 검색어나 전문분야를 시도해보세요</p>
            <button
              onClick={() => {
                setSelectedSpecialty('전체');
                setSearchQuery('');
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              필터 초기화
            </button>
          </div>
        )}

        {/* Pagination */}
        {!isInfiniteScroll && filteredCurators.length > 0 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <i className="ri-arrow-left-line"></i>
              이전
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-10 h-10 rounded-lg ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              다음
              <i className="ri-arrow-right-line"></i>
            </button>
          </div>
        )}

        {/* Infinite Scroll Loading */}
        {isInfiniteScroll && loading && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              더 많은 큐레이터를 불러오는 중...
            </div>
          </div>
        )}

        {/* No More Items */}
        {isInfiniteScroll && !hasMore && displayedCurators.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">모든 큐레이터를 확인했습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
