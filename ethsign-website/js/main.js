document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    console.log('main.js initialized successfully!');

    // Load contributions from the global variable
    if (typeof contributionData !== 'undefined') {
        renderContributions(contributionData);
    } else {
        console.error('Contribution data not found!');
    }

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

function renderContributions(contributions) {
    const container = document.getElementById('contributions-container');
    if (!container) {
        console.error('Contributions container not found!');
        return;
    }

    contributions.forEach(item => {
        const div = document.createElement('div');
        div.className = 'contribution-item';
        
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = `${item.title}: `;
        p.appendChild(strong);
        p.append(item.description); // Appends the description text node

        div.appendChild(p);
        container.appendChild(div);
    });
}

// Main JavaScript file for the EthSign Community Website
// More functionality will be added progressively. 