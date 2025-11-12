// Base configuration
const API_CONFIG = {
  newsapi: {
    name: 'NewsAPI',
    baseUrl: '/api/news', // This will be proxied through our server
    endpoints: {
      topHeadlines: '/top-headlines',
      search: '/everything'
    },
    params: {
      language: 'en',
      pageSize: 20,
      country: 'us', // Add default country
      sortBy: 'publishedAt' // Add default sort
    },
    // Don't include API key in client-side requests
    // The server will add it when proxying to NewsAPI
    responseMapper: (data) => {
      // Check if the response is already an array (might be the case with error handling)
      if (Array.isArray(data)) {
        console.log('Received array response, returning as is');
        return data;
      }
      
      // Handle standard NewsAPI response format
      if (data && typeof data === 'object') {
        // If the response has an articles array, return it
        if (Array.isArray(data.articles)) {
          console.log(`Found ${data.articles.length} articles in response`);
          return data.articles;
        }
        
        // If the response has a status field but no articles, log a warning
        if (data.status && data.status !== 'ok') {
          console.warn('NewsAPI returned non-ok status:', data.message || 'Unknown error');
        }
      }
      
      console.warn('Unexpected response format from NewsAPI:', data);
      return [];
    }
  },
  altnews: {
    name: 'AltNews',
    baseUrl: import.meta.env.VITE_ALT_NEWS_URL,
    endpoints: {
      topHeadlines: '/news',
      search: '/search'
    },
    params: {
      token: import.meta.env.VITE_ALT_NEWS_TOKEN,
      limit: 20
    },
    responseMapper: (data) => data.results || [],
    skip: true // Disabled for now
  }
};

// Determine which API to use (default to newsapi if not specified)
const ACTIVE_API = import.meta.env.VITE_PRIMARY_API || 'newsapi';
const ACTIVE_CONFIG = API_CONFIG[ACTIVE_API] || API_CONFIG.newsapi;

// Log which API is being used
console.log(`ℹ️  Using ${ACTIVE_CONFIG.name} API as primary news source`);

// Helper function to make API requests with fallback
async function fetchFromAPI(endpoint, params = {}, apiType = ACTIVE_API) {
  const config = API_CONFIG[apiType] || ACTIVE_CONFIG;
  
  try {
    // For NewsAPI, we don't need to send the API key from the client
    // as it will be added by the server proxy
    const cleanParams = { ...params };
    if (apiType === 'newsapi') {
      delete cleanParams.apiKey;
      delete cleanParams.token;
      
      // Remove country parameter for /everything endpoint
      if (endpoint.includes('everything') && 'country' in cleanParams) {
        delete cleanParams.country;
      }
    }
    
    // Only include parameters that have values (not null, undefined, or empty string)
    const filteredParams = Object.entries(cleanParams).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    // Create query string from filtered parameters
    const queryString = new URLSearchParams(filteredParams).toString();
    const fullUrl = `${config.baseUrl}${endpoint}${queryString ? `?${queryString}` : ''}`;
    
    console.log(`🌐 Fetching from ${config.name}: ${endpoint}`);
    console.log(`🔧 Request parameters:`, JSON.stringify(filteredParams, null, 2));
    
    const response = await fetch(fullUrl, {
      credentials: 'include', // Important for CORS with credentials
      headers: {
        'Content-Type': 'application/json',
        // For NewsAPI, we'll rely on the server to add the API key
      }
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw API response:', data);
    
    if (config.responseMapper) {
      const mapped = config.responseMapper(data);
      console.log('Mapped response:', mapped);
      return mapped;
    }
    return data;
    
  } catch (error) {
    console.error(`${config.name} API Error:`, error.message);
    
    // Try next available API if current one fails
    const nextApi = Object.keys(API_CONFIG).find(key => 
      key !== apiType && !API_CONFIG[key]?.skip
    );
    
    if (nextApi) {
      console.log(`🔄 Falling back to ${API_CONFIG[nextApi].name} API`);
      return fetchFromAPI(endpoint, params, nextApi);
    }
    
    // No fallback available, rethrow the error
    throw error;
  }
}

// Format article data to match your application's structure
function formatArticle(article, index) {
  // Handle NewsAPI format
  const isNewsAPI = ACTIVE_API === 'newsapi';
  
  // Extract image URL - check multiple possible fields
  let imageUrl = 'https://via.placeholder.com/800x400?text=No+Image';
  if (isNewsAPI) {
    // For NewsAPI, try urlToImage first
    imageUrl = article.urlToImage || imageUrl;
  } else {
    // For other APIs, try to extract from content or use image field
    const imageMatch = article.content?.match(/<img[^>]+src="([^">]+)"/);
    if (imageMatch && imageMatch[1]) {
      imageUrl = imageMatch[1];
    } else if (article.image) {
      imageUrl = article.image;
    }
  }

  // Handle source field which is an object in NewsAPI
  const sourceName = isNewsAPI 
    ? (typeof article.source === 'object' ? article.source.name : article.source)
    : article.source?.name;

  return {
    id: article.url || `article-${index}-${Date.now()}`,
    title: article.title || 'No title',
    excerpt: article.description || (article.content ? article.content.substring(0, 160) : ''),
    content: article.content || article.description || '',
    imageUrl: imageUrl,
    published_at: article.publishedAt || article.pubDate ? new Date(article.publishedAt || article.pubDate) : new Date(),
    author: {
      name: article.author || sourceName || 'Unknown Author',
      avatar: article.image || 'https://via.placeholder.com/50'
    },
    source: sourceName || 'Unknown Source',
    url: article.url || '#',
    // GNews specific fields
    source: article.source?.name || 'Unknown',
    publishedAt: article.publishedAt,
    // Add any additional fields you need
  };
}

// NewsAPI valid categories
const NEWSAPI_CATEGORIES = [
  'business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'
];

// Map our category names to NewsAPI categories or search queries
const mapCategory = (category) => {
  if (!category) return null;
  
  const lowerCategory = category.toLowerCase().trim();
  
  // Direct mapping for standard NewsAPI categories
  const standardCategories = {
    'business': 'business',
    'entertainment': 'entertainment',
    'general': 'general',
    'health': 'health',
    'science': 'science',
    'sports': 'sports',
    'technology': 'technology'
  };
  
  // Extended mapping for additional categories
  const extendedMapping = {
    // Technology related
    'software': 'technology',
    'programming': 'technology',
    'coding': 'technology',
    'devops': 'technology',
    'cloud': 'technology',
    'ai': 'ai-ml',  // Special handling in getHeadlines
    'ai-ml': 'ai-ml',  // Special handling in getHeadlines
    'machine-learning': 'ai-ml',  // Special handling in getHeadlines
    'artificial intelligence': 'ai-ml',  // Special handling in getHeadlines
    'cybersecurity': 'technology',
    'security': 'technology',
    'blockchain': 'technology',
    'crypto': 'technology',
    'web': 'technology',
    'mobile': 'technology',
    
    // Other common categories
    'politics': 'general',
    'world': 'general',
    'us': 'general',
    'uk': 'general',
    'europe': 'general',
    'asia': 'general',
    'middle east': 'general',
    'africa': 'general',
    'australia': 'general',
    'canada': 'general'
  };
  
  // Check standard categories first
  if (standardCategories[lowerCategory]) {
    return standardCategories[lowerCategory];
  }
  
  // Check extended mapping
  if (extendedMapping[lowerCategory]) {
    return extendedMapping[lowerCategory];
  }
  
  // For any other category, return it as a search query
  return null;
};

// Fetch top headlines from active API
// @param {string} category - News category (e.g., technology, business, sports)
// @param {number} page - Page number for pagination
// @returns {Promise<Array>} - Array of formatted articles
// Standard NewsAPI categories
const STANDARD_CATEGORIES = new Set([
  'business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'
]);

export async function getHeadlines(category = 'technology', page = 1) {
  try {
    const mappedCategory = mapCategory(category);
    
    // Determine if we should use top-headlines or everything endpoint
    const isStandardCategory = mappedCategory && STANDARD_CATEGORIES.has(mappedCategory);
    const endpoint = isStandardCategory 
      ? ACTIVE_CONFIG.endpoints.topHeadlines 
      : ACTIVE_CONFIG.endpoints.search;
    
    // Base parameters
    let params = {
      pageSize: 20,
      page,
      sortBy: 'publishedAt',
      language: 'en'
    };
    
    // Add appropriate parameters based on endpoint
    if (isStandardCategory) {
      // For standard categories, use the category parameter with country
      params.country = 'us';
      params.category = mappedCategory;
    } else {
      // For non-standard categories, use search
      const lowerCategory = (category || '').toLowerCase();
      
      // Define search queries for specific categories
      const searchQueries = {
        'ai': 'artificial intelligence OR AI OR machine learning OR deep learning',
        'ai-ml': 'artificial intelligence OR AI OR machine learning OR deep learning OR neural networks',
        'machine-learning': 'machine learning OR deep learning OR neural networks',
        'devops': 'devops OR "continuous integration" OR "continuous deployment" OR "CI/CD"',
        'security': 'cybersecurity OR security OR "data protection" OR privacy',
        'programming': 'programming OR coding OR software development OR developer',
        'cybersecurity': 'cybersecurity OR "cyber security" OR "information security"',
        'blockchain': 'blockchain OR cryptocurrency OR bitcoin OR ethereum OR smart contracts',
        'cloud': 'cloud computing OR AWS OR Azure OR Google Cloud OR cloud services',
        'iot': 'internet of things OR IoT OR smart devices OR connected devices'
      };
      
      // Use predefined query or the category name as search term
      params.q = searchQueries[lowerCategory] || category;
      
      // Add some additional filters for better quality results
      params.sortBy = 'publishedAt';
      params.pageSize = 30; // Get more results for searches
      
      // Remove parameters not supported by /everything endpoint
      delete params.category;
      delete params.country;
      
      // Add language filter for better results
      params.language = 'en';
    }

    console.log('🔍 Fetching headlines with params:', { 
      category, 
      mappedCategory, 
      params: JSON.stringify(params) 
    });
    
    const response = await fetchFromAPI(endpoint, params);
    
    if (!response) {
      console.error('❌ No response from API');
      return [];
    }
    
    console.log(`✅ Received response with status: ${response.status}`);
    
    const articles = ACTIVE_CONFIG.responseMapper(response) || [];
    console.log(`📰 Found ${articles.length} articles`);
    
    if (articles.length > 0) {
      console.log('First article title:', articles[0]?.title);
    }
    
    return articles.map((article, index) => formatArticle(article, index));
    
  } catch (error) {
    console.error('Error fetching headlines:', error);
    throw error;
  }
}

// Search for articles
// @param {string} query - Search query
// @param {string} sortBy - Sort order (varies by API)
// @returns {Promise<Array>} - Array of formatted articles
export async function searchArticles(query, sortBy = 'publishedAt') {
  if (!query) return [];
  
  try {
    const endpoint = ACTIVE_CONFIG.endpoints.search;
    const params = {
      q: query,
      ...(ACTIVE_API === 'newsapi' && { 
        sortBy,
        language: 'en',
        pageSize: 20
      })
    };
    
    const response = await fetchFromAPI(endpoint, params);
    const articles = ACTIVE_CONFIG.responseMapper(response) || [];
    return articles.map((article, index) => formatArticle(article, index));
    
  } catch (error) {
    console.error('Error searching articles:', error);
    throw error;
  }
}

// Get articles by category (wrapper around getHeadlines for backward compatibility)
export async function getArticles(category = 'technology', searchQuery = '') {
  if (searchQuery) {
    return searchArticles(searchQuery);
  }
  return getHeadlines(category);
}

// Get featured articles (top headlines in the technology category)
export async function getFeaturedArticles() {
  try {
    const endpoint = ACTIVE_CONFIG.endpoints.topHeadlines;
    const params = {
      category: 'technology',
      pageSize: 13, // 1 for hero + 12 for grid
      ...(ACTIVE_API === 'newsapi' && { country: 'us' })
    };
    
    const response = await fetchFromAPI(endpoint, params);
    const articles = ACTIVE_CONFIG.responseMapper(response) || [];
    return articles.map((article, index) => formatArticle(article, index));
    
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    throw error;
  }
}
