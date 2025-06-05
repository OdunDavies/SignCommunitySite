console.log('twitter.js loaded successfully!');

// JavaScript file for fetching and displaying tweets

const mockTweetData = [
    {
        author: '@CommunityUser1',
        text: 'Just discovered @ethsign! Looks like a fantastic project. Excited to see what they build next. #crypto #web3',
        timestamp: '2024-07-28T10:00:00Z'
    },
    {
        author: '@EthSignFan',
        text: 'The transparency @ethsign brings to agreements is a game changer. Highly recommend checking them out!',
        timestamp: '2024-07-28T10:15:00Z'
    },
    {
        author: '@DevContributor',
        text: 'Working on some cool integrations with the EthSign protocol. The documentation is super clear! #dev #blockchain',
        timestamp: '2024-07-28T10:30:00Z'
    },
    {
        author: '@CryptoNewbie',
        text: 'How does @ethsign compare to other signing platforms? The community seems really active!',
        timestamp: '2024-07-28T10:45:00Z'
    }
];

// This function now simulates a network request.
// It's asynchronous and returns a Promise.
async function fetchTweets() {
    console.log('Simulating a real API fetch...');
    // In a real application, this would be:
    // const response = await fetch('https://your-backend-proxy.com/api/tweets');
    // const data = await response.json();
    // return data;

    // For now, we simulate a network delay and return shuffled mock data.
    return new Promise(resolve => {
        setTimeout(() => {
            // Shuffle the array to simulate new content
            const shuffledTweets = mockTweetData.sort(() => 0.5 - Math.random());
            resolve(shuffledTweets.slice(0, 3)); // Return 3 random tweets
        }, 500); // 500ms network delay simulation
    });
}

function renderTweets(tweets) {
    const container = document.querySelector('.tweet-card-container');
    if (!container) {
        console.error('Tweet container not found!');
        return;
    }
    
    container.innerHTML = ''; // Clear existing tweets

    tweets.forEach(tweet => {
        const card = document.createElement('div');
        card.className = 'tweet-card';

        const author = document.createElement('p');
        author.className = 'tweet-author';
        author.textContent = tweet.author;

        const text = document.createElement('p');
        text.textContent = tweet.text;

        const time = document.createElement('p');
        time.className = 'tweet-time';
        time.textContent = new Date(tweet.timestamp).toLocaleString();

        card.appendChild(author);
        card.appendChild(text);
        card.appendChild(time);
        container.appendChild(card);
    });
}

// More functionality will be added progressively. 