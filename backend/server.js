// Load environment variables from .env file
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

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

    // --- NEW: Serve from cache if still valid ---
    if (cachedTweets && (now - lastFetchTime < cacheDuration)) {
        console.log('Serving from cache.');
        return res.json({ data: cachedTweets });
    }

    console.log('Fetching fresh tweets from Twitter API.');
    const twitterBearerToken = process.env.TWITTER_BEARER_TOKEN;
    
    if (!twitterBearerToken) {
        return res.status(500).json({ error: 'Twitter Bearer Token not configured on the server.' });
    }

    // This is the user ID for @sign on Twitter/X
    const userId = "1552554683546714112";
    const url = `https://api.twitter.com/2/users/${userId}/tweets?max_results=20&tweet.fields=created_at,author_id,public_metrics&expansions=author_id&user.fields=profile_image_url,username,name`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${twitterBearerToken}`
            }
        });

        // --- NEW: Calculate trending score and sort tweets ---
        const tweets = response.data.data || [];
        const users = response.data.includes.users || [];

        // Create a user map for easy lookup
        const userMap = users.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
        }, {});

        const sortedTweets = tweets.map(tweet => {
            // Calculate a simple "trending" score
            const metrics = tweet.public_metrics || { like_count: 0, retweet_count: 0, reply_count: 0 };
            const score = (metrics.like_count * 2) + metrics.retweet_count + metrics.reply_count;
            
            return {
                ...tweet,
                author: userMap[tweet.author_id] || {},
                score: score
            };
        }).sort((a, b) => b.score - a.score); // Sort by score, highest first

        // --- NEW: Update cache and timestamp ---
        cachedTweets = sortedTweets;
        lastFetchTime = now;

        res.json({ data: sortedTweets });

    } catch (error) {
        console.error('Error fetching tweets:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch tweets from Twitter API.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 