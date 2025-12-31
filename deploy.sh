#!/bin/bash

# WebP Converter - Vercel Deployment Script
# This script prepares and deploys the application to Vercel

echo "🚀 Starting deployment process..."
echo ""

# Step 1: Clean install dependencies
echo "📦 Step 1: Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed successfully"
echo ""

# Step 2: Build the project
echo "🔨 Step 2: Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build completed successfully"
echo ""

# Step 3: Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "⚠️  Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Step 4: Deploy to Vercel
echo "🌐 Step 3: Deploying to Vercel..."
echo ""
echo "Choose deployment option:"
echo "1) Production deployment"
echo "2) Preview deployment"
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo "Deploying to production..."
    vercel --prod
elif [ "$choice" = "2" ]; then
    echo "Creating preview deployment..."
    vercel
else
    echo "Invalid choice. Exiting."
    exit 1
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Note: Test your download functionality at the deployed URL"
echo "   - Try single image download"
echo "   - Try downloading all as ZIP"
echo "   - Check browser console for any errors"
