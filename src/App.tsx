import React, { useState, useCallback } from 'react';
import { Search, Loader2, AlertCircle, ExternalLink } from 'lucide-react';

interface SearchResult {
  title: string;
  url: string;
  snippet?: string;
}

// Mock search service to simulate API behavior
const mockSearchService = async (query: string): Promise<SearchResult[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  // Simulate occasional errors
  if (Math.random() < 0.1) {
    throw new Error('Search service temporarily unavailable');
  }
  
  // Generate mock results based on the search query
  const mockResults: SearchResult[] = [
    {
      title: `${query} - Wikipedia`,
      url: `https://en.wikipedia.org/wiki/${query.replace(' ', '_')}`,
      snippet: `Learn about ${query} on Wikipedia, the free encyclopedia.`
    },
    {
      title: `${query} Profile - LinkedIn`,
      url: `https://linkedin.com/in/${query.toLowerCase().replace(' ', '-')}`,
      snippet: `Professional profile and career information for ${query}.`
    },
    {
      title: `${query} - Facebook`,
      url: `https://facebook.com/${query.toLowerCase().replace(' ', '.')}`,
      snippet: `Connect with ${query} on Facebook to see photos, videos and more.`
    },
    {
      title: `${query} (@${query.toLowerCase().replace(' ', '_')}) - Twitter`,
      url: `https://twitter.com/${query.toLowerCase().replace(' ', '_')}`,
      snippet: `The latest tweets from ${query}. Follow for updates and insights.`
    },
    {
      title: `${query} - IMDb`,
      url: `https://imdb.com/name/${query.toLowerCase().replace(' ', '-')}`,
      snippet: `Filmography, biography, and career highlights for ${query}.`
    }
  ];
  
  // Return 3-5 random results
  const numResults = 3 + Math.floor(Math.random() * 3);
  return mockResults.slice(0, numResults);
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    const trimmedTerm = searchTerm.trim();
    
    // Validate input
    if (!trimmedTerm) {
      setError('Please enter a name to search');
      return;
    }
    
    // Clear previous state
    setResults([]);
    setError('');
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const searchResults = await mockSearchService(trimmedTerm);
      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Name Search Engine
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="max-w-2xl mx-auto">
            <label htmlFor="nameInput" className="block text-sm font-medium text-gray-700 mb-3">
              Enter Name
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  id="nameInput"
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., John Smith, Jane Doe..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isLoading || !searchTerm.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Search
              </button>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Search Results
                {!isLoading && results.length > 0 && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({results.length} result{results.length !== 1 ? 's' : ''})
                  </span>
                )}
              </h2>
            </div>
            
            <div className="p-6">
              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="text-lg">Searching...</span>
                  </div>
                </div>
              )}

              {/* Results */}
              {!isLoading && results.length > 0 && (
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
                    >
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-blue-600 group-hover:text-blue-700 transition-colors duration-200 mb-1">
                              {result.title}
                            </h3>
                            <p className="text-sm text-green-600 mb-2 font-mono">
                              {result.url}
                            </p>
                            {result.snippet && (
                              <p className="text-gray-600 text-sm leading-relaxed">
                                {result.snippet}
                              </p>
                            )}
                          </div>
                          <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200 flex-shrink-0 mt-1" />
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!isLoading && results.length === 0 && !error && hasSearched && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-3">
                    <Search className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600">
                    Try searching for a different name or check your spelling.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Help Text */}
        {!hasSearched && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Search</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Enter a person's name to find their online presence, social media profiles, and public information.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-500">
            Name Search Engine - Find people across the web
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;