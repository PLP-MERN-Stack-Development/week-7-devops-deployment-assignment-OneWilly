# MERN Stack Production Deployment

A comprehensive guide for deploying a MERN (MongoDB, Express, React, Node.js) application to production using Render (backend) and Vercel (frontend).

## 🚀 Live Applications

- **Frontend**: [https://your-app.vercel.app](https://your-app.vercel.app)
- **Backend API**: [https://your-api.onrender.com](https://your-api.onrender.com)
- **Health Check**: [https://your-api.onrender.com/health](https://your-api.onrender.com/health)

## 📋 Prerequisites

- Node.js 18+
- MongoDB Atlas account
- GitHub account
- Render account
- Vercel account

## 🛠 Local Development Setup

1. **Clone the repository**
   \`\`\`bash
   git clone https://week-7-devops-deployment-assignment-OneWilly.git
   cd mern-deployment
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   # Backend
   cd server && npm install
   
   # Frontend
   cd ../client && npm install
   \`\`\`

3. **Environment Configuration**
   \`\`\`bash
   # Backend
   cp server/.env.example server/.env
   
   # Frontend
   cp client/.env.example client/.env.local
   \`\`\`

4. **Start development servers**
   \`\`\`bash
   # Backend (Terminal 1)
   cd server && npm run dev
   
   # Frontend (Terminal 2)
   cd client && npm start
   \`\`\`

## 🏗 Deployment Architecture

```mermaid
graph TD
    A[Developer] -->|Push Code| B[GitHub Repository]
    B -->|Webhook| C[GitHub Actions]
    C -->|Run Tests| D{Tests Pass?}
    D -->|Yes| E[Deploy Backend to Render]
    D -->|Yes| F[Deploy Frontend to Vercel]
    D -->|No| G[Deployment Failed]
    E --> H[Backend API]
    F --> I[React Frontend]
    H --> J[MongoDB Atlas]
    I --> H
    K[Users] --> I
