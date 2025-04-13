import { useState, useEffect } from 'react';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  
  useEffect(() => {
    // Atnaujina lokalų užklausos tekstą, kai pasikeičia props
    setLocalQuery(searchQuery);
  }, [searchQuery]);
  
  // Atnaujina paiešką su uždelsimu, kad nebūtų atnaujinama per kiekvieną paspaudimą
  const handleChange = (e) => {
    const query = e.target.value;
    setLocalQuery(query);
    
    // Debounce paieškos funkcionalumas
    const timeoutId = setTimeout(() => {
      setSearchQuery(query);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localQuery);
  };
  
  const handleClear = () => {
    setLocalQuery('');
    setSearchQuery('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg 
            className="w-5 h-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <input
          type="search"
          className="block w-full p-3 pl-10 pr-12 rounded-lg bg-white border border-gray-200 focus:ring-2 focus:ring-teal focus:border-transparent"
          placeholder="Ieškoti"
          value={localQuery}
          onChange={handleChange}
        />
        
        {localQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar; 