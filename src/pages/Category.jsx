import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getArticles } from '../api/articles';
import ArticleCard from '../components/ArticleCard';
import SkeletonCard from '../components/SkeletonCard';
import { getCategoryLabel } from '../utils/categories';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Category = () => {
  const { category } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    fetchArticles(1);
  }, [category]);

  const fetchArticles = async (pageNum) => {
    try {
      setLoading(true);
      
      // Use the API utility to get articles by category
      const data = await getArticles(category);
      
      // Simulate pagination on the client side
      const startIdx = (pageNum - 1) * ITEMS_PER_PAGE;
      const paginatedData = data.slice(0, startIdx + ITEMS_PER_PAGE);
      
      if (pageNum === 1) {
        setArticles(paginatedData);
      } else {
        setArticles(prev => [...prev, ...paginatedData]);
      }

      setHasMore(paginatedData.length < data.length);
    } catch (error) {
      console.error('Error fetching category articles:', error);
      setError('Failed to load articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchArticles(nextPage);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {getCategoryLabel(category)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Latest news and updates in {getCategoryLabel(category).toLowerCase()}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <ArticleCard key={article.id} article={article} index={index} />
          ))}
          {loading &&
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>

        {!loading && articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No articles found in this category yet.
            </p>
          </div>
        )}

        {hasMore && !loading && articles.length > 0 && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMore}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-neon-cyan text-black font-semibold hover:bg-neon-blue transition-all duration-300 hover:shadow-lg hover:shadow-neon-cyan/50"
            >
              <span>Load More</span>
              <ChevronDown size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
