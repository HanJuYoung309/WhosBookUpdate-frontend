
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

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

const CATEGORIES = [
  { id: 'all', name: '전체', count: 127 },
  { id: 'novel', name: '소설', count: 32 },
  { id: 'essay', name: '에세이', count: 24 },
  { id: 'self-development', name: '자기계발', count: 18 },
  { id: 'business', name: '비즈니스', count: 15 },
  { id: 'history', name: '역사', count: 12 },
  { id: 'philosophy', name: '철학', count: 9 },
  { id: 'science', name: '과학', count: 10 },
  { id: 'art', name: '예술', count: 7 }
];

const SORT_OPTIONS = [
  { id: 'popular', name: '인기순' },
  { id: 'latest', name: '최신순' },
  { id: 'likes', name: '좋아요순' },
  { id: 'oldest', name: '오래된순' }
];

const TAGS = [
  '베스트셀러', '추천도서', '신간', '고전', '화제작', '장편', '단편', 
  '실용서', '인문학', '심리학', '경제', '투자', '창업', '리더십',
  '한국사', '세계사', '철학입문', '현대철학', '물리학', '생물학',
  '미술', '음악', '영화', '문학', '시집'
];

const mockCurators: Curator[] = [
  {
    id: '1',
    name: '김서현',
    avatar: 'https://readdy.ai/api/search-image?query=professional%20female%20book%20curator%20profile%20photo%2C%20friendly%20smile%2C%20warm%20lighting%2C%20studio%20portrait%2C%20modern%20aesthetic%2C%20clean%20background&width=60&height=60&seq=curator1&orientation=squarish',
    followersCount: 1247
  },
  {
    id: '2', 
    name: '이준호',
    avatar: 'https://readdy.ai/api/search-image?query=professional%20male%20book%20curator%20profile%20photo%2C%20intellectual%20look%2C%20glasses%2C%20warm%20lighting%2C%20studio%20portrait%2C%20modern%20aesthetic%2C%20clean%20background&width=60&height=60&seq=curator2&orientation=squarish',
    followersCount: 892
  },
  {
    id: '3',
    name: '박미영',
    avatar: 'https://readdy.ai/api/search-image?query=professional%20female%20librarian%20profile%20photo%2C%20kind%20expression%2C%20natural%20lighting%2C%20studio%20portrait%2C%20modern%20aesthetic%2C%20clean%20background&width=60&height=60&seq=curator3&orientation=squarish',
    followersCount: 2156
  },
  {
    id: '4',
    name: '정현우',
    avatar: 'https://readdy.ai/api/search-image?query=young%20male%20book%20enthusiast%20profile%20photo%2C%20casual%20style%2C%20friendly%20smile%2C%20natural%20lighting%2C%20studio%20portrait%2C%20modern%20aesthetic%2C%20clean%20background&width=60&height=60&seq=curator4&orientation=squarish',
    followersCount: 634
  }
];

const generateMockCurations = (count: number): Curation[] => {
  const curations: Curation[] = [];
  const categories = ['novel', 'essay', 'self-development', 'business', 'history', 'philosophy', 'science', 'art'];
  
  for (let i = 1; i <= count; i++) {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomCurator = mockCurators[Math.floor(Math.random() * mockCurators.length)];
    const randomTags = TAGS.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 1);
    
    curations.push({
      id: i.toString(),
      title: getCurationTitle(randomCategory, i),
      description: getCurationDescription(randomCategory, i),
      curator: randomCurator,
      books: generateMockBooks(Math.floor(Math.random() * 3) + 3),
      tags: randomTags,
      category: randomCategory,
      likes: Math.floor(Math.random() * 500) + 10,
      createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      isLiked: Math.random() > 0.7
    });
  }
  
  return curations;
};

const getCurationTitle = (category: string, index: number): string => {
  const titles = {
    novel: [
      '마음을 울리는 현대 소설 5선',
      '밤을 새며 읽은 추리소설들',
      '삶의 의미를 찾게 해준 문학작품',
      '첫사랑의 아픔을 그린 소설들',
      '현실을 잊게 해주는 판타지 소설'
    ],
    essay: [
      '일상의 소중함을 깨닫게 해준 에세이',
      '혼자만의 시간을 위한 글들',
      '여행을 떠나고 싶게 만드는 에세이',
      '마음이 편안해지는 글 모음',
      '삶의 지혜가 담긴 에세이집'
    ],
    'self-development': [
      '20대가 읽어야 할 자기계발서',
      '습관의 힘을 알려주는 책들',
      '성공한 사람들의 독서법',
      '목표 달성을 위한 필독서',
      '자신감을 기르는 책 추천'
    ],
    business: [
      '스타트업 창업자가 추천하는 책',
      '비즈니스 전략을 배울 수 있는 도서',
      '경영학 입문을 위한 추천도서',
      '투자 초보자를 위한 필독서',
      '마케팅 실무진이 읽는 책들'
    ],
    history: [
      '한국사를 재미있게 배우는 책',
      '세계사의 전환점을 다룬 도서',
      '역사 속 인물들의 이야기',
      '근현대사 이해를 위한 추천도서',
      '역사를 통해 배우는 리더십'
    ],
    philosophy: [
      '철학 입문자를 위한 추천도서',
      '현대인의 고민을 다룬 철학서',
      '동양철학의 지혜를 담은 책',
      '삶의 의미를 찾는 철학 여행',
      '일상 속 철학적 사유를 위한 책'
    ],
    science: [
      '과학의 재미를 알려주는 책',
      '우주와 물리학 입문서',
      '생명과학의 신비를 다룬 도서',
      '과학사를 통해 본 인류의 발전',
      '미래 기술을 예측하는 과학서'
    ],
    art: [
      '예술사 입문을 위한 추천도서',
      '미술관에서 읽고 싶은 책',
      '음악의 역사와 감상법',
      '예술가들의 삶과 작품 이야기',
      '현대 예술을 이해하는 가이드'
    ]
  };
  
  const categoryTitles = titles[category as keyof typeof titles] || titles.novel;
  return categoryTitles[index % categoryTitles.length];
};

const getCurationDescription = (category: string, index: number): string => {
  const descriptions = {
    novel: [
      '감정의 깊이를 탐구하는 현대 소설들을 엄선했습니다. 각각의 작품이 전하는 메시지와 문학적 완성도를 고려하여 선별했습니다.',
      '잠 못 드는 밤, 한 번 펼치면 끝까지 읽게 되는 매력적인 추리소설들입니다. 예측할 수 없는 반전과 탄탄한 구성이 특징입니다.',
      '인생의 의미와 가치에 대해 깊이 있게 탐구한 문학작품들을 모았습니다. 독자들에게 새로운 관점을 제시하는 책들입니다.',
      '첫사랑의 설렘과 아픔을 섬세하게 그려낸 소설들입니다. 누구나 공감할 수 있는 감정의 이야기를 담고 있습니다.',
      '현실의 무게에서 잠시 벗어나 상상의 나래를 펼칠 수 있는 판타지 소설들을 추천합니다.'
    ],
    essay: [
      '바쁜 일상 속에서 놓치기 쉬운 소소한 행복들을 발견하게 해주는 에세이들입니다. 작가들의 따뜻한 시선이 담겨 있습니다.',
      '혼자만의 시간을 더욱 의미 있게 만들어주는 글들을 선별했습니다. 자신과의 대화를 위한 시간을 선사합니다.',
      '세계 각지의 여행 경험담과 문화에 대한 깊이 있는 관찰을 담은 에세이들입니다. 책 속에서 여행을 떠나보세요.',
      '마음이 지칠 때 위로가 되고, 평온함을 찾게 해주는 글들을 모았습니다. 치유의 시간을 선사합니다.',
      '인생의 선배들이 전하는 지혜로운 조언과 통찰이 담긴 에세이집들입니다.'
    ]
  };
  
  const categoryDescriptions = descriptions[category as keyof typeof descriptions] || descriptions.novel;
  return categoryDescriptions[index % categoryDescriptions.length];
};

const generateMockBooks = (count: number): Book[] => {
  const bookTitles = [
    '완전한 행복', '시간의 향기', '마지막 편지', '바람의 노래', '별이 빛나는 밤',
    '고요한 아침', '푸른 하늘', '따뜻한 봄날', '차가운 겨울', '뜨거운 여름',
    '깊은 바다', '높은 산', '넓은 들판', '작은 마을', '큰 도시',
    '빨간 장미', '하얀 눈', '검은 밤', '노란 해바라기', '보라색 꿈'
  ];
  
  const authors = [
    '김민수', '이지영', '박서준', '최유진', '정현아',
    '강도윤', '윤서영', '임재현', '조민정', '한지우',
    '송예은', '배민석', '노하늘', '오세진', '양수빈'
  ];
  
  const books: Book[] = [];
  for (let i = 0; i < count; i++) {
    const randomTitle = bookTitles[Math.floor(Math.random() * bookTitles.length)];
    const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
    
    books.push({
      id: `book-${Date.now()}-${i}`,
      title: randomTitle,
      author: randomAuthor,
      cover: `https://readdy.ai/api/search-image?query=beautiful%20book%20cover%20design%2C%20$%7BrandomTitle.toLowerCase%28%29%7D%20theme%2C%20modern%20typography%2C%20elegant%20layout%2C%20professional%20publishing%20design%2C%20clean%20aesthetic&width=120&height=180&seq=book${Date.now()}${i}&orientation=portrait`
    });
  }
  
  return books;
};

const ITEMS_PER_PAGE = 12;

export default function CurationListPage() {
  const [curations, setCurations] = useState<Curation[]>([]);
  const [displayedCurations, setDisplayedCurations] = useState<Curation[]>([]);
  const [filteredCurations, setFilteredCurations] = useState<Curation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('popular');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCurators, setSelectedCurators] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isInfiniteScroll, setIsInfiniteScroll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const observer = useRef<IntersectionObserver>();
  
  const lastCurationElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && isInfiniteScroll) {
        loadMoreCurations();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, isInfiniteScroll]);

  useEffect(() => {
    const mockData = generateMockCurations(80);
    setCurations(mockData);
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [curations, selectedCategory, selectedSort, selectedTags, selectedCurators, searchQuery]);

  useEffect(() => {
    if (isInfiniteScroll) {
      setDisplayedCurations(filteredCurations.slice(0, ITEMS_PER_PAGE));
      setCurrentPage(1);
      setHasMore(filteredCurations.length > ITEMS_PER_PAGE);
    } else {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      setDisplayedCurations(filteredCurations.slice(startIndex, endIndex));
    }
  }, [filteredCurations, currentPage, isInfiniteScroll]);

  const applyFiltersAndSort = () => {
    let filtered = [...curations];

    // 카테고리 필터
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(curation => curation.category === selectedCategory);
    }

    // 검색 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(curation => 
        curation.title.toLowerCase().includes(query) ||
        curation.description.toLowerCase().includes(query) ||
        curation.curator.name.toLowerCase().includes(query) ||
        curation.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // 태그 필터
    if (selectedTags.length > 0) {
      filtered = filtered.filter(curation =>
        selectedTags.every(tag => curation.tags.includes(tag))
      );
    }

    // 큐레이터 필터
    if (selectedCurators.length > 0) {
      filtered = filtered.filter(curation =>
        selectedCurators.includes(curation.curator.id)
      );
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (selectedSort) {
        case 'latest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'likes':
          return b.likes - a.likes;
        case 'popular':
        default:
          return (b.likes + Math.random() * 100) - (a.likes + Math.random() * 100);
      }
    });

    setFilteredCurations(filtered);
    setCurrentPage(1);
  };

  const loadMoreCurations = () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    setTimeout(() => {
      const nextPageStart = displayedCurations.length;
      const nextPageEnd = nextPageStart + ITEMS_PER_PAGE;
      const nextItems = filteredCurations.slice(nextPageStart, nextPageEnd);
      
      if (nextItems.length > 0) {
        setDisplayedCurations(prev => [...prev, ...nextItems]);
        setHasMore(nextPageEnd < filteredCurations.length);
      } else {
        setHasMore(false);
      }
      setLoading(false);
    }, 500);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleCurator = (curatorId: string) => {
    setSelectedCurators(prev =>
      prev.includes(curatorId)
        ? prev.filter(id => id !== curatorId)
        : [...prev, curatorId]
    );
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedTags([]);
    setSelectedCurators([]);
    setSearchQuery('');
  };

  const totalPages = Math.ceil(filteredCurations.length / ITEMS_PER_PAGE);

  const toggleLike = (curationId: string) => {
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
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
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
                  {category.name} ({category.id === 'all' ? filteredCurations.length : category.count})
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

        {/* Advanced Filters */}
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
                {mockCurators.map(curator => (
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
            총 <span className="font-semibold text-gray-900">{filteredCurations.length}</span>개의 큐레이션
            {searchQuery && (
              <span> | 검색어: <span className="font-semibold">"{searchQuery}"</span></span>
            )}
          </p>
        </div>

        {/* Curation Grid */}
        {displayedCurations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {displayedCurations.map((curation, index) => (
              <div
                key={curation.id}
                ref={index === displayedCurations.length - 1 ? lastCurationElementRef : null}
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
        ) : (
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
        )}

        {/* Pagination */}
        {!isInfiniteScroll && filteredCurations.length > 0 && (
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
              더 많은 큐레이션을 불러오는 중...
            </div>
          </div>
        )}

        {/* No More Items */}
        {isInfiniteScroll && !hasMore && displayedCurations.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">모든 큐레이션을 확인했습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
