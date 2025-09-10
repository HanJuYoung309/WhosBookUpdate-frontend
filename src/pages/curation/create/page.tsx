
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  description: string;
  coverImage: string;
}

export default function CreateCuration() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Mock book data for search
  const mockBooks: Book[] = [
    {
      id: '1',
      title: '미드나잇 라이브러리',
      author: '매트 헤이그',
      publisher: '인플루엔셜',
      isbn: '9788966262939',
      description: '죽음과 삶 사이에서 펼쳐지는 무한한 가능성의 이야기',
      coverImage: 'https://readdy.ai/api/search-image?query=Midnight%20Library%20book%20cover%2C%20mystical%20library%20setting%2C%20glowing%20books%2C%20ethereal%20atmosphere%2C%20purple%20and%20blue%20tones%2C%20fantasy%20book%20cover%20design&width=120&height=180&seq=book1&orientation=portrait'
    },
    {
      id: '2',
      title: '아몬드',
      author: '손원평',
      publisher: '창비',
      isbn: '9788936434267',
      description: '감정을 느끼지 못하는 소년의 성장 이야기',
      coverImage: 'https://readdy.ai/api/search-image?query=Korean%20novel%20Almond%20book%20cover%2C%20minimalist%20design%2C%20warm%20colors%2C%20young%20adult%20fiction%2C%20contemporary%20Korean%20literature%20cover&width=120&height=180&seq=book2&orientation=portrait'
    },
    {
      id: '3',
      title: '원씽',
      author: '게리 켈러',
      publisher: '비즈니스북스',
      isbn: '9788997575916',
      description: '성공을 이끄는 하나의 원칙',
      coverImage: 'https://readdy.ai/api/search-image?query=The%20One%20Thing%20business%20book%20cover%2C%20professional%20design%2C%20focus%20concept%2C%20success%20theme%2C%20clean%20layout%2C%20business%20book%20aesthetic&width=120&height=180&seq=book3&orientation=portrait'
    }
  ];

  const handleAddBook = (book: Book) => {
    if (!books.find(b => b.id === book.id)) {
      setBooks([...books, book]);
    }
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleRemoveBook = (bookId: string) => {
    setBooks(books.filter(book => book.id !== bookId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description && books.length > 0) {
      // Mock save - in real app would call API
      alert('큐레이션이 등록되었습니다!');
      navigate('/');
    } else {
      alert('모든 필드를 입력하고 최소 1권의 책을 추가해주세요.');
    }
  };

  const filteredBooks = mockBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">새 큐레이션 만들기</h1>
          <p className="text-gray-600">독자들에게 추천하고 싶은 책들을 큐레이션해보세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">기본 정보</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  큐레이션 제목 *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="큐레이션 제목을 입력하세요"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  큐레이션 설명 *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="이 큐레이션에 대한 설명을 입력하세요"
                  required
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  태그 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="예: 소설, 자기계발, 힐링"
                />
              </div>
            </div>
          </div>

          {/* Books Section */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">책 목록 ({books.length}권)</h2>
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-add-line w-4 h-4 flex items-center justify-center mr-2"></i>
                책 추가
              </button>
            </div>

            {books.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <i className="ri-book-line w-12 h-12 flex items-center justify-center mx-auto mb-4 text-gray-300"></i>
                <p>아직 추가된 책이 없습니다.</p>
                <p className="text-sm">책 추가 버튼을 눌러 책을 검색하고 추가해보세요.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {books.map((book) => (
                  <div key={book.id} className="flex bg-gray-50 rounded-lg p-4">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-16 h-24 object-cover object-top rounded"
                    />
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{book.title}</h4>
                      <p className="text-sm text-gray-600 mb-1">{book.author}</p>
                      <p className="text-xs text-gray-500">{book.publisher}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveBook(book.id)}
                      className="ml-2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 cursor-pointer"
                    >
                      <i className="ri-close-line w-4 h-4 flex items-center justify-center"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              to="/"
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              취소
            </Link>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              큐레이션 등록
            </button>
          </div>
        </form>
      </div>

      {/* Book Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">책 검색</h3>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="책 제목이나 저자명을 입력하세요"
                />
                <i className="ri-search-line w-5 h-5 flex items-center justify-center absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-96">
              {filteredBooks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>검색 결과가 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBooks.map((book) => (
                    <div
                      key={book.id}
                      className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => handleAddBook(book)}
                    >
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-12 h-18 object-cover object-top rounded"
                      />
                      <div className="ml-3 flex-1">
                        <h4 className="font-medium text-gray-900">{book.title}</h4>
                        <p className="text-sm text-gray-600">{book.author}</p>
                        <p className="text-xs text-gray-500">{book.publisher}</p>
                      </div>
                      <i className="ri-add-line w-5 h-5 flex items-center justify-center text-blue-600"></i>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
