import { motion } from 'framer-motion';
import { ExternalLink, Clock, TrendingUp } from 'lucide-react';
import { formatTimeAgo } from '../utils/date';
import { getCategoryLabel } from '../utils/categories';

const HeroArticle = ({ article }) => {
  if (!article) return null;

  const isTrending = article.trending_score > 7;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 h-[500px] group"
    >
      {article.image_url && (
        <>
          <img
            src={article.image_url}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </>
      )}

      <div className="relative h-full flex flex-col justify-end p-8 lg:p-12">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-3 mb-4">
            <span className="inline-block px-3 py-1 text-sm font-bold rounded-lg bg-neon-cyan text-black">
              {getCategoryLabel(article.category)}
            </span>
            {isTrending && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 text-sm font-bold rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                <TrendingUp size={14} />
                <span>Trending</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight group-hover:text-neon-cyan transition-colors">
            {article.title}
          </h1>

          {article.description && (
            <p className="text-lg text-gray-300 mb-6 line-clamp-2">
              {article.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center text-sm text-gray-400">
              <Clock size={16} className="mr-2" />
              {formatTimeAgo(article.published_at)}
            </div>
            <div className="text-sm text-gray-400">
              {article.source_name}
            </div>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-neon-cyan text-black font-semibold hover:bg-neon-blue transition-all duration-300 hover:shadow-lg hover:shadow-neon-cyan/50 transform hover:scale-105"
            >
              <span>Read Full Article</span>
              <ExternalLink size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-cyan animate-pulse" />
    </motion.div>
  );
};

export default HeroArticle;
