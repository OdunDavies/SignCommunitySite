```markdown
# EthSign Community Website Architecture

This document outlines the architecture for a website dedicated to the crypto project **@ethsign**. The site will feature a project description, social links, live community tweets, and a section about your personal contributions. The stack is **HTML, CSS, and JavaScript** (vanilla, no frameworks).

---

## 1. File & Folder Structure

```
/ethsign-website/
│
├── /assets/
│   ├── /images/           # Project logos, icons, etc.
│   └── /css/
│       └── styles.css     # Main stylesheet
│
├── /js/
│   ├── main.js            # Main JS for DOM, state, and automation
│   └── twitter.js         # Handles fetching and rendering tweets
│
├── index.html             # Home page
├── README.md              # Project documentation
└── /data/
    └── contributions.json # (Optional) Your contributions, if not hardcoded
```

---

## 2. What Each Part Does

### `/index.html`
- The main entry point.
- Contains the structure for:
  - Project description and social links
  - Community tweets section (cards, auto-refresh)
  - Your contributions section

### `/assets/css/styles.css`
- All site styling: layout, cards, responsiveness, colors, etc.

### `/assets/images/`
- Logos, favicons, social media icons, etc.

### `/js/main.js`
- Handles:
  - Page initialization
  - State management (current tweets, refresh timers)
  - DOM updates for all sections except tweets

### `/js/twitter.js`
- Handles:
  - Fetching tweets from the EthSign community page (via Twitter/X API or scraping)
  - Parsing and formatting tweet data
  - Rendering tweet cards
  - Auto-refresh logic (every 10 seconds)
  - Error handling for fetch failures

### `/data/contributions.json` (Optional)
- If you want to keep your contributions in a separate, easily editable file.
- Otherwise, this can be hardcoded in `index.html` or `main.js`.

---

## 3. State Management

- **State lives in `main.js`** as JS objects/arrays.
- Example:
  - `let tweets = [];` — holds the latest fetched tweets.
  - `let refreshInterval = 10000;` — 10 seconds for auto-refresh.
- State is updated by fetches in `twitter.js` and triggers DOM updates.

---

## 4. Services & Connections

- **Fetching Tweets:**
  - Ideally, use the Twitter/X API to fetch community tweets.
  - If API access is not available, consider using a backend proxy or scraping (note: scraping X.com is brittle and may violate TOS).
  - Tweets are fetched by `twitter.js`, parsed, and passed to the main state.

- **Social Links:**
  - Static links in the HTML, styled with icons.

- **Contributions:**
  - Static section, or loaded from `/data/contributions.json`.

---

## 5. Section Breakdown

### 1. Project Description & Social Links
- Static HTML.
- Social links: Twitter, Discord, Telegram, etc.

### 2. Community Tweets & Works
- Dynamic cards, rendered by JS.
- Auto-refreshes every 10 seconds.
- Each card: user avatar, handle, tweet content, timestamp, media (if any).

### 3. Your Contributions
- Static or loaded from JSON.
- List or card format.

---

## 6. Example File Structure Tree

```
ethsign-website/
├── assets/
│   ├── images/
│   │   ├── ethsign-logo.png
│   │   └── twitter-icon.svg
│   └── css/
│       └── styles.css
├── js/
│   ├── main.js
│   └── twitter.js
├── data/
│   └── contributions.json
├── index.html
└── README.md
```

---

## 7. Notes

- **Twitter/X API**: To fetch tweets, you’ll need API credentials. If you don’t have access, you may need a backend service or a third-party API.
- **No frameworks**: All logic is in vanilla JS for clarity and portability.
- **Responsiveness**: Use CSS Flexbox/Grid for mobile-friendly design.
- **Security**: Never expose API keys in frontend JS. If needed, use a backend proxy.

---

## 8. Diagram

```
[ index.html ]
      |
      v
[ main.js ] <----> [ twitter.js ] <----> [ X.com API or Scraper ]
      |
      v
[ styles.css ]
      |
      v
[ images, icons ]
      |
      v
[ contributions.json ]
```

---

## 9. How Everything Connects

- `index.html` loads `main.js` and `twitter.js`.
- `main.js` initializes the page, loads static content, and manages state.
- `twitter.js` fetches tweets, updates state, and triggers re-rendering of the tweet cards.
- CSS and images provide styling and branding.
- Contributions are either hardcoded or loaded from JSON.

---

**Ready to start coding? Let me know if you want a starter template or code for any section!**
```

