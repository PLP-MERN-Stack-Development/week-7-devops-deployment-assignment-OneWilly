#!/bin/bash

# MERN Deployment Script
set -e

echo "🚀 Starting MERN deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required environment variables are set
check_env_vars() {
    print_status "Checking environment variables..."
    
    required_vars=("MONGO_URI" "JWT_SECRET" "RENDER_API_KEY" "VERCEL_TOKEN")
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            print_error "Environment variable $var is not set"
            exit 1
        fi
    done
    
    print_status "All required environment variables are set ✓"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    # Backend tests
    cd server
    npm test
    cd ..
    
    # Frontend tests
    cd client
    npm test -- --coverage --watchAll=false
    cd ..
    
    print_status "All tests passed ✓"
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    cd client
    npm run build
    cd ..
    print_status "Frontend build completed ✓"
}

# Deploy to production
deploy() {
    print_status "Deploying to production..."
    
    # Deploy backend to Render
    print_status "Deploying backend to Render..."
    curl -X POST \
        -H "Authorization: Bearer $RENDER_API_KEY" \
        -H "Content-Type: application/json" \
        "https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys"
    
    # Deploy frontend to Vercel
    print_status "Deploying frontend to Vercel..."
    cd client
    npx vercel --prod --token $VERCEL_TOKEN
    cd ..
    
    print_status "Deployment completed ✓"
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    # Wait for deployment to be ready
    sleep 30
    
    # Check backend health
    backend_health=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/health")
    if [ "$backend_health" -eq 200 ]; then
        print_status "Backend health check passed ✓"
    else
        print_error "Backend health check failed (HTTP $backend_health)"
        exit 1
    fi
    
    # Check frontend
    frontend_health=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
    if [ "$frontend_health" -eq 200 ]; then
        print_status "Frontend health check passed ✓"
    else
        print_error "Frontend health check failed (HTTP $frontend_health)"
        exit 1
    fi
}

# Main deployment flow
main() {
    print_status "Starting deployment process..."
    
    check_env_vars
    run_tests
    build_frontend
    deploy
    health_check
    
    print_status "🎉 Deployment completed successfully!"
    print_status "Backend: $BACKEND_URL"
    print_status "Frontend: $FRONTEND_URL"
}

# Run main function
main "$@"
