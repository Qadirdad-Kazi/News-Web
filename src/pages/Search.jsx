import { useState, useEffect } from 'react';
import { getArticles } from '../api/articles';
import ArticleCard from '../components/ArticleCard';
import SkeletonCard from '../components/SkeletonCard';
import { motion } from 'framer-motion';
import { Search as SearchIcon, X } from 'lucide-react';

const Search = () => {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query.trim().length > 0) {
      const delaySearch = setTimeout(() => {
        searchArticles();
      }, 500);
      return () => clearTimeout(delaySearch);
    } else {
      setArticles([]);
      setSearched(false);
      setError(null);
    }
  }, [query]);

  const searchArticles = async () => {
    if (query.trim().length === 0) return;

    try {
      setLoading(true);
      setError(null);
      
      // Use the API utility to search articles
      const searchResults = await getArticles(null, query);
      
      setArticles(searchResults);
      setSearched(true);
    } catch (error) {
      console.error('Error searching articles:', error);
      setError('Failed to search articles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Search Articles
          </h1>

          <div className="relative max-w-2xl">
            <SearchIcon
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for articles..."
              className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </motion.div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && searched && articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No articles found for "{query}"
            </p>
          </div>
        )}

        {!loading && articles.length > 0 && (
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Found {articles.length} article{articles.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
