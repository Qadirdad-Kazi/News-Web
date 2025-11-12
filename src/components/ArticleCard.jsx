import { motion } from 'framer-motion';
import { ExternalLink, Clock, TrendingUp, Bookmark } from 'lucide-react';
import { formatTimeAgo } from '../utils/date';
import { getCategoryLabel } from '../utils/categories';

const ArticleCard = ({ article, index = 0 }) => {
  const isTrending = article.trending_score > 7;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-neon-cyan/50 dark:hover:border-neon-cyan/50 transition-all duration-300 hover:shadow-xl hover:shadow-neon-cyan/10 hover:-translate-y-1"
    >
      {isTrending && (
        <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
          <TrendingUp size={12} />
          <span>Trending</span>
        </div>
      )}

      {article.image_url ? (
        <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
          <span className="text-4xl">📰</span>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center space-x-2 mb-3">
          <span className="inline-block px-2 py-1 text-xs font-semibold rounded-md bg-neon-cyan/10 text-neon-cyan">
            {getCategoryLabel(article.category)}
          </span>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Clock size={12} className="mr-1" />
            {formatTimeAgo(article.published_at)}
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-neon-cyan transition-colors">
          {article.title}
        </h3>

        {article.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
            {article.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">{article.source_name}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              className="p-2 rounded-lg text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-colors"
              aria-label="Save article"
            >
              <Bookmark size={16} />
            </button>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-sm font-medium text-neon-cyan hover:text-neon-blue transition-colors"
            >
              <span>Read</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default ArticleCard;
