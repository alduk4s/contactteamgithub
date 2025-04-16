import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isFocused, setIsFocused] = useState(false);
  
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
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="relative"
        animate={{ 
          scale: isFocused ? 1.01 : 1,
          boxShadow: isFocused ? "0 4px 10px rgba(0, 0, 0, 0.08)" : "0 0 0 rgba(0, 0, 0, 0)"
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.div 
          className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          animate={{ 
            x: isFocused ? 2 : 0,
            scale: isFocused ? 1.1 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.svg 
            className="w-5 h-5 text-gray-400 dark:text-gray-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            animate={{ 
              rotate: localQuery ? [0, -20, 0] : 0,
              color: isFocused ? "#567c8d" : "#9ca3af"
            }}
            transition={{ duration: 0.3 }}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </motion.svg>
        </motion.div>
        
        <input
          type="search"
          className="block w-full p-3 pl-10 pr-12 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal focus:border-transparent dark:text-white transition-all duration-200"
          placeholder="Ieškoti kontaktų pagal vardą, numerį..."
          value={localQuery}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        
        <AnimatePresence>
          {localQuery && (
            <motion.button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
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
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.form>
  );
};

export default SearchBar; 