#!/bin/bash

echo "🚀 Setting up AWS Amplify for Software Releases Tracker"
echo "=================================================="

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first:"
    echo "   https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check if AWS is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

# Check if Amplify CLI is installed
if ! command -v amplify &> /dev/null; then
    echo "📦 Installing AWS Amplify CLI..."
    npm install -g @aws-amplify/cli
fi

echo "✅ Prerequisites check passed!"

# Check if amplify is already initialized
if [ ! -d ".amplify" ]; then
    echo "🔧 Initializing Amplify project..."
    amplify init --yes
else
    echo "✅ Amplify project already initialized"
fi

echo "📊 Deploying backend..."
amplify push --yes

echo "📄 Generating frontend configuration..."
amplify gen

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Open http://localhost:5173 in your browser"
echo "3. The app will now use the deployed backend for data"
echo ""
echo "To deploy to production:"
echo "1. Run 'npm run build'"
echo "2. Run 'amplify publish'"
echo ""
echo "Happy coding! 🚀"