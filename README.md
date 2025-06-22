# 🌱 FoodPrint - Advanced Food Environmental Impact Tracker

## 🎉 NEW FEATURES ADDED!

### 🔥 **Latest Updates:**

#### 1. **🤖 AI Recipe Generator**
- **New Navigation Item**: "Recipes" in the main navigation
- **Smart Recipe Creation**: Generate healthy, eco-friendly recipes from selected ingredients
- **Environmental Impact**: Real-time CO₂ and water usage calculations for recipes
- **Health Scoring**: AI-powered health score (0-100) for generated recipes
- **Beautiful UI**: Step-by-step instructions with cooking times and servings

#### 2. **⚠️ Health Risk Analysis**
- **Real-time Health Warnings**: Instant health risk assessment for each food item
- **Risk Levels**: Low, Medium, High risk indicators with color coding
- **Health Considerations**: Detailed warnings about potential health issues
- **Smart Alternatives**: Automatic suggestions for healthier food alternatives
- **Personalized Recommendations**: Custom advice based on food choices

#### 3. **🌍 Enhanced Food Database**
- **Comprehensive Data**: 10+ food items with detailed nutritional and environmental data
- **Health Information**: Calories, protein, fat, carbs for each food item
- **Environmental Metrics**: Accurate CO₂, water usage, and land use data
- **Visual Indicators**: Health risk badges and warning icons

#### 4. **🎨 Improved User Experience**
- **Visual Health Indicators**: Color-coded risk levels (Green/Yellow/Red)
- **Interactive Food Selection**: Click any food to see detailed health analysis
- **Alternative Suggestions**: One-click access to healthier alternatives
- **Responsive Design**: Works perfectly on all devices

## 🚀 **How to Use New Features:**

### **Recipe Generator:**
1. Navigate to "Recipes" in the main menu
2. Select ingredients from popular options or add custom ones
3. Click "Generate Recipe" to create an AI-powered recipe
4. View environmental impact, health score, and detailed instructions

### **Health Analysis:**
1. Go to "Add Meal" page
2. Click on any food item to see health risk analysis
3. View warnings, alternatives, and recommendations
4. Make informed food choices based on health insights

### **Food Search:**
1. Use the search bar to find any food item
2. See health risk indicators next to each food
3. View environmental impact data
4. Get instant health warnings and alternatives

## 🛠 **Technical Features:**

- **TypeScript Integration**: Full type safety for better development
- **Real-time Calculations**: Instant environmental and health impact calculations
- **Modular Architecture**: Clean, maintainable code structure
- **API Ready**: Built to integrate with real food APIs (Edamam, Spoonacular)
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🌟 **Key Benefits:**

1. **Health-Conscious**: Make informed decisions about food health impacts
2. **Eco-Friendly**: Understand environmental consequences of food choices
3. **Educational**: Learn about sustainable eating habits
4. **Practical**: Get actionable alternatives and recommendations
5. **Engaging**: Beautiful, interactive user interface

---

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ and npm
- Firebase account (free)
- Git

### **Installation**

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/foodprint-app.git
cd foodprint-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

4. **Configure Firebase:**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google)
   - Enable Firestore Database
   - Copy your Firebase config to `.env` file

5. **Start development server:**
```bash
npm run dev
```

### **Environment Variables**

Create a `.env` file with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### **Building for Production**

```bash
npm run build
```

### **Deployment**

#### **Deploy to Vercel:**
1. Push your code to GitHub
2. Connect your GitHub repo to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

#### **Deploy to Netlify:**
1. Build the project: `npm run build`
2. Upload `dist` folder to [Netlify](https://netlify.com)
3. Configure environment variables in Netlify dashboard

## 🔧 **Development**

### **Available Scripts**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### **Project Structure**
```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API and business logic
├── contexts/      # React contexts
├── utils/         # Utility functions
└── config/        # Configuration files
```

## 🔒 **Security**

- Environment variables are used for all sensitive data
- Firebase rules restrict access to authenticated users
- API keys are never exposed in the client code
- All user data is stored securely in Firestore

## 📱 **Features**

- **Authentication**: Secure login with Firebase Auth
- **Meal Tracking**: Log meals with environmental impact
- **Challenges**: Participate in sustainability challenges
- **Analytics**: Track your environmental progress
- **Recipes**: AI-powered recipe generation
- **Health Analysis**: Real-time health risk assessment
- **Leaderboard**: Compete with other users

---

**Your FoodPrint app is now a comprehensive platform for healthy, sustainable eating! 🌱✨**
