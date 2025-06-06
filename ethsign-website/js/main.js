document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    console.log('main.js initialized successfully!');

    const refreshInterval = 900000; // 15 minutes (15 * 60 * 1000)

    async function updateTweets() {
        console.log('Refreshing tweets...');
        const tweets = await fetchTweets(); // Await the promise
        renderTweets(tweets);
    }

    // Initial load of tweets
    updateTweets();

    // Set up auto-refresh
    setInterval(updateTweets, refreshInterval);
});

// Main JavaScript file for the Sign Protocol Community Website
// More functionality will be added progressively. 