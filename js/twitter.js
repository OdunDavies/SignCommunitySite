console.log('twitter.js loaded successfully!');

// JavaScript file for fetching and displaying tweets

// This function now makes a real network request to your live backend.
async function fetchTweets() {
    const apiUrl = 'http://localhost:3000/api/tweets';  // Updated to local server
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

    // Sort tweets by date (newest first)
    const sortedTweets = tweets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    sortedTweets.forEach((tweet, index) => {
        const card = document.createElement('a');
        card.className = 'tweet-card';
        card.href = `https://x.com/${tweet.author.username}/status/${tweet.id}`;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        // Add staggered animation delay
        card.style.animationDelay = `${index * 100}ms`;

        // Format the tweet text (handle links, mentions, hashtags)
        const formattedText = formatTweetText(tweet.text);

        // Format metrics
        const metrics = tweet.public_metrics || {};
        const formattedMetrics = formatMetrics(metrics);

        // Create the card's inner structure
        card.innerHTML = `
            <div class="tweet-header">
                <img src="${tweet.author.profile_image_url}" alt="${tweet.author.name}" class="tweet-avatar">
                <div class="tweet-author-info">
                    <p class="tweet-author-name">${tweet.author.name}</p>
                    <p class="tweet-author-handle">@${tweet.author.username}</p>
                </div>
            </div>
            <p class="tweet-text">${formattedText}</p>
            <div class="tweet-footer">
                <div class="tweet-metrics">
                    ${formattedMetrics}
                </div>
                <p class="tweet-time">${formatDate(tweet.created_at)}</p>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Helper function to format tweet text with clickable links, mentions, and hashtags
function formatTweetText(text) {
    // Convert URLs to clickable links
    text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Convert @mentions to clickable links
    text = text.replace(/@(\w+)/g, '<a href="https://x.com/$1" target="_blank" rel="noopener noreferrer">@$1</a>');
    
    // Convert #hashtags to clickable links
    text = text.replace(/#(\w+)/g, '<a href="https://x.com/hashtag/$1" target="_blank" rel="noopener noreferrer">#$1</a>');
    
    return text;
}

// Helper function to format metrics
function formatMetrics(metrics) {
    const { like_count = 0, retweet_count = 0, reply_count = 0 } = metrics;
    return `
        <span title="Likes"><i class="fas fa-heart"></i> ${formatNumber(like_count)}</span>
        <span title="Retweets"><i class="fas fa-retweet"></i> ${formatNumber(retweet_count)}</span>
        <span title="Replies"><i class="fas fa-reply"></i> ${formatNumber(reply_count)}</span>
    `;
}

// Helper function to format numbers (e.g., 1000 -> 1K)
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Helper function to format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 minute
    if (diff < 60000) {
        return 'just now';
    }
    // Less than 1 hour
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes}m`;
    }
    // Less than 24 hours
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours}h`;
    }
    // Less than 7 days
    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days}d`;
    }
    // Otherwise, return the date
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
    });
}

// More functionality will be added progressively.

// Twitter API integration for Sign Protocol Community Website

async function fetchMyContributions() {
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        return {
            twitter: {
                username: 'emlord_01',
                name: 'Lord Em',
                profile_image_url: 'https://pbs.twimg.com/profile_images/default_profile_400x400.png',
                bio: 'Sign Protocol Community Member | Artist & Contributor',
                contributions: [
                    {
                        type: 'tweet',
                        id: '1792999481735954432',
                        text: 'Excited to share my latest artwork for @SignProtocol! 🎨✨ This piece represents the future of digital attestations. #NFT #Web3Art',
                        created_at: '2024-02-20T18:30:00.000Z',
                        public_metrics: {
                            reply_count: 5,
                            quote_count: 2
                        }
                    }
                ],
                artwork: [
                    {
                        id: 'art1',
                        title: 'Sign Protocol Vision',
                        description: 'A digital artwork representing Sign Protocol\'s vision of trust in Web3',
                        image_url: 'assets/images/contributions/art1.jpg',
                        created_at: '2024-02-15'
                    },
                    {
                        id: 'art2',
                        title: 'Digital Attestations',
                        description: 'An artistic interpretation of Sign Protocol\'s attestation process',
                        image_url: 'assets/images/contributions/art2.jpg',
                        created_at: '2024-02-10'
                    }
                ]
            }
        };
    } catch (error) {
        console.error('Error fetching my contributions:', error);
        return null;
    }
}

async function fetchNewsFeed() {
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // This would be replaced with actual Twitter API call
        return [
            {
                id: '1',
                author: {
                    name: 'Sign Protocol',
                    username: 'sign',
                    profile_image_url: 'https://pbs.twimg.com/profile_images/1792942481735954432/uM0L2TX4_400x400.jpg'
                },
                text: 'Exciting news! Sign Protocol is revolutionizing the attestation layer of the internet. Stay tuned for more updates! 🚀',
                created_at: new Date().toISOString()
            },
            {
                id: '2',
                author: {
                    name: 'Sign News',
                    username: 'signews',
                    profile_image_url: 'https://pbs.twimg.com/profile_images/1792942481735954432/uM0L2TX4_400x400.jpg'
                },
                text: 'Just released: New documentation on how to integrate Sign Protocol into your dApp! Check it out at docs.sign.org 📚',
                created_at: new Date(Date.now() - 3600000).toISOString()
            },
            {
                id: '3',
                author: {
                    name: 'Sign Community',
                    username: 'signcommunity',
                    profile_image_url: 'https://pbs.twimg.com/profile_images/1792942481735954432/uM0L2TX4_400x400.jpg'
                },
                text: 'Join us for our weekly community call! Every Thursday at 2 PM UTC. This week we\'ll be discussing the future of attestations! 🎯',
                created_at: new Date(Date.now() - 7200000).toISOString()
            }
        ];
    } catch (error) {
        console.error('Error fetching news feed:', error);
        throw new Error('Failed to fetch news feed');
    }
}

async function fetchThreadors() {
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        return [
            {
                id: '1',
                author: {
                    name: 'Web3 Educator',
                    username: 'web3edu',
                    profile_image_url: 'https://pbs.twimg.com/profile_images/1792942481735954432/uM0L2TX4_400x400.jpg'
                },
                text: '🧵 1/5 A deep dive into Sign Protocol and why it matters for the future of web3. Let\'s explore how attestations are changing the game...',
                created_at: new Date().toISOString()
            },
            {
                id: '2',
                author: {
                    name: 'DeFi Researcher',
                    username: 'defiresearch',
                    profile_image_url: 'https://pbs.twimg.com/profile_images/1792942481735954432/uM0L2TX4_400x400.jpg'
                },
                text: '📚 THREAD: Understanding Sign Protocol\'s Role in DeFi\n\n1) First, let\'s talk about why attestations matter in DeFi...',
                created_at: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: '3',
                author: {
                    name: 'Crypto Developer',
                    username: 'cryptodev',
                    profile_image_url: 'https://pbs.twimg.com/profile_images/1792942481735954432/uM0L2TX4_400x400.jpg'
                },
                text: '💻 Technical Thread on Sign Protocol Integration\n\nA step-by-step guide on how to integrate Sign Protocol into your dApp...',
                created_at: new Date(Date.now() - 172800000).toISOString()
            }
        ];
    } catch (error) {
        console.error('Error fetching threadors:', error);
        throw new Error('Failed to fetch threadors');
    }
}

// Start loading when DOM is ready
// Initialize all feeds
async function initializeFeeds() {
    try {
        const [newsFeed, threadors, myContributions] = await Promise.all([
            fetchNewsFeed(),
            fetchThreadors(),
            fetchMyContributions()
        ]);

        // Display news feed
        const newsFeedContainer = document.getElementById('twitter-feed');
        if (newsFeed && newsFeed.length > 0) {
            newsFeedContainer.innerHTML = newsFeed.map(tweet => createTweetCard(tweet)).join('');
        }

        // Display threadors
        const threadorsContainer = document.getElementById('threadors-container');
        if (threadors && threadors.length > 0) {
            threadorsContainer.innerHTML = threadors.map(tweet => createTweetCard(tweet)).join('');
        }

        // Display my contributions
        const myContributionsContainer = document.getElementById('my-contributions');
        if (myContributions && myContributions.twitter) {
            const { twitter } = myContributions;
            
            // Create profile section
            const profileHtml = `
                <div class="contributor-profile">
                    <img src="${twitter.profile_image_url}" alt="${twitter.name}" class="profile-image">
                    <div class="profile-info">
                        <h3>${twitter.name}</h3>
                        <p class="username">@${twitter.username}</p>
                        <p class="bio">${twitter.bio}</p>
                    </div>
                </div>
            `;

            // Create tweets section
            const tweetsHtml = twitter.contributions.map(tweet => createTweetCard(tweet)).join('');

            // Create artwork section
            const artworkHtml = `
                <div class="artwork-container">
                    <h3>My Artwork</h3>
                    <div class="artwork-grid">
                        ${twitter.artwork.map(art => `
                            <div class="artwork-item">
                                <img src="${art.image_url}" alt="${art.title}">
                                <h4>${art.title}</h4>
                                <p>${art.description}</p>
                                <span class="date">${new Date(art.created_at).toLocaleDateString()}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            myContributionsContainer.innerHTML = profileHtml + tweetsHtml + artworkHtml;
        }
    } catch (error) {
        console.error('Error initializing feeds:', error);
    }
}

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeFeeds();
    initializeAffiliates();
}); 