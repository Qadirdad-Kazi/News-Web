# TechPulse - Futuristic Tech News Site

A modern, responsive tech news aggregator built for software engineers. Features automatic news fetching, dark/light mode, and a cutting-edge glassmorphic UI.

## Features

- **Auto-Fetching News**: Automatically pulls latest tech news from NewsAPI
- **7-Day Retention**: Articles older than 7 days are automatically removed
- **Category Navigation**: Browse Software Engineering, DevOps, AI/ML, Security, Business, Lifestyle, and General Tech
- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **Search Functionality**: Find articles by keyword
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Glassmorphism UI**: Modern, techy aesthetic with neon cyan accents
- **Smooth Animations**: Framer Motion powered micro-interactions

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS v4 with custom neon theme
- **Routing**: React Router
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Backend**: Supabase Edge Functions
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Setup Instructions

### 1. Environment Variables

The `.env` file has been pre-configured with your Supabase credentials. You need to add your NewsAPI key:

```
VITE_SUPABASE_URL=https://injxvqbentjxvnpaebmx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_NEWS_API_KEY=your_news_api_key_here
```

### 2. Get a NewsAPI Key

1. Visit [NewsAPI.org](https://newsapi.org/)
2. Sign up for a free account
3. Copy your API key
4. Replace `your_news_api_key_here` in `.env` with your actual key

### 3. Configure Supabase Edge Function Secret

The news fetching edge function needs the NewsAPI key configured in Supabase:

```bash
# Set the NEWS_API_KEY secret (this is done automatically)
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
```

## Usage

### Fetching News

The `fetch-news` edge function automatically fetches news for all categories. To trigger it manually:

**Call the edge function:**
```bash
curl -X POST https://injxvqbentjxvnpaebmx.supabase.co/functions/v1/fetch-news
```

**Or set up a cron job** to run hourly:
```bash
# Example cron (runs every hour)
0 * * * * curl -X POST https://injxvqbentjxvnpaebmx.supabase.co/functions/v1/fetch-news
```

**Or use a service like [cron-job.org](https://cron-job.org/)** to schedule the function call.

### Categories

The site includes these categories:
- Software Engineering
- DevOps
- AI/ML
- Security
- General Tech
- Business
- Lifestyle

### Database Schema

**Articles Table:**
- Stores fetched news articles
- Automatically removes articles older than 7 days
- Includes trending scores and AI summaries (ready for future enhancement)

**Saved Articles Table:**
- Allows users to save articles for later (authentication required)

## Architecture

### Frontend
- `src/pages/` - Route components (Home, Category, Search)
- `src/components/` - Reusable UI components
- `src/context/` - React context (ThemeContext)
- `src/lib/` - Supabase client
- `src/utils/` - Helper functions

### Backend
- `supabase/functions/fetch-news/` - Edge function for fetching news
- Runs on Deno runtime
- Fetches from NewsAPI and stores in PostgreSQL
- Automatically cleans up old articles

## Customization

### Theme Colors

Edit `tailwind.config.js` to change the neon accent colors:

```javascript
colors: {
  neon: {
    cyan: '#00E5FF',  // Main accent
    blue: '#0EA5E9',  // Secondary accent
  },
}
```

### News Sources

Modify the categories in `supabase/functions/fetch-news/index.ts`:

```javascript
const CATEGORIES = [
  { key: 'your-category', query: 'your search terms' },
  // ...
];
```

## Deployment

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect to Vercel/Netlify
3. Add environment variables
4. Deploy

### Backend (Supabase)
- Edge functions are already deployed
- Database is already configured
- Just schedule the fetch-news function to run periodically

## License

MIT

## Credits

Built with passion for software engineers.
