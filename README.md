# Software Releases Tracker

A modern React application for tracking software releases with AWS Amplify backend integration.

## Features

- 📊 Beautiful table display of software releases
- 🎨 Modern, responsive UI with hover effects
- ☁️ AWS Amplify backend integration (optional)
- 📱 Mobile-friendly design
- 🚀 Ready for production deployment

## Table Columns

- **Main Version**: The primary version number (e.g., "2.1.0")
- **Go Live Date**: Release date in YYYY-MM-DD format
- **Framework Version**: Framework and version (e.g., "React 18.2.0")
- **Released**: Status indicator (✅ Released / ⏳ Pending)

## Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

The app will run with static demo data by default.

## AWS Amplify Setup

### Prerequisites

- AWS CLI installed and configured
- Node.js 18+ and npm
- AWS Amplify CLI installed: `npm install -g @aws-amplify/cli`

### Backend Deployment

1. **Initialize Amplify (if not already done):**
   ```bash
   amplify init
   ```

2. **Deploy the backend:**
   ```bash
   amplify push
   ```

3. **Generate outputs file:**
   ```bash
   amplify gen
   ```

This will create the `amplify_outputs.json` file needed for the frontend to connect to the backend.

### Frontend Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy to AWS Amplify:**
   ```bash
   amplify publish
   ```

Or connect your repository to AWS Amplify Console for automatic deployments.

## Data Management

### Static Demo Data

The app includes 7 rows of demo data that will display immediately. This data includes:
- Various React framework versions
- Mix of released and pending statuses
- Realistic version numbers and dates

### Dynamic Data (with Amplify)

When the backend is deployed and `amplify_outputs.json` is available, the app will:
1. Attempt to load data from the AWS Amplify backend
2. Fall back to static demo data if no backend data exists
3. Display any data found in the backend

### Adding New Releases

To add new releases to the backend:

```javascript
// Using the Amplify client
await client.models.SoftwareRelease.create({
  mainVersion: "2.4.0",
  goLiveDate: "2024-05-01",
  frameworkVersion: "React 19.1.0",
  released: false
});
```

## Project Structure

```
├── src/
│   ├── App.tsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── amplify/
│   ├── backend.ts       # Backend configuration
│   ├── data/
│   │   └── resource.ts  # Data schema definition
│   └── auth/
│       └── resource.ts  # Authentication configuration
├── amplify.yml          # Amplify build configuration
└── package.json         # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: CSS3 with modern design patterns
- **Backend**: AWS Amplify (DynamoDB, AppSync, Lambda)
- **Authentication**: AWS Cognito (configured but optional)
- **Deployment**: AWS Amplify Console

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.