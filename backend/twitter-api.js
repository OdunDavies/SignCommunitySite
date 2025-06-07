require('dotenv').config();
const axios = require('axios');

const TWITTER_API_BASE = 'https://api.twitter.com/2';
const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

// Cache storage
const cache = {
  users: new Map(),
  tweets: new Map()
};

// Cache TTL in milliseconds (2 hours)
const CACHE_TTL = 2 * 60 * 60 * 1000;

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 10, // Reduced from 15 to be more conservative
  windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
  requests: 0,
  windowStart: Date.now()
};

// Request queue configuration
let requestQueue = [];
const INITIAL_DELAY = 5000; // 5 seconds between requests
const MAX_RETRIES = 3;
const MAX_DELAY = 60000; // Maximum delay of 1 minute

// Configure axios with default headers
const twitterClient = axios.create({
  baseURL: TWITTER_API_BASE,
  headers: {
    'Authorization': `Bearer ${BEARER_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Check and update rate limit
function checkRateLimit() {
  const now = Date.now();
  if (now - RATE_LIMIT.windowStart >= RATE_LIMIT.windowMs) {
    // Reset window
    RATE_LIMIT.requests = 0;
    RATE_LIMIT.windowStart = now;
    return true;
  }
  
  return RATE_LIMIT.requests < RATE_LIMIT.maxRequests;
}

// Process queue with rate limiting and exponential backoff
async function processQueue() {
  if (requestQueue.length === 0) return;

  const { request, resolve, reject, retryCount = 0, delay = INITIAL_DELAY } = requestQueue[0];
  
  try {
    if (checkRateLimit()) {
      RATE_LIMIT.requests++;
      const result = await request();
      resolve(result);
      requestQueue.shift();
      
      // Add delay between successful requests
      await new Promise(r => setTimeout(r, INITIAL_DELAY));
    } else {
      const waitTime = RATE_LIMIT.windowMs - (Date.now() - RATE_LIMIT.windowStart);
      console.log(`Rate limit reached, waiting ${Math.ceil(waitTime/1000)} seconds...`);
      await new Promise(r => setTimeout(r, waitTime));
    }
  } catch (error) {
    if (error.response && error.response.status === 429) {
      if (retryCount < MAX_RETRIES) {
        // Calculate exponential backoff delay
        const newDelay = Math.min(delay * 2, MAX_DELAY);
        console.log(`Rate limit hit, retrying in ${newDelay/1000} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
        
        // Update the request in queue with new retry count and delay
        requestQueue[0] = {
          ...requestQueue[0],
          retryCount: retryCount + 1,
          delay: newDelay
        };
        
        await new Promise(r => setTimeout(r, newDelay));
      } else {
        console.log(`Max retries reached for request, using cached data if available`);
        reject(error);
        requestQueue.shift();
      }
    } else {
      reject(error);
      requestQueue.shift();
    }
  }

  // Process next request
  if (requestQueue.length > 0) {
    setTimeout(processQueue, INITIAL_DELAY);
  }
}

// Add request to queue
function queueRequest(request) {
  return new Promise((resolve, reject) => {
    requestQueue.push({ request, resolve, reject });
    if (requestQueue.length === 1) {
      processQueue(); // Start processing if this is the first request
    }
  });
}

// Get cached data or fetch new
async function getCachedOrFetch(cacheKey, cacheStore, fetchFn) {
  // Check cache first
  const cached = cacheStore.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`Using cached data for ${cacheKey}`);
    return cached.data;
  }

  try {
    const data = await queueRequest(fetchFn);
    // Store in cache
    cacheStore.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    return data;
  } catch (error) {
    // If we have stale cache data, use it on error
    if (cached) {
      console.log(`Using stale cache for ${cacheKey} due to error`);
      return cached.data;
    }
    throw error;
  }
}

// Get user information by username
async function getUserByUsername(username) {
  try {
    return await getCachedOrFetch(
      username,
      cache.users,
      async () => {
        const response = await twitterClient.get(`/users/by/username/${username}`, {
          params: {
            'user.fields': 'description,profile_image_url,public_metrics'
          }
        });
        return response.data;
      }
    );
  } catch (error) {
    console.error(`Error fetching user ${username}:`, error.message);
    throw error;
  }
}

// Get user's recent tweets
async function getUserTweets(userId) {
  try {
    return await getCachedOrFetch(
      userId,
      cache.tweets,
      async () => {
        const response = await twitterClient.get(`/users/${userId}/tweets`, {
          params: {
            max_results: 2, // Reduced from 3 to minimize API usage
            'tweet.fields': 'created_at,public_metrics'
          }
        });
        return response.data;
      }
    );
  } catch (error) {
    console.error(`Error fetching tweets for user ${userId}:`, error.message);
    throw error;
  }
}

// Clear expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.users.entries()) {
    if (now - value.timestamp >= CACHE_TTL) {
      cache.users.delete(key);
    }
  }
  for (const [key, value] of cache.tweets.entries()) {
    if (now - value.timestamp >= CACHE_TTL) {
      cache.tweets.delete(key);
    }
  }
}, CACHE_TTL);

module.exports = {
  getUserByUsername,
  getUserTweets
}; 