# API URL Setup Guide

## 🎯 Quick Setup

### 1. Local Development
\`\`\`bash
# client/.env.local
REACT_APP_API_BASE_URL=http://localhost:5000/api
\`\`\`

### 2. Production Deployment

#### Option A: Deploy Backend First (Recommended)
1. Deploy your backend to Render/Heroku/Railway
2. Get the deployment URL
3. Set the environment variable

#### Option B: Use the Setup Script
\`\`\`bash
cd scripts
node setup-environment.js
\`\`\`

## 🚀 Platform-Specific URLs

### Render.com
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Create a new Web Service
3. Connect your GitHub repo (server folder)
4. Your URL will be: `https://your-service-name.onrender.com`
5. Set: `REACT_APP_API_BASE_URL=https://your-service-name.onrender.com/api`

### Heroku
1. Create app: `heroku create your-app-name`
2. Your URL: `https://your-app-name.herokuapp.com`
3. Set: `REACT_APP_API_BASE_URL=https://your-app-name.herokuapp.com/api`

### Railway
1. Deploy to Railway
2. Your URL: `https://your-app-name.up.railway.app`
3. Set: `REACT_APP_API_BASE_URL=https://your-app-name.up.railway.app/api`

## 🔧 Environment File Examples

### Development (.env.local)
\`\`\`env
REACT_APP_API_BASE_URL=http://localhost:5000/api
\`\`\`

### Production (.env.production)
\`\`\`env
REACT_APP_API_BASE_URL=https://mern-task-backend.onrender.com/api
GENERATE_SOURCEMAP=false
\`\`\`

## 🧪 Testing Your API URL

Add this to your React app to test the connection:

\`\`\`javascript
// In your component
import { testApiConnection } from '../utils/apiUrlHelper'

useEffect(() => {
  testApiConnection().then(result => {
    console.log('API Test Result:', result)
  })
}, [])
\`\`\`

## 🚨 Common Issues

### Issue: CORS Error
**Solution:** Make sure your backend CORS_ORIGIN matches your frontend URL

### Issue: 404 Not Found
**Solution:** Check if `/api` is included in the URL

### Issue: Connection Refused
**Solution:** Verify your backend is deployed and running

## 📝 Step-by-Step Render Deployment

1. **Create Render Account**: Go to render.com
2. **New Web Service**: Click "New" → "Web Service"
3. **Connect GitHub**: Link your repository
4. **Configure Service**:
   - Name: `mern-task-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. **Add Environment Variables**:
   - `NODE_ENV=production`
   - `MONGO_URI=your_mongodb_uri`
   - `JWT_SECRET=your_secret`
   - `PORT=10000`
6. **Deploy**: Click "Create Web Service"
7. **Get URL**: Copy from dashboard (e.g., `https://mern-task-backend.onrender.com`)
8. **Set Frontend URL**: `REACT_APP_API_BASE_URL=https://mern-task-backend.onrender.com/api`

## 🔄 Dynamic URL Detection

For advanced setups, use the `apiUrlHelper.js` to automatically detect the correct URL based on your deployment environment.
