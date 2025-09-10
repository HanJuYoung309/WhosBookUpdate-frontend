
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  description: string;
  coverImage: string;
}

interface Comment {
  id: number;
  author: string;
  authorImage: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

interface Curation {
  id: number;
  title: string;
  description: string;
  curator: string;
  curatorId: number;
  curatorImage: string;
  likes: number;
  comments: number;
  bookCount: number;
  tags: string[];
  createdAt: string;
  isLiked: boolean;
  books: Book[];
}

export default function CurationDetail() {
  const { id } = useParams();
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  // Mock data
  const [curation, setCuration] = useState<Curation>({
    id: 1,
    title: '마음을 치유하는 힐링 도서 10선',
    description: '일상에 지친 마음을 달래주는 따뜻한 책들을 소개합니다. 에세이부터 소설까지 다양한 장르의 힐링 도서를 만나보세요. 현대인들의 스트레스와 피로감을 해소하고, 내면의 평안을 찾을 수 있는 책들로 구성했습니다.',
    curator: '김독서',
    curatorId: 1,
    curatorImage: 'https://readdy.ai/api/search-image?query=Professional%20Korean%20book%20curator%2C%20warm%20smile%2C%20holding%20books%2C%20cozy%20library%20background%2C%20soft%20lighting%2C%20portrait%20photography%20style%2C%20friendly%20and%20intellectual%20appearance&width=80&height=80&seq=curator1&orientation=squarish',
    likes: 2847,
    comments: 156,
    bookCount: 10,
    tags: ['힐링', '에세이', '소설', '마음치유'],
    createdAt: '2024-01-15',
    isLiked: false,
    books: [
      {
        id: '1',
        title: '미드나잇 라이브러리',
        author: '매트 헤이그',
        publisher: '인플루엔셜',
        description: '죽음과 삶 사이에서 펼쳐지는 무한한 가능성의 이야기. 노라는 자신이 살아온 삶에 후회만 가득하다가 특별한 도서관에서 다른 삶의 가능성들을 경험하게 됩니다.',
        coverImage: 'https://readdy.ai/api/search-image?query=Midnight%20Library%20book%20cover%2C%20mystical%20library%20setting%2C%20glowing%20books%2C%20ethereal%20atmosphere%2C%20purple%20and%20blue%20tones%2C%20fantasy%20book%20cover%20design&width=120&height=180&seq=book1&orientation=portrait'
      },
      {
        id: '2',
        title: '아몬드',
        author: '손원평',
        publisher: '창비',
        description: '감정을 느끼지 못하는 소년 윤재의 성장 이야기. 타인의 감정을 이해하지 못하는 소년이 어떻게 세상과 소통하며 성장하는지를 그린 따뜻한 소설입니다.',
        coverImage: 'https://readdy.ai/api/search-image?query=Korean%20novel%20Almond%20book%20cover%2C%20minimalist%20design%2C%20warm%20colors%2C%20young%20adult%20fiction%2C%20contemporary%20Korean%20literature%20cover&width=120&height=180&seq=book2&orientation=portrait'
      },
      {
        id: '3',
        title: '언어의 온도',
        author: '이기주',
        publisher: '말글터',
        description: '일상 속에서 만나는 언어들의 따뜻한 이야기. 우리가 무심코 사용하는 말들 속에 담긴 깊은 의미와 감정을 탐구하는 에세이입니다.',
        coverImage: 'https://readdy.ai/api/search-image?query=Korean%20essay%20book%20cover%20about%20language%20and%20warmth%2C%20minimalist%20typography%2C%20soft%20warm%20colors%2C%20literary%20design%2C%20elegant%20book%20cover&width=120&height=180&seq=book3&orientation=portrait'
      }
    ]
  });

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: '독서러버',
      authorImage: 'https://readdy.ai/api/search-image?query=Korean%20book%20lover%20reader%2C%20friendly%20smile%2C%20casual%20style%2C%20warm%20lighting%2C%20natural%20portrait%20style&width=40&height=40&seq=reader1&orientation=squarish',
      content: '정말 좋은 큐레이션이네요! 특히 미드나잇 라이브러리는 저에게 큰 위로가 되었던 책이에요. 추천해주셔서 감사합니다.',
      createdAt: '2024-01-16',
      likes: 12,
      isLiked: false
    },
    {
      id: 2,
      author: '책읽는곰',
      authorImage: 'https://readdy.ai/api/search-image?query=Korean%20young%20reader%2C%20glasses%2C%20cozy%20reading%20corner%2C%20books%20in%20background%2C%20natural%20lighting%2C%20friendly%20appearance&width=40&height=40&seq=reader2&orientation=squarish',
      content: '아몬드도 정말 감동적인 책이었어요. 이런 힐링 도서 큐레이션 더 많이 만들어주세요!',
      createdAt: '2024-01-17',
      likes: 8,
      isLiked: true
    },
    {
      id: 3,
      author: '마음치유',
      authorImage: 'https://readdy.ai/api/search-image?query=Korean%20middle-aged%20reader%2C%20peaceful%20expression%2C%20reading%20glasses%2C%20warm%20library%20setting%2C%20gentle%20lighting&width=40&height=40&seq=reader3&orientation=squarish',
      content: '언어의 온도는 처음 들어보는 책인데 소개 글을 보니 읽어보고 싶어지네요. 좋은 정보 감사합니다.',
      createdAt: '2024-01-18',
      likes: 5,
      isLiked: false
    }
  ]);

  const handleLikeCuration = () => {
    setCuration(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
    }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now(),
        author: '현재사용자',
        authorImage: 'https://readdy.ai/api/search-image?query=Korean%20user%20profile%2C%20friendly%20smile%2C%20casual%20style%2C%20warm%20lighting%2C%20natural%20portrait%20style&width=40&height=40&seq=currentuser&orientation=squarish',
        content: newComment,
        createdAt: new Date().toISOString().split('T')[0],
        likes: 0,
        isLiked: false
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const handleEditComment = (commentId: number) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      setEditingComment(commentId);
      setEditContent(comment.content);
    }
  };

  const handleSaveEdit = (commentId: number) => {
    setComments(comments.map(comment =>
      comment.id === commentId
        ? { ...comment, content: editContent }
        : comment
    ));
    setEditingComment(null);
    setEditContent('');
  };

  const handleDeleteComment = (commentId: number) => {
    if (confirm('댓글을 삭제하시겠습니까?')) {
      setComments(comments.filter(comment => comment.id !== commentId));
    }
  };

  const handleLikeComment = (commentId: number) => {
    setComments(comments.map(comment =>
      comment.id === commentId
        ? {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          }
        : comment
    ));
  };

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
                to="/"
                className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                홈으로
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Curation Header */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={curation.curatorImage}
                  alt={curation.curator}
                  className="w-12 h-12 rounded-full object-cover object-top"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{curation.curator}</h3>
                  <p className="text-sm text-gray-500">{curation.createdAt}</p>
                </div>
                <div className="ml-auto">
                  <Link
                    to={`/curation/edit/${curation.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer whitespace-nowrap"
                  >
                    수정
                  </Link>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">{curation.title}</h1>
              <p className="text-gray-700 leading-relaxed mb-6">{curation.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {curation.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={handleLikeCuration}
                    className={`flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
                      curation.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <i className={`${curation.isLiked ? 'ri-heart-fill' : 'ri-heart-line'} w-5 h-5 flex items-center justify-center`}></i>
                    <span>{curation.likes.toLocaleString()}</span>
                  </button>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <i className="ri-chat-3-line w-5 h-5 flex items-center justify-center"></i>
                    <span>{comments.length}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <i className="ri-book-line w-5 h-5 flex items-center justify-center"></i>
                    <span>{curation.bookCount}권</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Books List */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">추천 도서 ({curation.books.length}권)</h2>
              <div className="space-y-6">
                {curation.books.map((book) => (
                  <div key={book.id} className="flex bg-gray-50 rounded-lg p-4">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-24 h-36 object-cover object-top rounded flex-shrink-0"
                    />
                    <div className="ml-6 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{book.title}</h3>
                      <p className="text-gray-600 mb-2">{book.author} · {book.publisher}</p>
                      <p className="text-gray-700 text-sm leading-relaxed">{book.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">댓글 ({comments.length})</h2>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="mb-8">
                <div className="flex space-x-4">
                  <img
                    src="https://readdy.ai/api/search-image?query=Korean%20user%20profile%2C%20friendly%20smile%2C%20casual%20style%2C%20warm%20lighting%2C%20natural%20portrait%20style&width=40&height=40&seq=currentuser&orientation=squarish"
                    alt="현재 사용자"
                    className="w-10 h-10 rounded-full object-cover object-top flex-shrink-0"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                      rows={3}
                      placeholder="댓글을 입력하세요..."
                      maxLength={500}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">{newComment.length}/500</span>
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap text-sm"
                      >
                        댓글 등록
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-4">
                    <img
                      src={comment.authorImage}
                      alt={comment.author}
                      className="w-10 h-10 rounded-full object-cover object-top flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">{comment.author}</span>
                        <span className="text-sm text-gray-500">{comment.createdAt}</span>
                      </div>
                      
                      {editingComment === comment.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                            rows={3}
                            maxLength={500}
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSaveEdit(comment.id)}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 cursor-pointer whitespace-nowrap"
                            >
                              저장
                            </button>
                            <button
                              onClick={() => setEditingComment(null)}
                              className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50 cursor-pointer whitespace-nowrap"
                            >
                              취소
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-700 mb-3">{comment.content}</p>
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => handleLikeComment(comment.id)}
                              className={`flex items-center space-x-1 text-sm cursor-pointer whitespace-nowrap ${
                                comment.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                              }`}
                            >
                              <i className={`${comment.isLiked ? 'ri-heart-fill' : 'ri-heart-line'} w-4 h-4 flex items-center justify-center`}></i>
                              <span>{comment.likes}</span>
                            </button>
                            {comment.author === '현재사용자' && (
                              <>
                                <button
                                  onClick={() => handleEditComment(comment.id)}
                                  className="text-sm text-gray-500 hover:text-blue-600 cursor-pointer whitespace-nowrap"
                                >
                                  수정
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="text-sm text-gray-500 hover:text-red-600 cursor-pointer whitespace-nowrap"
                                >
                                  삭제
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Curator Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
              <img
                src={curation.curatorImage}
                alt={curation.curator}
                className="w-20 h-20 rounded-full object-cover object-top mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{curation.curator}</h3>
              <p className="text-sm text-gray-600 mb-4">문학과 철학을 사랑하는 독서광입니다.</p>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">45</div>
                  <div className="text-xs text-gray-500">큐레이션</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">15.4K</div>
                  <div className="text-xs text-gray-500">팔로워</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-blue-600">8.9K</div>
                  <div className="text-xs text-gray-500">좋아요</div>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap">
                팔로우
              </button>
            </div>

            {/* Related Curations */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">관련 큐레이션</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2">
                    <img
                      src={`https://readdy.ai/api/search-image?query=Book%20collection%2C%20literary%20theme%2C%20cozy%20reading%20atmosphere%2C%20warm%20colors%2C%20minimalist%20design&width=60&height=40&seq=related${item}&orientation=landscape`}
                      alt="관련 큐레이션"
                      className="w-15 h-10 object-cover object-top rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        겨울밤에 읽기 좋은 소설 모음
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">김독서 · 좋아요 987</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
