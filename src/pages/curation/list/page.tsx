import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

// 실제 데이터 구조에 맞게 인터페이스를 유지하거나 수정합니다.
interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
}

interface Curator {
  id: string;
  name: string;
  avatar: string;
  followersCount: number;
}

interface Curation {
  id: string;
  title: string;
  description: string;
  curator: Curator;
  books: Book[];
  tags: string[];
  category: string;
  likes: number;
  createdAt: string;
  isLiked: boolean;
}

// API 응답에 페이지 정보가 포함될 경우를 대비한 인터페이스
interface ApiPaginatedResponse<T> {
  data: T[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
  hasMore: boolean;
}

// API를 통해 받아올 데이터들 (임시로 비워둠)
const CATEGORIES: { id: string, name: string }[] = [
  // 예시: { id: 'all', name: '전체' }
  // 이 부분은 API를 통해 동적으로 채워야 합니다.
];
const TAGS: string[] = [
  // 이 부분도 API를 통해 동적으로 채울 수 있습니다.
];
const MOCK_CURATORS: Curator[] = [
    // 이 부분도 API를 통해 동적으로 채울 수 있습니다.
];

const SORT_OPTIONS = [
  { id: 'popular', name: '인기순' },
  { id: 'latest', name: '최신순' },
  { id: 'likes', name: '좋아요순' },
  { id: 'oldest', name: '오래된순' }
];

const ITEMS_PER_PAGE = 12;

// --- API 호출 시뮬레이션 함수 ---
// 실제 백엔드 API로 이 함수를 교체해야 합니다.
const fetchCurations = async (
  page: number,
  category: string,
  sort: string,
  tags: string[],
  curators: string[],
  query: string
): Promise<ApiPaginatedResponse<Curation>> => {
  console.log('Fetching data with params:', { page, category, sort, tags, curators, query });
  
  // 여기에 실제 API 호출 로직을 구현합니다. (예: axios.get, fetch)
  // const response = await axios.get('/api/curations', { 
  //   params: { page, limit: ITEMS_PER_PAGE, category, sort, tags, curators, q: query } 
  // });
  // return response.data;

  // --- 아래는 API 호출을 시뮬레이션하는 예시 코드입니다. ---
  return new Promise(resolve => {
    setTimeout(() => {
      // 실제로는 API 응답 데이터를 반환합니다.
      // 지금은 빈 배열과 기본 페이지 정보를 반환합니다.
      resolve({
        data: [], // response.data.curations
        totalPages: 0, // response.data.totalPages
        totalCount: 0, // response.data.totalCount
        currentPage: page, // response.data.currentPage
        hasMore: false, // response.data.hasMore
      });
    }, 1000); // 1초 딜레이
  });
};
// --- API 호출 함수 끝 ---


export default function CurationListPage() {
  const [curations, setCurations] = useState<Curation[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('popular');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCurators, setSelectedCurators] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  
  const [isInfiniteScroll, setIsInfiniteScroll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const observer = useRef<IntersectionObserver>();
  
  const lastCurationElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && isInfiniteScroll) {
        setCurrentPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, isInfiniteScroll]);

  // 데이터 로드 로직
  const loadCurations = useCallback(async (page: number, isLoadMore = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchCurations(
        page,
        selectedCategory,
        selectedSort,
        selectedTags,
        selectedCurators,
        searchQuery
      );
      
      if (isLoadMore) {
        setCurations(prev => [...prev, ...response.data]);
      } else {
        setCurations(response.data);
      }
      
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
      setHasMore(response.hasMore);

    } catch (err) {
      setError('데이터를 불러오는 데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedSort, selectedTags, selectedCurators, searchQuery]);

  // 필터, 정렬, 검색어 변경 시 첫 페이지부터 다시 로드
  useEffect(() => {
    setCurrentPage(1);
    setCurations([]); // 기존 목록 초기화
    loadCurations(1);
  }, [selectedCategory, selectedSort, selectedTags, selectedCurators, searchQuery]);

  // 페이지 변경(페이지네이션, 무한스크롤) 시 데이터 로드
  useEffect(() => {
    if (currentPage > 1) {
      loadCurations(currentPage, isInfiniteScroll);
    }
  }, [currentPage, isInfiniteScroll, loadCurations]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleCurator = (curatorId: string) => {
    setSelectedCurators(prev =>
      prev.includes(curatorId) ? prev.filter(id => id !== curatorId) : [...prev, curatorId]
    );
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedTags([]);
    setSelectedCurators([]);
    setSearchQuery('');
    setSelectedSort('popular');
  };

  // '좋아요' 토글 함수 (API 연동 필요)
  const toggleLike = async (curationId: string) => {
    // Optimistic UI Update
    const originalCurations = [...curations];
    setCurations(prev =>
      prev.map(curation => {
        if (curation.id === curationId) {
          return {
            ...curation,
            isLiked: !curation.isLiked,
            likes: curation.isLiked ? curation.likes - 1 : curation.likes + 1
          };
        }
        return curation;
      })
    );

    try {
      // 실제 API 호출 로직
      // await api.post(`/curations/${curationId}/like`);
    } catch (error) {
      console.error('Like toggle failed:', error);
      // 실패 시 원래 상태로 복원
      setCurations(originalCurations);
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
              BookCuration
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/auth/login" className="text-gray-600 hover:text-gray-900">로그인</Link>
              <Link to="/auth/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                회원가입
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">큐레이션 둘러보기</h1>
          <p className="text-gray-600">다양한 주제의 책 큐레이션을 발견해보세요</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="큐레이션, 큐레이터, 태그 검색..."
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
            {/* Category Filter (API로 동적 렌더링 필요) */}
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
              >
                전체
              </button>
              {CATEGORIES.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              <i className="ri-filter-line"></i>
              상세 필터
              {(selectedTags.length > 0 || selectedCurators.length > 0) && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {selectedTags.length + selectedCurators.length}
                </span>
              )}
            </button>

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

        {/* Advanced Filters (API로 동적 렌더링 필요) */}
        {showFilters && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">상세 필터</h3>
              <button
                onClick={resetFilters}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                필터 초기화
              </button>
            </div>

            {/* Tag Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">태그</h4>
              <div className="flex flex-wrap gap-2">
                {TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Curator Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">큐레이터</h4>
              <div className="flex flex-wrap gap-3">
                {MOCK_CURATORS.map(curator => (
                  <button
                    key={curator.id}
                    onClick={() => toggleCurator(curator.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCurators.includes(curator.id)
                        ? 'bg-blue-50 border-2 border-blue-600 text-blue-700'
                        : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <img
                      src={curator.avatar}
                      alt={curator.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span>{curator.name}</span>
                    <span className="text-xs text-gray-500">({curator.followersCount})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            총 <span className="font-semibold text-gray-900">{totalCount}</span>개의 큐레이션
            {searchQuery && (
              <span> | 검색어: <span className="font-semibold">"{searchQuery}"</span></span>
            )}
          </p>
        </div>

        {/* 로딩 및 에러 상태 표시 */}
        {loading && curations.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              큐레이션을 불러오는 중...
            </div>
          </div>
        )}
        {error && (
            <div className="text-center py-12 text-red-500">
                <i className="ri-error-warning-line text-4xl mb-4"></i>
                <p>{error}</p>
            </div>
        )}

        {/* Curation Grid */}
        {!loading && curations.length === 0 && !error ? (
          <div className="text-center py-12">
            <i className="ri-search-line text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-600 mb-4">다른 검색어나 필터를 시도해보세요</p>
            <button
              onClick={resetFilters}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              필터 초기화
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {curations.map((curation, index) => (
              <div
                key={`${curation.id}-${index}`}
                ref={index === curations.length - 1 ? lastCurationElementRef : null}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                 {/* Book Covers */}
                 <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                  <div className="flex items-center justify-center h-full">
                    <div className="flex gap-2">
                      {curation.books.slice(0, 3).map((book, bookIndex) => (
                        <div
                          key={book.id}
                          className={`bg-white rounded shadow-sm ${
                            bookIndex === 1 ? 'transform -translate-y-2 z-10' : 'z-0'
                          }`}
                          style={{
                            width: '60px',
                            height: '90px',
                            backgroundImage: `url(${book.cover})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        />
                      ))}
                    </div>
                    {curation.books.length > 3 && (
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        +{curation.books.length - 3}
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={curation.curator.avatar}
                      alt={curation.curator.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{curation.curator.name}</p>
                      <p className="text-xs text-gray-500">팔로워 {curation.curator.followersCount.toLocaleString()}</p>
                    </div>
                  </div>

                  <Link 
                    to={`/curation/${curation.id}`}
                    className="block mb-3 hover:text-blue-600"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{curation.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{curation.description}</p>
                  </Link>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {curation.tags.slice(0, 2).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                    {curation.tags.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{curation.tags.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleLike(curation.id)}
                      className={`flex items-center gap-1 text-sm ${
                        curation.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <i className={`${curation.isLiked ? 'ri-heart-fill' : 'ri-heart-line'}`}></i>
                      {curation.likes}
                    </button>
                    <span className="text-xs text-gray-400">
                      {new Date(curation.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {!isInfiniteScroll && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || loading}
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <i className="ri-arrow-left-line"></i>
              이전
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    disabled={loading}
                    className={`w-10 h-10 rounded-lg ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || loading}
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              다음
              <i className="ri-arrow-right-line"></i>
            </button>
          </div>
        )}

        {/* Infinite Scroll Loading */}
        {isInfiniteScroll && loading && curations.length > 0 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              더 많은 큐레이션을 불러오는 중...
            </div>
          </div>
        )}

        {/* No More Items */}
        {isInfiniteScroll && !hasMore && curations.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">모든 큐레이션을 확인했습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}