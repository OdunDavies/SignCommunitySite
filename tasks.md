```markdown
# EthSign Website MVP: Granular Step-by-Step Build Plan

Each task below is **atomic, testable, and focused on a single concern**. After each, you can verify the result in the browser or by inspecting the code.

---

## 1. Project Setup

### 1.1. Create Project Directory
- **Start:** No project folder exists.
- **End:** `/ethsign-website/` directory exists.

### 1.2. Create Initial File Structure
- **Start:** Empty project directory.
- **End:** `/assets/css/`, `/assets/images/`, `/js/`, `/data/` folders and `index.html` exist.

---

## 2. Static Home Page

### 2.1. Create Basic `index.html` Skeleton
- **Start:** Empty `index.html`.
- **End:** `index.html` with `<!DOCTYPE html>`, `<head>`, and `<body>`.

### 2.2. Add Project Description Section
- **Start:** Basic HTML skeleton.
- **End:** Section with project name, description, and placeholder for social links.

### 2.3. Add Social Media Links Section
- **Start:** Project description present.
- **End:** Social media links (Twitter, Discord, etc.) as anchor tags with placeholder icons.

### 2.4. Add Community Tweets Section Placeholder
- **Start:** Social links present.
- **End:** Empty `<section>` or `<div>` with an ID for tweets.

### 2.5. Add Contributions Section Placeholder
- **Start:** Tweets section present.
- **End:** Empty `<section>` or `<div>` with an ID for contributions.

---

## 3. Styling

### 3.1. Create `styles.css` and Link to HTML
- **Start:** No CSS.
- **End:** `/assets/css/styles.css` exists and is linked in `index.html`.

### 3.2. Style Project Description and Social Links
- **Start:** Unstyled HTML.
- **End:** Project description and social links styled for clarity and branding.

### 3.3. Style Tweets Section (Card Layout)
- **Start:** Tweets section unstyled.
- **End:** Tweets section styled as a card grid/list.

### 3.4. Style Contributions Section
- **Start:** Contributions section unstyled.
- **End:** Contributions section styled to match site theme.

---

## 4. JavaScript: Page Initialization

### 4.1. Create `main.js` and Link to HTML
- **Start:** No JS.
- **End:** `/js/main.js` exists and is linked in `index.html`.

### 4.2. Add DOMContentLoaded Event Listener
- **Start:** Empty `main.js`.
- **End:** JS runs code after DOM is loaded (test with `console.log`).

---

## 5. Tweets Section: Dynamic Content

### 5.1. Create `twitter.js` and Link to HTML
- **Start:** No `twitter.js`.
- **End:** `/js/twitter.js` exists and is linked in `index.html`.

### 5.2. Add Function to Fetch Tweets (Mock Data)
- **Start:** Empty `twitter.js`.
- **End:** Function returns an array of mock tweet objects.

### 5.3. Render Tweets as Cards
- **Start:** Mock data function exists.
- **End:** Tweets section displays cards for each mock tweet.

### 5.4. Implement Auto-Refresh (10s) with Mock Data
- **Start:** Tweets render once.
- **End:** Tweets section re-renders every 10 seconds with (possibly new) mock data.

### 5.5. Replace Mock Data with Real Fetch (if possible)
- **Start:** Mock data in use.
- **End:** Tweets fetched from X.com API or backend proxy (test with real data).

---

## 6. Contributions Section

### 6.1. Add Static Contributions Content
- **Start:** Empty contributions section.
- **End:** Section lists your contributions (hardcoded in HTML).

### 6.2. (Optional) Load Contributions from JSON
- **Start:** Static content in HTML.
- **End:** `/data/contributions.json` exists, JS loads and renders it.

---

## 7. Final Touches

### 7.1. Add Images/Icons to `/assets/images/`
- **Start:** Placeholder or no images.
- **End:** Real icons/logos in use.

### 7.2. Test Responsiveness
- **Start:** Desktop-only layout.
- **End:** Site looks good on mobile and desktop.

### 7.3. Manual QA: Test All Sections
- **Start:** All features implemented.
- **End:** All sections work, auto-refresh functions, links open, content displays as expected.

---

**You can now assign each task to an engineering LLM, one at a time, and verify after each step!**
```

