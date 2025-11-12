import { useState, useEffect } from 'react';
import { getFeaturedArticles } from '../api/articles';
import HeroArticle from '../components/HeroArticle';
import ArticleCard from '../components/ArticleCard';
import CategoryNav from '../components/CategoryNav';
import SkeletonCard from '../components/SkeletonCard';
import { motion } from 'framer-motion';

const Home = () => {
  const [heroArticle, setHeroArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch featured articles from our API
      const data = await getFeaturedArticles();
      
      if (data && data.length > 0) {
        setHeroArticle(data[0]);
        setArticles(data.slice(1, 13)); // Get next 12 articles for the grid
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Failed to load articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {loading ? (
          <div className="h-[500px] bg-gray-200 dark:bg-gray-900 rounded-2xl animate-pulse" />
        ) : (
          <HeroArticle article={heroArticle} />
        )}

        <section>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Explore Categories
          </motion.h2>
          <CategoryNav />
        </section>

        <section>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Latest in Software Engineering
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : articles.map((article, index) => (
                  <ArticleCard key={article.id} article={article} index={index} />
                ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
