# Twitter API Integration Guide

This guide explains how to set up and use the Twitter API with your Bearer Token to fetch information about Sign Protocol affiliates.

## Getting Your Twitter Bearer Token

1. Go to the [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a Project and App:
   - Click "Add App" or "Create App" 
   - Name your app (e.g., "Sign Protocol Community")
   - Select the appropriate user context: "Read-Only"
   - Copy your Bearer Token immediately (it won't be shown again)

## Setting Up Environment Variables

1. Create a `.env` file in your backend directory:
```bash
TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here
```

2. Install required Node.js packages:
```bash
npm install dotenv axios express cors
```

## Backend Implementation

1. Create `backend/twitter-api.js`:
```javascript
require('dotenv').config();
const axios = require('axios');

const TWITTER_API_BASE = 'https://api.twitter.com/2';
const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

// Configure axios with default headers
const twitterClient = axios.create({
  baseURL: TWITTER_API_BASE,
  headers: {
    'Authorization': `Bearer ${BEARER_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Get user information by username
async function getUserByUsername(username) {
  try {
    const response = await twitterClient.get(`/users/by/username/${username}`, {
      params: {
        'user.fields': 'description,profile_image_url,public_metrics'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${username}:`, error.message);
    throw error;
  }
}

// Get user's recent tweets
async function getUserTweets(userId) {
  try {
    const response = await twitterClient.get(`/users/${userId}/tweets`, {
      params: {
        max_results: 10,
        'tweet.fields': 'created_at,public_metrics'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching tweets for user ${userId}:`, error.message);
    throw error;
  }
}

module.exports = {
  getUserByUsername,
  getUserTweets
};
```

2. Update `backend/server.js`:
```javascript
const express = require('express');
const cors = require('cors');
const { getUserByUsername, getUserTweets } = require('./twitter-api');

const app = express();
app.use(cors());

// Endpoint to get user info
app.get('/api/twitter/user/:username', async (req, res) => {
  try {
    const data = await getUserByUsername(req.params.username);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get user tweets
app.get('/api/twitter/tweets/:userId', async (req, res) => {
  try {
    const data = await getUserTweets(req.params.userId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Frontend Implementation

1. Update `js/twitter.js`:
```javascript
const API_BASE = 'http://localhost:3000/api';

// Fetch user information
async function fetchTwitterUser(username) {
  try {
    const response = await fetch(`${API_BASE}/twitter/user/${username}`);
    if (!response.ok) throw new Error('Failed to fetch user data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Twitter user:', error);
    throw error;
  }
}

// Fetch user tweets
async function fetchUserTweets(userId) {
  try {
    const response = await fetch(`${API_BASE}/twitter/tweets/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch tweets');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tweets:', error);
    throw error;
  }
}

// Example usage for Sign Protocol affiliates
async function loadAffiliateData(username) {
  try {
    // Show loading state
    const affiliateCard = document.querySelector(`[data-username="${username}"]`);
    if (affiliateCard) affiliateCard.classList.add('loading');

    // Fetch user data
    const userData = await fetchTwitterUser(username);
    const user = userData.data;

    // Fetch tweets if user data is successful
    if (user) {
      const tweetsData = await fetchUserTweets(user.id);
      updateAffiliateCard(username, user, tweetsData.data);
    }
  } catch (error) {
    console.error(`Error loading data for ${username}:`, error);
    handleError(username);
  } finally {
    // Remove loading state
    const affiliateCard = document.querySelector(`[data-username="${username}"]`);
    if (affiliateCard) affiliateCard.classList.remove('loading');
  }
}

// Update affiliate card with Twitter data
function updateAffiliateCard(username, userData, tweets) {
  const card = document.querySelector(`[data-username="${username}"]`);
  if (!card) return;

  // Update profile information
  card.querySelector('.profile-image').src = userData.profile_image_url;
  card.querySelector('.bio').textContent = userData.description;
  card.querySelector('.followers-count').textContent = 
    formatNumber(userData.public_metrics.followers_count);

  // Update tweets if available
  if (tweets && tweets.length > 0) {
    const tweetsList = card.querySelector('.recent-tweets');
    tweetsList.innerHTML = tweets
      .slice(0, 3)
      .map(tweet => createTweetHTML(tweet))
      .join('');
  }
}

// Helper function to format numbers
function formatNumber(num) {
  return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(num);
}

// Helper function to create tweet HTML
function createTweetHTML(tweet) {
  return `
    <div class="tweet">
      <p>${tweet.text}</p>
      <div class="tweet-metrics">
        <span>❤️ ${tweet.public_metrics.like_count}</span>
        <span>🔁 ${tweet.public_metrics.retweet_count}</span>
      </div>
      <small>${new Date(tweet.created_at).toLocaleDateString()}</small>
    </div>
  `;
}

// Error handling
function handleError(username) {
  const card = document.querySelector(`[data-username="${username}"]`);
  if (card) {
    card.classList.add('error');
    card.querySelector('.error-message').textContent = 
      'Failed to load Twitter data';
  }
}

// Initialize affiliate data loading
const AFFILIATES = [
  'realyanxin', '_biggids', 'lucky_of_web3', 'tokentable',
  'angelofweb3_', 'roguescholarbro', 'tajudeen_10', '0xzoe_im',
  'trojan_bus1', 'himesama_01', 'truthonchained', 'franstp0', '0xbossj'
];

// Load data for all affiliates
function initializeAffiliates() {
  AFFILIATES.forEach(username => loadAffiliateData(username));
}

// Start loading when DOM is ready
document.addEventListener('DOMContentLoaded', initializeAffiliates);
```

## Testing the Integration

1. Start the backend server:
```bash
cd backend
node server.js
```

2. Start the frontend server:
```bash
# In root directory
python -m http.server 8000
```

3. Visit http://localhost:8000 in your browser

## Troubleshooting

### Common Error Codes

1. 401 Unauthorized
   - Check if your Bearer Token is correct
   - Verify the token hasn't expired
   - Ensure the token is properly set in .env

2. 429 Too Many Requests
   - You've hit the rate limit
   - Implement caching
   - Add rate limiting to your server

3. 403 Forbidden
   - Check if your Twitter Developer Account is active
   - Verify your app has the correct permissions

### Rate Limits

Twitter API v2 has rate limits:
- User lookup: 300 requests/15-minute window
- Tweets lookup: 900 requests/15-minute window

To handle rate limits:
1. Implement caching on your server
2. Add retry logic with exponential backoff
3. Monitor your usage in Twitter Developer Portal

## Best Practices

1. Error Handling
   - Always implement proper error handling
   - Show user-friendly error messages
   - Log errors for debugging

2. Performance
   - Cache API responses
   - Implement rate limiting
   - Use pagination for tweets

3. Security
   - Never expose Bearer Token in frontend
   - Use environment variables
   - Implement CORS properly

4. User Experience
   - Show loading states
   - Handle errors gracefully
   - Implement retry mechanisms

## Monitoring and Maintenance

1. Monitor API usage in Twitter Developer Portal
2. Keep track of rate limits
3. Regularly update dependencies
4. Check for Twitter API changes
5. Monitor error logs

## Need Help?

If you encounter issues:
1. Check the Twitter API documentation
2. Verify your Bearer Token
3. Check server logs
4. Monitor network requests in browser
5. Review rate limit status 