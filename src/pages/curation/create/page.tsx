import React, { useState, useEffect } from 'react';

// Book 인터페이스: 불필요한 id 필드를 제거하고 isbn을 고유 식별자로 사용
interface Book {
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  description: string;
  coverImage: string;
}

// `alert()` 대신 사용할 커스텀 메시지 상태
const useMessage = () => {
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const showMessage = (text: string, error = false) => {
    setMessage(text);
    setIsError(error);
    setTimeout(() => {
      setMessage('');
      setIsError(false);
    }, 3000);
  };

  return { message, isError, showMessage };
};

// 메인 앱 컴포넌트
export default function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [categoryId, setCategoryId] = useState(1);
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { message, isError, showMessage } = useMessage();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 boolean으로 관리

  // 컴포넌트 마운트 시, 로그인 상태 확인
  // 실제로는 서버의 세션 유효성 검사 API를 호출하는 것이 이상적입니다.
  useEffect(() => {
    // 임시로 localStorage에 authToken이 있으면 로그인된 것으로 간주
    // 세션 기반 인증에서는 이 부분을 서버 API 호출로 대체해야 합니다.
    const storedAuthToken = localStorage.getItem('authToken');
    if (storedAuthToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const [searchResults, setSearchResults] = useState<Book[]>([]);

  // 책 검색 로직 (백엔드 API 호출)
  useEffect(() => {
    const fetchBooks = async () => {
      if (searchQuery.length > 1) {
        try {
          const response = await fetch(`http://localhost:8080/api/books/search?query=${searchQuery}`);
          if (!response.ok) {
            throw new Error('책 검색에 실패했습니다.');
          }

          const data = await response.json();
          const transformedBooks: Book[] = data.documents.map((doc: any) => ({
            title: doc.title,
            author: doc.authors.join(', '),
            publisher: doc.publisher,
            isbn: doc.isbn,
            description: doc.contents,
            coverImage: doc.thumbnail,
          }));

          setSearchResults(transformedBooks);
        } catch (error) {
          console.error("책 검색 API 오류: ", error);
          showMessage('책 검색 중 오류가 발생했습니다.', true);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };

    const timerId = setTimeout(() => {
      fetchBooks();
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  const handleAddBook = (book: Book) => {
    if (!books.find(b => b.isbn === book.isbn)) {
      setBooks([...books, book]);
    }
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleRemoveBook = (bookIsbn: string) => {
    setBooks(books.filter(book => book.isbn !== bookIsbn));
  };
  
  const handleSubmit = async () => {
    // 1. 유효성 검사 - 필수 입력 필드 확인
    if (!title.trim() || !description.trim()) {
      showMessage('제목과 설명을 입력해주세요.', true);
      return;
    }
    if (books.length === 0) {
      showMessage('최소 1권의 책을 추가해주세요.', true);
      return;
    }

    // 2. 로그인 상태 확인 (요청 보내기 전에)
    if (!isLoggedIn) {
        showMessage('로그인이 필요합니다. 다시 로그인해주세요.', true);
        return;
    }

    // 3. 백엔드로 전송할 데이터 구조
    const curationData = {
      title: title,
      content: description,
      categoryId: categoryId,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      books: books.map(book => ({
        isbn: book.isbn,
        title: book.title,
        authors: book.author,
        publisher: book.publisher,
      })),
    };

    console.log('전송할 데이터:', curationData);

    try {
      const response = await fetch('http://localhost:8080/curation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 세션 기반 인증은 쿠키로 이루어지므로, Authorization 헤더는 필요 없습니다.
        },
        credentials: 'include', // CORS 요청에 쿠키를 포함시키는 옵션
        body: JSON.stringify(curationData),
      });

      if (response.status === 201) {
        showMessage('큐레이션이 성공적으로 등록되었습니다!');
        setTitle('');
        setDescription('');
        setTags('');
        setCategoryId(1);
        setBooks([]);
        setSearchQuery('');
        setIsSearchOpen(false);
      } else {
        const errorText = await response.text();
        console.error('서버 응답:', errorText);
        showMessage('큐레이션 등록에 실패했습니다. 서버 오류.', true);
      }
    } catch (e) {
      showMessage('큐레이션 등록에 실패했습니다. 네트워크 오류.', true);
      console.error("네트워크 오류: ", e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="#" className="text-2xl font-bold text-blue-600 font-serif">
                후즈북
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="#"
                className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                홈으로
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">새 큐레이션 만들기</h1>
          <p className="text-gray-600">독자들에게 추천하고 싶은 책들을 큐레이션해보세요.</p>
        </div>

        {message && (
          <div className={`p-4 mb-4 text-sm font-medium rounded-lg text-center ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <div className="space-y-8">
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
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리 *
                </label>
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value={1}>소설</option>
                  <option value={2}>에세이</option>
                  <option value={3}>자기계발</option>
                  <option value={4}>인문</option>
                  <option value={5}>과학</option>
                  <option value={6}>예술</option>
                  <option value={7}>기타</option>
                </select>
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

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">책 목록 ({books.length}권)</h2>
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap flex items-center"
              >
                + 책 추가
              </button>
            </div>

            {books.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-5xl text-gray-300 mb-4">📚</div>
                <p>아직 추가된 책이 없습니다.</p>
                <p className="text-sm">책 추가 버튼을 눌러 책을 검색하고 추가해보세요.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {books.map((book) => (
                  <div key={book.isbn} className="flex bg-gray-50 rounded-lg p-4">
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
                      onClick={() => handleRemoveBook(book.isbn)}
                      className="ml-2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              큐레이션 등록
            </button>
          </div>
        </div>
      </div>

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
                  ×
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
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-96">
              {searchResults.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>검색 결과가 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((book) => (
                    <div
                      key={book.isbn}
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
                      <span className="text-blue-600 ml-auto">+</span>
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