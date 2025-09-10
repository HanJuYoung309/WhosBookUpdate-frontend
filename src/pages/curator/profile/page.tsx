
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
}

interface Curation {
  id: string;
  title: string;
  description: string;
  books: Book[];
  tags: string[];
  likes: number;
  comments: number;
  createdAt: string;
  isLiked: boolean;
  coverImage: string;
}

interface CuratorProfile {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  backgroundImage: string;
  followers: number;
  following: number;
  curations: number;
  totalLikes: number;
  isFollowing: boolean;
  joinedDate: string;
  specialties: string[];
  location: string;
  website?: string;
  social: {
    instagram?: string;
    twitter?: string;
    blog?: string;
  };
}

const SORT_OPTIONS = [
  { id: 'latest', name: '최신순' },
  { id: 'popular', name: '인기순' },
  { id: 'likes', name: '좋아요순' }
];

export default function CuratorProfile() {
  const { id } = useParams();
  const [curator, setCurator] = useState<CuratorProfile | null>(null);
  const [curations, setCurations] = useState<Curation[]>([]);
  const [selectedSort, setSelectedSort] = useState('latest');
  const [activeTab, setActiveTab] = useState<'curations' | 'about'>('curations');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app would fetch from API
    const mockCurator: CuratorProfile = {
      id: id || '1',
      name: '김독서',
      bio: '문학과 철학을 사랑하는 독서광입니다. 15년간 다양한 장르의 책을 읽으며 독자들에게 좋은 책을 추천하고 있습니다. 특히 힐링 도서와 현대 소설에 관심이 많으며, 책을 통해 사람들이 위로받고 성장할 수 있기를 바랍니다.',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20Korean%20book%20curator%2C%20warm%20smile%2C%20holding%20books%2C%20cozy%20library%20background%2C%20soft%20lighting%2C%20portrait%20photography%20style%2C%20friendly%20and%20intellectual%20appearance&width=150&height=150&seq=curator1&orientation=squarish',
      backgroundImage: 'https://readdy.ai/api/search-image?query=Cozy%20library%20background%20with%20warm%20lighting%2C%20books%20on%20shelves%2C%20reading%20chair%2C%20plants%2C%20soft%20natural%20light%20streaming%20through%20window%2C%20peaceful%20atmosphere%2C%20literary%20aesthetic&width=1200&height=300&seq=library1&orientation=landscape',
      followers: 15420,
      following: 342,
      curations: 45,
      totalLikes: 89320,
      isFollowing: false,
      joinedDate: '2021-03-15',
      specialties: ['문학', '철학', '에세이', '힐링도서', '현대소설'],
      location: '서울, 대한민국',
      website: 'https://kimreader.blog',
      social: {
        instagram: '@kim_reader',
        blog: 'kimreader.blog'
      }
    };

    const mockCurations: Curation[] = [
      {
        id: '1',
        title: '마음을 치유하는 힐링 도서 10선',
        description: '일상에 지친 마음을 달래주는 따뜻한 책들을 소개합니다. 에세이부터 소설까지 다양한 장르의 힐링 도서를 만나보세요.',
        books: [
          {
            id: '1',
            title: '미드나잇 라이브러리',
            author: '매트 헤이그',
            cover: 'https://readdy.ai/api/search-image?query=Midnight%20Library%20book%20cover%2C%20mystical%20library%20setting%2C%20glowing%20books%2C%20ethereal%20atmosphere%2C%20purple%20and%20blue%20tones%2C%20fantasy%20book%20cover%20design&width=80&height=120&seq=book1&orientation=portrait'
          },
          {
            id: '2',
            title: '아몬드',
            author: '손원평',
            cover: 'https://readdy.ai/api/search-image?query=Korean%20novel%20Almond%20book%20cover%2C%20minimalist%20design%2C%20warm%20colors%2C%20young%20adult%20fiction%2C%20contemporary%20Korean%20literature%20cover&width=80&height=120&seq=book2&orientation=portrait'
          },
          {
            id: '3',
            title: '언어의 온도',
            author: '이기주',
            cover: 'https://readdy.ai/api/search-image?query=Korean%20essay%20book%20cover%20about%20language%20and%20warmth%2C%20minimalist%20typography%2C%20soft%20warm%20colors%2C%20literary%20design%2C%20elegant%20book%20cover&width=80&height=120&seq=book3&orientation=portrait'
          }
        ],
        tags: ['힐링', '에세이', '소설', '마음치유'],
        likes: 2847,
        comments: 156,
        createdAt: '2024-01-15',
        isLiked: false,
        coverImage: 'https://readdy.ai/api/search-image?query=Peaceful%20healing%20books%20collection%2C%20soft%20pastel%20colors%2C%20cozy%20reading%20nook%20with%20tea%2C%20warm%20sunlight%2C%20serene%20atmosphere%2C%20minimalist%20composition%20with%20books%20and%20plants&width=300&height=200&seq=curation1&orientation=landscape'
      },
      {
        id: '2',
        title: '겨울밤에 읽기 좋은 추리소설',
        description: '추운 겨울밤, 담요를 덮고 읽기 좋은 스릴 넘치는 추리소설들을 모았습니다.',
        books: [
          {
            id: '4',
            title: '셜록 홈즈 전집',
            author: '아서 코난 도일',
            cover: 'https://readdy.ai/api/search-image?query=Sherlock%20Holmes%20book%20cover%2C%20classic%20detective%20fiction%2C%20Victorian%20era%20atmosphere%2C%20mystery%20and%20intrigue%2C%20elegant%20typography&width=80&height=120&seq=book4&orientation=portrait'
          },
          {
            id: '5',
            title: '살인자의 기억법',
            author: '김영하',
            cover: 'https://readdy.ai/api/search-image?query=Korean%20thriller%20novel%20cover%2C%20dark%20atmospheric%20design%2C%20psychological%20suspense%2C%20modern%20Korean%20literature%2C%20noir%20aesthetic&width=80&height=120&seq=book5&orientation=portrait'
          }
        ],
        tags: ['추리소설', '미스터리', '겨울', '스릴러'],
        likes: 1823,
        comments: 89,
        createdAt: '2024-01-08',
        isLiked: true,
        coverImage: 'https://readdy.ai/api/search-image?query=Mystery%20detective%20books%20collection%2C%20dark%20moody%20atmosphere%2C%20winter%20evening%20setting%2C%20fireplace%20background%2C%20cozy%20reading%20corner%2C%20noir%20style%20lighting&width=300&height=200&seq=curation2&orientation=landscape'
      },
      {
        id: '3',
        title: '인생을 바꾼 철학서 추천',
        description: '깊이 있는 사유와 통찰을 선사하는 철학서들을 엄선했습니다. 삶의 의미를 찾고 있는 분들께 추천합니다.',
        books: [
          {
            id: '6',
            title: '니체의 차라투스트라는 이렇게 말했다',
            author: '프리드리히 니체',
            cover: 'https://readdy.ai/api/search-image?query=Nietzsche%20philosophy%20book%20cover%2C%20classic%20philosophical%20work%2C%20deep%20thought%20concept%2C%20intellectual%20design%2C%20profound%20wisdom%20aesthetic&width=80&height=120&seq=book6&orientation=portrait'
          },
          {
            id: '7',
            title: '존재와 시간',
            author: '마르틴 하이데거',
            cover: 'https://readdy.ai/api/search-image?query=Heidegger%20Being%20and%20Time%20book%20cover%2C%20existential%20philosophy%2C%20academic%20design%2C%20contemplative%20atmosphere%2C%20scholarly%20aesthetic&width=80&height=120&seq=book7&orientation=portrait'
          }
        ],
        tags: ['철학', '인문학', '사유', '성찰'],
        likes: 1456,
        comments: 67,
        createdAt: '2024-01-02',
        isLiked: false,
        coverImage: 'https://readdy.ai/api/search-image?query=Philosophy%20books%20collection%2C%20contemplative%20atmosphere%2C%20ancient%20wisdom%20meets%20modern%20thought%2C%20scholarly%20setting%2C%20deep%20thinking%20concept&width=300&height=200&seq=curation3&orientation=landscape'
      },
      {
        id: '4',
        title: '봄날의 감성을 담은 에세이',
        description: '따뜻한 봄날의 감성을 담은 에세이들로, 일상 속 소소한 행복을 발견할 수 있는 글들을 모았습니다.',
        books: [
          {
            id: '8',
            title: '봄날은 간다',
            author: '김훈',
            cover: 'https://readdy.ai/api/search-image?query=Korean%20spring%20essay%20book%20cover%2C%20gentle%20pastel%20colors%2C%20nature%20themes%2C%20warm%20sunlight%2C%20peaceful%20atmosphere%2C%20literary%20elegance&width=80&height=120&seq=book8&orientation=portrait'
          }
        ],
        tags: ['에세이', '봄', '감성', '일상'],
        likes: 1234,
        comments: 45,
        createdAt: '2024-02-20',
        isLiked: false,
        coverImage: 'https://readdy.ai/api/search-image?query=Spring%20essay%20books%2C%20cherry%20blossom%20petals%2C%20warm%20afternoon%20light%2C%20cozy%20reading%20corner%2C%20gentle%20emotions%2C%20seasonal%20beauty&width=300&height=200&seq=curation4&orientation=landscape'
      },
      {
        id: '5',
        title: '현대 여성 작가들의 목소리',
        description: '현대 사회를 살아가는 여성들의 다양한 이야기와 관점을 담은 작품들을 소개합니다.',
        books: [
          {
            id: '9',
            title: '김지영, 82년생',
            author: '조남주',
            cover: 'https://readdy.ai/api/search-image?query=Kim%20Ji-young%20Born%201982%20Korean%20novel%20cover%2C%20contemporary%20women%20fiction%2C%20social%20issues%2C%20modern%20design%2C%20feminist%20literature&width=80&height=120&seq=book9&orientation=portrait'
          }
        ],
        tags: ['여성문학', '현대소설', '사회', '여성'],
        likes: 987,
        comments: 78,
        createdAt: '2024-02-10',
        isLiked: true,
        coverImage: 'https://readdy.ai/api/search-image?query=Contemporary%20women%20literature%20collection%2C%20empowering%20female%20voices%2C%20modern%20social%20themes%2C%20diverse%20perspectives%2C%20literary%20strength&width=300&height=200&seq=curation5&orientation=landscape'
      }
    ];

    setCurator(mockCurator);
    setCurations(mockCurations);
    setLoading(false);
  }, [id]);

  const handleFollow = () => {
    if (curator) {
      setCurator({
        ...curator,
        isFollowing: !curator.isFollowing,
        followers: curator.isFollowing ? curator.followers - 1 : curator.followers + 1
      });
    }
  };

  const toggleCurationLike = (curationId: string) => {
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

  const sortedCurations = [...curations].sort((a, b) => {
    switch (selectedSort) {
      case 'popular':
        return (b.likes + b.comments) - (a.likes + a.comments);
      case 'likes':
        return b.likes - a.likes;
      case 'latest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  if (loading || !curator) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">프로필을 불러오는 중...</p>
        </div>
      </div>
    );
  }

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
                to="/"
                className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                홈으로
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <div className="relative">
        {/* Background Image */}
        <div 
          className="h-80 bg-gradient-to-br from-blue-100 to-purple-100 bg-cover bg-center"
          style={{ backgroundImage: `url(${curator.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        {/* Profile Info */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-20 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6">
              <img
                src={curator.avatar}
                alt={curator.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover object-top bg-white"
              />
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">{curator.name}</h1>
                <p className="text-white text-opacity-90 mb-4 max-w-md">
                  {curator.bio.split('.')[0]}.
                </p>
                <div className="flex items-center justify-center md:justify-start space-x-6 text-white text-opacity-90">
                  <div className="text-center">
                    <div className="font-semibold">{curator.followers.toLocaleString()}</div>
                    <div className="text-sm">팔로워</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{curator.following.toLocaleString()}</div>
                    <div className="text-sm">팔로잉</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{curator.curations}</div>
                    <div className="text-sm">큐레이션</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{curator.totalLikes.toLocaleString()}</div>
                    <div className="text-sm">좋아요</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-auto">
              <button
                onClick={handleFollow}
                className={`px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  curator.isFollowing
                    ? 'bg-white text-blue-600 hover:bg-gray-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {curator.isFollowing ? '팔로잉' : '팔로우'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex bg-white rounded-lg border p-1">
                <button
                  onClick={() => setActiveTab('curations')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'curations'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  큐레이션 ({curator.curations})
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'about'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  소개
                </button>
              </div>

              {/* Sort Options (only for curations tab) */}
              {activeTab === 'curations' && (
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm pr-8"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Tab Content */}
            {activeTab === 'curations' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedCurations.map((curation) => (
                  <div key={curation.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                    {/* Cover Image */}
                    <div className="aspect-[3/2] bg-gradient-to-br from-blue-50 to-indigo-100">
                      <img
                        src={curation.coverImage}
                        alt={curation.title}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <Link 
                        to={`/curation/${curation.id}`}
                        className="block mb-3 hover:text-blue-600"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{curation.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{curation.description}</p>
                      </Link>

                      {/* Books Preview */}
                      <div className="flex items-center mb-3 -space-x-2">
                        {curation.books.slice(0, 3).map((book, index) => (
                          <img
                            key={book.id}
                            src={book.cover}
                            alt={book.title}
                            className="w-8 h-12 object-cover object-top rounded border-2 border-white shadow-sm"
                            style={{ zIndex: 10 - index }}
                          />
                        ))}
                        {curation.books.length > 3 && (
                          <div className="w-8 h-12 bg-gray-200 border-2 border-white rounded flex items-center justify-center text-xs text-gray-600 font-medium">
                            +{curation.books.length - 3}
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {curation.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => toggleCurationLike(curation.id)}
                            className={`flex items-center space-x-1 text-sm cursor-pointer whitespace-nowrap ${
                              curation.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                            }`}
                          >
                            <i className={`${curation.isLiked ? 'ri-heart-fill' : 'ri-heart-line'} w-4 h-4 flex items-center justify-center`}></i>
                            <span>{curation.likes}</span>
                          </button>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <i className="ri-chat-3-line w-4 h-4 flex items-center justify-center"></i>
                            <span>{curation.comments}</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(curation.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">소개</h3>
                    <p className="text-gray-700 leading-relaxed">{curator.bio}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">전문 분야</h3>
                    <div className="flex flex-wrap gap-2">
                      {curator.specialties.map(specialty => (
                        <span
                          key={specialty}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">기본 정보</h3>
                      <dl className="space-y-2">
                        <div className="flex">
                          <dt className="text-sm text-gray-500 w-20">위치:</dt>
                          <dd className="text-sm text-gray-900">{curator.location}</dd>
                        </div>
                        <div className="flex">
                          <dt className="text-sm text-gray-500 w-20">가입일:</dt>
                          <dd className="text-sm text-gray-900">{new Date(curator.joinedDate).toLocaleDateString()}</dd>
                        </div>
                        {curator.website && (
                          <div className="flex">
                            <dt className="text-sm text-gray-500 w-20">웹사이트:</dt>
                            <dd className="text-sm">
                              <a href={`https://${curator.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                {curator.website}
                              </a>
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">소셜 미디어</h3>
                      <div className="space-y-2">
                        {curator.social.instagram && (
                          <a href={`https://instagram.com/${curator.social.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-600 hover:text-blue-600">
                            <i className="ri-instagram-line w-5 h-5 flex items-center justify-center mr-2"></i>
                            {curator.social.instagram}
                          </a>
                        )}
                        {curator.social.blog && (
                          <a href={`https://${curator.social.blog}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-600 hover:text-blue-600">
                            <i className="ri-links-line w-5 h-5 flex items-center justify-center mr-2"></i>
                            {curator.social.blog}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-semibold text-gray-900 mb-4">활동 통계</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">전체 큐레이션</span>
                  <span className="text-sm font-medium text-gray-900">{curator.curations}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">받은 좋아요</span>
                  <span className="text-sm font-medium text-gray-900">{curator.totalLikes.toLocaleString()}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">평균 좋아요</span>
                  <span className="text-sm font-medium text-gray-900">{Math.round(curator.totalLikes / curator.curations).toLocaleString()}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">활동 기간</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.floor((new Date().getTime() - new Date(curator.joinedDate).getTime()) / (1000 * 60 * 60 * 24 * 365))}년+
                  </span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-semibold text-gray-900 mb-4">연락하기</h3>
              <div className="space-y-2">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap text-sm">
                  메시지 보내기
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap text-sm">
                  공유하기
                </button>
              </div>
            </div>

            {/* Similar Curators */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-semibold text-gray-900 mb-4">비슷한 큐레이터</h3>
              <div className="space-y-3">
                {[
                  {
                    id: '2',
                    name: '박문학',
                    followers: 12350,
                    avatar: 'https://readdy.ai/api/search-image?query=Middle-aged%20Korean%20literary%20curator%2C%20glasses%2C%20thoughtful%20expression%2C%20surrounded%20by%20classic%20books%2C%20warm%20library%20atmosphere%2C%20professional%20portrait%20style&width=40&height=40&seq=curator2&orientation=squarish'
                  },
                  {
                    id: '3',
                    name: '이책사랑',
                    followers: 10280,
                    avatar: 'https://readdy.ai/api/search-image?query=Young%20Korean%20business%20book%20curator%2C%20confident%20smile%2C%20modern%20office%20setting%20with%20business%20books%2C%20professional%20lighting%2C%20contemporary%20portrait%20style&width=40&height=40&seq=curator3&orientation=squarish'
                  }
                ].map(similarCurator => (
                  <Link key={similarCurator.id} to={`/curator/${similarCurator.id}`} className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 -m-2 cursor-pointer">
                    <img
                      src={similarCurator.avatar}
                      alt={similarCurator.name}
                      className="w-10 h-10 rounded-full object-cover object-top"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{similarCurator.name}</p>
                      <p className="text-xs text-gray-500">팔로워 {similarCurator.followers.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
