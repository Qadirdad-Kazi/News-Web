import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../utils/categories';
import * as Icons from 'lucide-react';

const CategoryNav = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
      {CATEGORIES.map((category, index) => {
        const IconComponent = Icons[category.icon] || Icons.Folder;

        return (
          <motion.div
            key={category.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link
              to={`/category/${category.key}`}
              className="flex flex-col items-center justify-center p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-neon-cyan/50 dark:hover:border-neon-cyan/50 transition-all duration-300 hover:shadow-lg hover:shadow-neon-cyan/10 hover:-translate-y-1 group"
            >
              <div className="p-3 rounded-lg bg-gradient-to-br from-neon-cyan/10 to-neon-blue/10 group-hover:from-neon-cyan/20 group-hover:to-neon-blue/20 transition-colors mb-3">
                <IconComponent className="text-neon-cyan" size={24} />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center group-hover:text-neon-cyan transition-colors">
                {category.label}
              </span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CategoryNav;
