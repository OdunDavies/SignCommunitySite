# Sign Protocol Community Hub - Setup Guide

This guide will walk you through setting up the Sign Protocol Community Hub website with Twitter API integration.

## Prerequisites

1. Node.js (v14 or higher)
2. npm (comes with Node.js)
3. Python 3 (for local development server)
4. A Twitter Developer Account

## Step 1: Twitter Developer Account Setup

1. Visit [Twitter Developer Portal](https://developer.twitter.com/en/portal/petition/essential/basic-info)
2. Sign in with your Twitter account
3. Apply for a Developer Account:
   - Select "Making a bot" as your use case
   - Provide project description: "Building a community hub for Sign Protocol"
   - Agree to Twitter's terms of service

4. Once approved, create a new Project:
   - Go to Developer Portal Dashboard
   - Click "Create Project"
   - Name it "Sign Protocol Community Hub"
   - Select "Production" as environment
   - Get your Bearer Token (save this for later)

## Step 2: Project Setup

1. Clone the repository (if you haven't already):
   ```bash
   git clone <repository-url>
   cd sign
   ```

2. Create the backend directory and initialize:
   ```bash
   mkdir backend
   cd backend
   npm init -y
   ```

3. Install backend dependencies:
   ```bash
   npm install express cors axios dotenv
   ```

4. Create environment file:
   ```bash
   # In the backend directory
   echo "TWITTER_BEARER_TOKEN=your_bearer_token_here" > .env
   ```
   Replace `your_bearer_token_here` with the Bearer Token from Twitter

## Step 3: Backend Server Setup

1. Create the server file (if not already created):
   ```bash
   # In the backend directory
   touch server.js
   ```

2. Add the server code to `server.js` (already provided in previous steps)

3. Start the backend server:
   ```bash
   # In the backend directory
   node server.js
   ```

   You should see: "Server running on port 3000"

## Step 4: Frontend Setup

1. Start the frontend server:
   ```bash
   # In the root directory
   python -m http.server 8000
   ```

2. Verify the servers are running:
   - Backend: http://localhost:3000
   - Frontend: http://localhost:8000

## Step 5: Testing the Integration

1. Open your browser's Developer Tools (F12)
2. Go to http://localhost:8000
3. Check the Console tab for any errors
4. Verify that affiliate cards are loading with real Twitter data

## Common Issues and Solutions

### CORS Errors
If you see CORS errors in the console:
1. Verify the backend server is running
2. Check that the CORS middleware is properly configured
3. Ensure the frontend is using the correct backend URL

### Twitter API Errors
If Twitter data isn't loading:
1. Verify your Bearer Token is correct in `.env`
2. Check the rate limits in Twitter Developer Portal
3. Look for error messages in the backend console

### Loading State Issues
If the loading state persists:
1. Check network requests in Developer Tools
2. Verify the backend endpoints are responding
3. Check for JavaScript errors in the console

## Development Workflow

1. Making Changes:
   - Frontend files are served from the root directory
   - Backend runs from the `/backend` directory
   - CSS changes take effect immediately
   - JavaScript changes require page refresh

2. Testing Changes:
   ```bash
   # Terminal 1 (Frontend)
   python -m http.server 8000

   # Terminal 2 (Backend)
   cd backend
   node server.js
   ```

3. Debugging:
   - Use `console.log()` in frontend code
   - Check backend logs in terminal
   - Use browser Developer Tools

## Project Structure

```
sign/
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── images/
├── js/
│   ├── main.js
│   └── twitter.js
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
├── index.html
└── SETUP.md
```

## Environment Variables

Create a `.env` file in the backend directory with these variables:
```env
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
PORT=3000
```

## Security Notes

1. Never commit the `.env` file
2. Keep your Bearer Token secure
3. Use environment variables for sensitive data
4. Monitor Twitter API usage

## Deployment Considerations

1. Backend:
   - Choose a hosting provider (e.g., Render, Heroku)
   - Set environment variables in hosting platform
   - Enable CORS for your frontend domain

2. Frontend:
   - Deploy static files to hosting service
   - Update API base URL for production
   - Enable HTTPS

## Updating Twitter Data

The website will:
- Fetch real-time Twitter data
- Update affiliate information automatically
- Cache data to respect rate limits
- Show loading states during updates

## Need Help?

If you encounter issues:
1. Check the error messages in console
2. Verify all prerequisites are met
3. Ensure all environment variables are set
4. Check Twitter API status
5. Review network requests in Developer Tools

## Next Steps

After setup:
1. Customize the design
2. Add more features
3. Optimize performance
4. Implement analytics
5. Add error tracking 