// This is the Vercel serverless function entry point
import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';

// Initialize express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app', // Replace with your Vercel app URL
    'https://*.vercel.app' // Allow all Vercel deployments
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Apply middleware
app.use(cors(corsOptions));
app.use(express.json());

// Get API key from environment variables
const API_KEY = process.env.VITE_NEWSAPI_KEY || process.env.NEWSAPI_KEY;

if (!API_KEY) {
  console.error('❌ No NewsAPI key found in environment variables!');
  console.error('Please set VITE_NEWSAPI_KEY or NEWSAPI_KEY in your environment variables');
  // Don't exit in Vercel environment
  if (process.env.VERCEL !== '1') {
    process.exit(1);
  }
}

// Log which API key is being used (first few characters for security)
console.log('✅ Using NewsAPI key starting with:', API_KEY ? `${API_KEY.substring(0, 5)}...` : 'No API key found!');

const API_BASE = 'https://newsapi.org';
const API_URL = `${API_BASE}/v2`;

// Start the server for local development
const PORT = process.env.PORT || 3001;
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the Express API for Vercel Serverless Functions
export default app;

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// NewsAPI endpoint handler - handle all /api/news routes
app.use('/api/news', async (req, res) => {
  try {
    // Get the path after /api/news
    let apiPath = req.path.replace(/^\/api\/news/, '');
    
    // If the path is empty, check if it's a search or headlines request
    if (!apiPath || apiPath === '/') {
      // Check if this is a search request (has q parameter)
      if (req.query.q) {
        apiPath = '/everything';
      } else {
        apiPath = '/top-headlines';
      }
    }
    
    // Ensure the path starts with a slash
    if (!apiPath.startsWith('/')) {
      apiPath = `/${apiPath}`;
    }
    
    // Create URL object with the full path
    const fullPath = `/v2${apiPath}`;
    const url = new URL(fullPath, API_BASE);
    
    // Add all query parameters from the original request
    Object.entries(req.query).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.append(key, value);
      }
    });
    
    // Add the API key
    url.searchParams.append('apiKey', API_KEY);
    
    console.log(`🌐 Fetching from NewsAPI: ${url.toString()}`);
    
    const startTime = Date.now();
    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      }
    });
    
    if (!response.ok) {
      let error;
      try {
        error = await response.json();
        console.error('❌ NewsAPI Error:', error);
      } catch (e) {
        error = { message: response.statusText };
      }
      
      return res.status(response.status).json({
        status: 'error',
        code: 'newsapi_error',
        message: error.message || `Failed to fetch from NewsAPI: ${response.statusText}`,
        statusCode: response.status,
        url: url.toString(),
        details: error
      });
    }
    
    const data = await response.json();
    const responseTime = Date.now() - startTime;
    
    console.log(`✅ [${response.status}] Request completed in ${responseTime}ms`);
    console.log(`📊 Response status: ${data.status}, Total Results: ${data.totalResults || 0}`);
    
    if (data.articles && data.articles.length > 0) {
      console.log(`📰 First article: ${data.articles[0].title}`);
    } else {
      console.log('⚠️ No articles found in response');
      console.log('Request URL:', url.toString());
      console.log('Response:', JSON.stringify(data, null, 2));
    }
    
    res.json(data);
    
  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({
      status: 'error',
      code: 'server_error',
      message: 'Internal server error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Helper function to fetch from NewsAPI
async function fetchFromNewsAPI(endpoint, params = {}) {
  try {
    const queryParams = new URLSearchParams({
      apiKey: API_KEY,
      language: 'en',
      pageSize: 20,
      ...params
    });

    const response = await fetch(`${API_URL}/${endpoint}?${queryParams}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch from NewsAPI');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Debug endpoint to check environment
app.get('/api/debug', (req, res) => {
  res.json({
    status: 'ok',
    env: {
      node_env: process.env.NODE_ENV,
      port: process.env.PORT,
      has_api_key: !!process.env.VITE_NEWS_API_KEY,
      api_key_prefix: process.env.VITE_NEWS_API_KEY ? `${process.env.VITE_NEWS_API_KEY.substring(0, 3)}...` : 'none',
      has_alt_key: !!process.env.VITE_NEWS_API_KEY_ALT,
      has_token: !!process.env.VITE_NEWS_API_TOKEN
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    api: 'NewsAPI',
    node_env: process.env.NODE_ENV || 'development',
    time: new Date().toISOString()
  });
});

// Articles endpoints
app.get('/api/articles', async (req, res) => {
  const { category, search, page = 1, pageSize = 20 } = req.query;
  
  try {
    let data;
    if (search) {
      data = await fetchFromNewsAPI('everything', {
        q: search,
        page,
        pageSize
      });
    } else {
      data = await fetchFromNewsAPI('top-headlines', {
        category: category || 'technology',
        page,
        pageSize,
        country: 'us'
      });
    }
    
    res.json(data.articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({
      error: 'Failed to fetch articles',
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
});

// Get featured articles (for homepage)
app.get('/api/articles/featured', async (req, res) => {
  try {
    const data = await fetchFromNewsAPI('top-headlines', {
      category: 'technology',
      pageSize: 13 // 1 for hero + 12 for grid
    });
    
    res.json(data.articles);
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    res.status(500).json({
      error: 'Failed to fetch featured articles',
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
});

// Get single article by ID (proxy to the first article in search results)
app.get('/api/articles/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Since NewsAPI doesn't support direct ID lookup, we'll use the title as an ID
    const data = await fetchFromNewsAPI('everything', {
      q: decodeURIComponent(id).replace(/-/g, ' '),
      pageSize: 1
    });
    
    if (!data.articles || data.articles.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json(data.articles[0]);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({
      error: 'Failed to fetch article',
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log('🔌 API endpoints:');
  console.log(`   - GET http://localhost:${PORT}/api/health`);
  console.log(`   - GET http://localhost:${PORT}/api/articles`);
  console.log(`   - GET http://localhost:${PORT}/api/articles/featured`);
  console.log(`   - GET http://localhost:${PORT}/api/articles/:id`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  process.exit(0);
});
