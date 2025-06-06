console.log('twitter.js loaded successfully!');

// JavaScript file for fetching and displaying tweets

// This function now makes a real network request to your live backend.
async function fetchTweets() {
    const apiUrl = 'https://signcommunity.onrender.com/api/tweets';
    console.log('Fetching live tweets from:', apiUrl);
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const json = await response.json();
        return json.data || []; // Return the array of tweets
    } catch (error) {
        console.error('Failed to fetch live tweets:', error);
        // Return an empty array on error so the page doesn't break
        return [];
    }
}

function renderTweets(tweets) {
    const container = document.querySelector('.tweet-card-container');
    if (!container) {
        console.error('Tweet container not found!');
        return;
    }
    
    container.innerHTML = ''; // Clear existing tweets

    if (tweets.length === 0) {
        container.innerHTML = '<p class="error-message">Could not load tweets at this time. Please try again later.</p>';
        return;
    }

    tweets.forEach((tweet, index) => {
        const card = document.createElement('a');
        card.className = 'tweet-card';
        card.href = `https://x.com/${tweet.author.username}/status/${tweet.id}`;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        // Add staggered animation delay
        card.style.animationDelay = `${index * 100}ms`;

        // Create the card's inner structure
        card.innerHTML = `
            <div class="tweet-header">
                <img src="${tweet.author.profile_image_url}" alt="${tweet.author.name}" class="tweet-avatar">
                <div class="tweet-author-info">
                    <p class="tweet-author-name">${tweet.author.name}</p>
                    <p class="tweet-author-handle">@${tweet.author.username}</p>
                </div>
            </div>
            <p class="tweet-text">${tweet.text}</p>
            <p class="tweet-time">${new Date(tweet.created_at).toLocaleString()}</p>
        `;
        
        container.appendChild(card);
    });
}

// More functionality will be added progressively. 