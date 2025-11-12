import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-neon-cyan to-neon-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-neon-cyan to-neon-blue bg-clip-text text-transparent">
                TechPulse
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your source for the latest tech news, curated for software engineers.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-neon-cyan transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/category/software-engineering" className="text-sm text-gray-600 dark:text-gray-400 hover:text-neon-cyan transition-colors">
                  Software Engineering
                </Link>
              </li>
              <li>
                <Link to="/category/ai-ml" className="text-sm text-gray-600 dark:text-gray-400 hover:text-neon-cyan transition-colors">
                  AI/ML
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-sm text-gray-600 dark:text-gray-400 hover:text-neon-cyan transition-colors">
                  Search
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-gray-600 dark:text-gray-400">About Us</span>
              </li>
              <li>
                <span className="text-sm text-gray-600 dark:text-gray-400">Terms of Service</span>
              </li>
              <li>
                <span className="text-sm text-gray-600 dark:text-gray-400">Privacy Policy</span>
              </li>
              <li>
                <span className="text-sm text-gray-600 dark:text-gray-400">Contact</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Connect</h3>
            <div className="flex space-x-3">
              <a
                href="#"
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-neon-cyan hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-neon-cyan hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-neon-cyan hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-neon-cyan hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {currentYear} TechPulse. Built with passion for engineers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
