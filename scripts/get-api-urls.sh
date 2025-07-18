#!/bin/bash

echo "🔗 Getting API URLs for different deployment scenarios..."

echo ""
echo "📍 LOCAL DEVELOPMENT:"
echo "REACT_APP_API_BASE_URL=http://localhost:5000/api"
echo ""

echo "📍 RENDER DEPLOYMENT:"
echo "1. Deploy your backend to Render first"
echo "2. Your API URL will be: https://your-service-name.onrender.com/api"
echo "3. Replace 'your-service-name' with your actual Render service name"
echo ""

echo "📍 HEROKU DEPLOYMENT:"
echo "REACT_APP_API_BASE_URL=https://your-app-name.herokuapp.com/api"
echo ""

echo "📍 RAILWAY DEPLOYMENT:"
echo "REACT_APP_API_BASE_URL=https://your-app-name.up.railway.app/api"
echo ""

echo "📍 VERCEL (for API routes):"
echo "REACT_APP_API_BASE_URL=https://your-vercel-app.vercel.app/api"
echo ""

echo "🔧 How to find your Render URL:"
echo "1. Go to https://dashboard.render.com"
echo "2. Click on your backend service"
echo "3. Copy the URL from the service dashboard"
echo "4. Add '/api' at the end"
