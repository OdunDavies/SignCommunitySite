// Load environment variables from .env file
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { getUserByUsername, getUserTweets } = require('./twitter-api');

const app = express();
const PORT = process.env.PORT || 3000;

// --- NEW: Caching Logic ---
let cachedTweets = null;
let lastFetchTime = 0;
const cacheDuration = 900000; // Cache duration of 15 minutes

// Use CORS to allow requests from your frontend
// In a production environment, you should restrict this to your actual website's domain
app.use(cors());

// The main API endpoint
app.get('/api/tweets', async (req, res) => {
    const now = Date.now();

    if (cachedTweets && (now - lastFetchTime < cacheDuration)) {
        console.log('Serving from cache.');
        return res.json({ data: cachedTweets });
    }

    console.log('Fetching fresh tweets from Twitter API.');
    const twitterBearerToken = process.env.TWITTER_BEARER_TOKEN;
    
    if (!twitterBearerToken) {
        return res.status(500).json({ error: 'Twitter Bearer Token not configured on the server.' });
    }

    const officialUserId = "1552554683546714112"; // @sign user ID
    
    const expansions = "author_id,attachments.media_keys";
    const tweetFields = "created_at,public_metrics,text";
    const userFields = "profile_image_url,username,name";
    
    const officialTweetUrl = `https://api.twitter.com/2/users/${officialUserId}/tweets?exclude=retweets,replies&max_results=10&tweet.fields=${tweetFields}&expansions=${expansions}&user.fields=${userFields}`;

    try {
        // Fetch official tweets
        const officialResult = await axios.get(officialTweetUrl, { 
            headers: { 'Authorization': `Bearer ${twitterBearerToken}` } 
        });

        const finalTweets = [];
        
        // Process Official Tweets
        if (officialResult.data && officialResult.data.data) {
            const officialTweets = officialResult.data.data;
            const author = officialResult.data.includes.users.find(u => u.id === officialUserId);
            
            if (author) {
                // Add all official tweets with author info
                finalTweets.push(...officialTweets.map(tweet => ({ ...tweet, author })));
            }
        }

        cachedTweets = finalTweets;
        lastFetchTime = now;

        res.json({ data: finalTweets });

    } catch (error) {
        console.error('Error fetching fresh tweets, cache will be invalidated:', error.response ? error.response.data : error.message);
        // Invalidate cache on error to force a refetch on the next request
        cachedTweets = null;
        res.status(500).json({ error: 'Failed to fetch tweets from Twitter API.' });
    }
});

// Batch processing configuration
const BATCH_SIZE = 2; // Process 2 users at a time
const BATCH_DELAY = 30000; // 30 seconds between batches

// Helper function to process users in batches
async function processBatch(usernames) {
  const results = [];
  
  // Process users in small batches
  for (let i = 0; i < usernames.length; i += BATCH_SIZE) {
    const batch = usernames.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(usernames.length/BATCH_SIZE)}`);
    
    try {
      // Process each user in the current batch
      const batchResults = await Promise.all(
        batch.map(async (username) => {
          try {
            const userInfo = await getUserByUsername(username);
            if (userInfo && userInfo.data) {
              const tweets = await getUserTweets(userInfo.data.id);
              return {
                user: userInfo.data,
                tweets: tweets.data || []
              };
            }
          } catch (error) {
            console.error(`Error processing user ${username}:`, error.message);
            return {
              user: username,
              error: error.message
            };
          }
        })
      );
      
      results.push(...batchResults.filter(r => r));
      
      // Add delay between batches if not the last batch
      if (i + BATCH_SIZE < usernames.length) {
        console.log(`Waiting ${BATCH_DELAY/1000} seconds before next batch...`);
        await new Promise(r => setTimeout(r, BATCH_DELAY));
      }
    } catch (error) {
      console.error(`Error processing batch:`, error);
    }
  }
  
  return results;
}

// Update the profiles endpoint to use batch processing
app.get('/api/twitter/profiles', async (req, res) => {
  try {
    const { usernames } = req.query;
    if (!usernames) {
      return res.status(400).json({ error: 'Usernames parameter is required' });
    }

    const usernameList = usernames.split(',');
    const results = await processBatch(usernameList);
    
    // Filter out successful results and errors
    const successfulResults = results.filter(r => !r.error);
    const errors = results.filter(r => r.error);
    
    res.json({
      data: successfulResults,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error fetching Twitter profiles:', error);
    res.status(500).json({ error: 'Failed to fetch Twitter profiles' });
  }
});

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 