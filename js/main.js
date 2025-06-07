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

    // Initialize all sections
    initializeNewsFeed();
    initializeThreadors();
    initializeAffiliates();

    // Set up auto-refresh for dynamic content
    setInterval(() => {
        updateNewsFeed();
        updateThreadors();
    }, refreshInterval);
});

function renderContributions(contributions) {
    const container = document.getElementById('contributions-container');
    if (!container) {
        console.error('Contributions container not found!');
        return;
    }

    contributions.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'contribution-item';
        // Add staggered animation delay
        div.style.animationDelay = `${index * 100}ms`;
        
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = `${item.title}: `;
        p.appendChild(strong);
        p.append(item.description);

        div.appendChild(p);
        container.appendChild(div);
    });
}

// News Feed Functions
async function initializeNewsFeed() {
    await updateNewsFeed();
}

async function updateNewsFeed() {
    const container = document.querySelector('.news-container');
    if (!container) return;

    showLoading(container, 'Loading news feed...');

    try {
        const tweets = await fetchNewsFeed();
        renderNewsFeed(tweets);
    } catch (error) {
        showError(container, 'Failed to load news feed. Please try again later.');
    }
}

function renderNewsFeed(news) {
    const container = document.querySelector('.news-container');
    if (!container) return;

    container.innerHTML = '';
    
    if (!news.length) {
        showError(container, 'No news available at the moment.');
        return;
    }
    
    news.forEach((item, index) => {
        const newsCard = document.createElement('div');
        newsCard.className = 'tweet-card';
        newsCard.style.animationDelay = `${index * 100}ms`;
        
        newsCard.innerHTML = `
            <div class="tweet-header">
                <img src="${item.author.profile_image_url}" alt="${item.author.name}" class="tweet-avatar">
                <div class="tweet-author-info">
                    <p class="tweet-author-name">${item.author.name}</p>
                    <p class="tweet-author-handle">@${item.author.username}</p>
                </div>
            </div>
            <p class="tweet-text">${formatTweetText(item.text)}</p>
            <p class="tweet-time">${formatDate(item.created_at)}</p>
        `;
        
        container.appendChild(newsCard);
    });
}

// Threadors Functions
async function initializeThreadors() {
    await updateThreadors();
}

async function updateThreadors() {
    const container = document.querySelector('.threadors-container');
    if (!container) return;

    showLoading(container, 'Loading threads...');

    try {
        const threads = await fetchThreadors();
        renderThreadors(threads);
    } catch (error) {
        showError(container, 'Failed to load threads. Please try again later.');
    }
}

function renderThreadors(threads) {
    const container = document.querySelector('.threadors-container');
    if (!container) return;

    container.innerHTML = '';
    
    if (!threads.length) {
        showError(container, 'No threads available at the moment.');
        return;
    }
    
    threads.forEach((thread, index) => {
        const threadCard = document.createElement('div');
        threadCard.className = 'threador-card';
        threadCard.style.animationDelay = `${index * 100}ms`;
        
        threadCard.innerHTML = `
            <div class="tweet-header">
                <img src="${thread.author.profile_image_url}" alt="${thread.author.name}" class="tweet-avatar">
                <div class="tweet-author-info">
                    <p class="tweet-author-name">${thread.author.name}</p>
                    <p class="tweet-author-handle">@${thread.author.username}</p>
                </div>
            </div>
            <p class="tweet-text">${formatTweetText(thread.text)}</p>
            <p class="tweet-time">${formatDate(thread.created_at)}</p>
        `;
        
        threadCard.addEventListener('click', () => {
            window.open(`https://x.com/${thread.author.username}/status/${thread.id}`, '_blank');
        });
        
        container.appendChild(threadCard);
    });
}

// Affiliates Functions
function initializeAffiliates() {
    const affiliates = [
        {
            name: "Ashu Arts",
            handle: "Ashu__Arts",
            avatar: "https://unavatar.io/twitter/Ashu__Arts",
            bio: "Digital Artist | NFT Creator | Sign Protocol Community Artist",
            followers: "5K+",
            role: "Community Artist",
            isFollowed: false
        },
        {
            name: "Robert Lazy",
            handle: "RobertLazy23",
            avatar: "https://unavatar.io/twitter/RobertLazy23",
            bio: "Web3 Developer | Sign Protocol Contributor | Building the future of attestations",
            followers: "3K+",
            role: "Core Contributor",
            isFollowed: false
        },
        {
            name: "Biggids",
            handle: "_biggids",
            avatar: "https://unavatar.io/twitter/_biggids",
            bio: "DeFi Researcher | Sign Protocol Contributor | Exploring the intersection of attestations and finance",
            followers: "8.5K",
            role: "DeFi Specialist",
            isFollowed: false
        },
        {
            name: "Tajudeen",
            handle: "tajudeen_10",
            avatar: "https://unavatar.io/twitter/tajudeen_10",
            bio: "Smart Contract Developer | Sign Protocol Security Expert | Building secure attestations",
            followers: "11.4K",
            role: "Security Lead",
            isFollowed: false
        },
        {
            name: "Mubi",
            handle: "mubi_crypt",
            avatar: "https://unavatar.io/twitter/mubi_crypt",
            bio: "Crypto Enthusiast | Sign Protocol Community Member | Web3 Explorer",
            followers: "2K+",
            role: "Community Lead",
            isFollowed: false
        }
    ];
    
    renderAffiliates(affiliates);
}

function renderAffiliates(affiliates) {
    const container = document.querySelector('.affiliates-container');
    if (!container) return;

    container.innerHTML = '';
    
    if (!affiliates.length) {
        showError(container, 'No affiliates available.');
        return;
    }
    
    affiliates.forEach((affiliate, index) => {
        const affiliateCard = document.createElement('div');
        affiliateCard.className = 'affiliate-card';
        affiliateCard.style.animationDelay = `${index * 100}ms`;
        
        affiliateCard.innerHTML = `
            <div class="affiliate-main">
                <img src="${affiliate.avatar}" alt="${affiliate.name}" class="affiliate-avatar">
                <div class="affiliate-info">
                    <div class="affiliate-header">
                        <div class="affiliate-names">
                            <p class="affiliate-name">${affiliate.name}</p>
                            <p class="affiliate-handle">@${affiliate.handle}</p>
                        </div>
                        <span class="affiliate-role">${affiliate.role}</span>
                    </div>
                    <p class="affiliate-bio">${affiliate.bio}</p>
                    <div class="affiliate-stats">
                        <span class="affiliate-followers">
                            <i class="fas fa-users"></i> ${affiliate.followers} followers
                        </span>
                    </div>
                </div>
            </div>
            <div class="affiliate-actions">
                <a href="https://twitter.com/intent/follow?screen_name=${affiliate.handle}" 
                   class="follow-button" 
                   target="_blank"
                   rel="noopener noreferrer"
                   onclick="event.stopPropagation();">
                    <i class="fab fa-twitter"></i> Follow
                </a>
                <a href="https://twitter.com/${affiliate.handle}" 
                   class="profile-button"
                   target="_blank"
                   rel="noopener noreferrer"
                   onclick="event.stopPropagation();">
                    <i class="fas fa-external-link-alt"></i> Profile
                </a>
            </div>
        `;
        
        container.appendChild(affiliateCard);
    });
}

// Utility Functions
function showLoading(container, message = 'Loading...') {
    container.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>${message}</p>
        </div>
    `;
}

function showError(container, message) {
    container.innerHTML = `
        <div class="error-state">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
            <button class="retry-button" onclick="location.reload()">
                <i class="fas fa-redo"></i> Retry
            </button>
        </div>
    `;
}

// Image Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.modal-close');
    
    // Get all artwork items
    const artworkItems = document.querySelectorAll('.artwork-item');
    
    // Add click event to each artwork item
    artworkItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const title = this.querySelector('h4').textContent;
            const description = this.querySelector('p').textContent;
            
            modalImg.src = img.src;
            modalCaption.textContent = `${title} - ${description}`;
            
            // Show modal with animation
            modal.style.display = 'block';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            
            // Prevent body scrolling when modal is open
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal when clicking the close button
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal when pressing ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            // Re-enable body scrolling
            document.body.style.overflow = '';
        }, 300);
    }
});

// Main JavaScript file for the Sign Protocol Community Website
// More functionality will be added progressively. 