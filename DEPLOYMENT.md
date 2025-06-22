# FoodPrint Deployment Guide

## Prerequisites

1. Node.js 18+ installed
2. Firebase project set up
3. Vercel account
4. Git repository

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# App Configuration
VITE_APP_NAME=FoodPrint
VITE_APP_VERSION=1.0.0
```

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Authentication with Google provider
4. Enable Firestore Database
5. Get your Firebase config from Project Settings > General > Your apps
6. Copy the config values to your `.env` file

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Deployment to Vercel

### Method 1: Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Set environment variables in Vercel dashboard or via CLI:
```bash
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID
```

### Method 2: GitHub Integration

1. Push your code to GitHub (make sure `.env` is in `.gitignore`)
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables in the deployment settings:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
6. Deploy

## Environment Variables for Vercel

In your Vercel project settings, add these environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase API Key | `AIzaSyC...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | `your-project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `your-project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | `123456789` |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | `1:123:web:abc123` |

## Build Configuration

The project uses Vite for building. The build configuration is in `vite.config.ts`:

- Output directory: `dist`
- Build command: `npm run build`
- Dev command: `npm run dev`

## Domain Configuration

After deployment:

1. Configure your custom domain in Vercel dashboard
2. Update Firebase Auth domain settings to include your new domain
3. Update CORS settings if needed

## Troubleshooting

### Build Errors

1. Check that all environment variables are set correctly
2. Ensure Firebase project is properly configured
3. Verify that all dependencies are installed

### Authentication Issues

1. Check Firebase Auth domain configuration
2. Verify API keys are correct
3. Ensure Google Auth is enabled in Firebase Console

### Performance

The app includes:
- Code splitting with lazy loading
- Image optimization
- Local storage for offline functionality
- Performance monitoring utilities

## Security Notes

- Never commit `.env` files to Git
- Use environment variables for all sensitive data
- Regularly rotate API keys
- Monitor Firebase usage and quotas

## Features

The deployed app includes:
- User authentication with Google
- Meal tracking and carbon footprint calculation
- Sustainability challenges
- Progress analytics
- Recipe generation
- Offline functionality with localStorage

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally first with `npm run build && npm run preview`
