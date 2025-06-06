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
    const communityUrl = "url:\"1808883915714933045\"";
    
    const expansions = "author_id,attachments.media_keys";
    const tweetFields = "created_at,public_metrics,text";
    const userFields = "profile_image_url,username,name";
    
    const officialTweetUrl = `https://api.twitter.com/2/users/${officialUserId}/tweets?max_results=5&tweet.fields=${tweetFields}&expansions=${expansions}&user.fields=${userFields}`;
    const communityTweetsUrl = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(communityUrl)} -is:retweet&max_results=20&tweet.fields=${tweetFields}&expansions=${expansions}&user.fields=${userFields}`;

    try {
        // Fetch both sets of tweets in parallel
        const [officialResult, communityResult] = await Promise.all([
            axios.get(officialTweetUrl, { headers: { 'Authorization': `Bearer ${twitterBearerToken}` } }),
            axios.get(communityTweetsUrl, { headers: { 'Authorization': `Bearer ${twitterBearerToken}` } })
        ]);

        const finalTweets = [];
        
        // --- Process Official Tweet ---
        if (officialResult.data && officialResult.data.data) {
            const officialTweet = officialResult.data.data[0]; // Get the very latest
            const author = officialResult.data.includes.users.find(u => u.id === officialTweet.author_id);
            if (author) {
                 finalTweets.push({ ...officialTweet, author });
            }
        }

        // --- Process Community Tweets ---
        if (communityResult.data && communityResult.data.data) {
            const communityTweets = communityResult.data.data;
            const communityUsers = communityResult.data.includes.users || [];
            
            const userMap = communityUsers.reduce((acc, user) => {
                acc[user.id] = user;
                return acc;
            }, {});

            const sortedCommunityTweets = communityTweets.map(tweet => {
                const metrics = tweet.public_metrics || { like_count: 0, retweet_count: 0, reply_count: 0 };
                const score = (metrics.like_count * 2) + metrics.retweet_count + metrics.reply_count;
                return { ...tweet, author: userMap[tweet.author_id] || {}, score };
            }).sort((a, b) => b.score - a.score);

            // Add the top 2 trending community tweets
            finalTweets.push(...sortedCommunityTweets.slice(0, 2));
        }

        cachedTweets = finalTweets;
        lastFetchTime = now;

        res.json({ data: finalTweets });

    } catch (error) {
        console.error('Error fetching tweets:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch tweets from Twitter API.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 