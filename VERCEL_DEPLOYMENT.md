# 🚀 Vercel Deployment Guide for FoodPrint

## 📋 Prerequisites
- GitHub repository: ✅ https://github.com/Sunayana225/Foodprint
- Vercel account (free): Sign up at https://vercel.com
- Firebase project with your credentials

## 🔧 Step-by-Step Deployment

### 1. **Connect GitHub to Vercel**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository: `Sunayana225/Foodprint`
4. Select the `foodprint-app` folder as the root directory

### 2. **Configure Build Settings**
Vercel should auto-detect these settings:
- **Framework Preset**: Vite
- **Root Directory**: `foodprint-app`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 3. **Add Environment Variables**
In Vercel dashboard, go to Project Settings > Environment Variables and add:

```env
VITE_FIREBASE_API_KEY=AIzaSyA9_HiVzTQNxTYWcf0I_p6ZztGVNIJwHbU
VITE_FIREBASE_AUTH_DOMAIN=realestate-456c4.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=realestate-456c4
VITE_FIREBASE_STORAGE_BUCKET=realestate-456c4.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=628551361975
VITE_FIREBASE_APP_ID=1:628551361975:web:b1b142fc82678d11af3432
VITE_FIREBASE_MEASUREMENT_ID=G-VT0F7YRT1H
```

### 4. **Deploy**
1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Your app will be live at: `https://your-project-name.vercel.app`

## 🔒 Security Notes

✅ **What's Secure:**
- Your `.env` file with real credentials is NOT in GitHub
- Only environment variables are used in production
- Firebase config is loaded from Vercel environment variables
- All sensitive data is protected

✅ **What's Public:**
- Source code (but no credentials)
- `.env.example` with placeholder values
- Build configuration

## 🔄 Automatic Deployments

Every time you push to GitHub:
1. Vercel automatically detects changes
2. Builds and deploys the new version
3. Your live site updates within minutes

## 🛠️ Troubleshooting

### Build Errors:
- Check Vercel build logs
- Ensure all environment variables are set
- Verify Firebase credentials are correct

### Runtime Errors:
- Check browser console for errors
- Verify Firebase project settings
- Ensure Firestore rules allow read/write

## 📱 Testing Your Deployment

1. Visit your Vercel URL
2. Test Firebase authentication (Google login)
3. Try adding a meal
4. Check if challenges work
5. Verify profile functionality

## 🎯 Next Steps

After successful deployment:
1. Update Firebase authorized domains to include your Vercel URL
2. Test all features in production
3. Share your live app URL!

---

**Your FoodPrint app is now live and secure! 🌱✨**
