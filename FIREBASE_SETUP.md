# 🔥 FIREBASE DATABASE SETUP

## Benefits
- ✅ Real-time sync across devices
- ✅ Automatic backup
- ✅ Free tier (50K reads/day, 20K writes/day)
- ✅ No backend code needed
- ✅ Built-in authentication

---

## Setup Steps (5 minutes)

### 1. Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Name: "atomic-habits-tracker"
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firestore Database

1. In Firebase Console, click "Firestore Database"
2. Click "Create database"
3. Select "Start in production mode"
4. Choose location (closest to users)
5. Click "Enable"

### 3. Set Firestore Rules

Go to "Firestore Database" → "Rules" and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /habits/{habitId} {
      allow read, write: if request.auth != null && 
                          request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
    }
  }
}
```

Click "Publish"

### 4. Enable Authentication

1. Click "Authentication" → "Get started"
2. Click "Email/Password"
3. Enable "Email/Password"
4. Enable "Anonymous" (for guest users)
5. Click "Save"

### 5. Get Firebase Config

1. Click "Project Settings" (gear icon)
2. Scroll to "Your apps"
3. Click web icon (</>)
4. Register app name: "atomic-habits-web"
5. Copy the firebaseConfig object

### 6. Add Config to App

Create `.env.local` file:

```bash
REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:xxxxxxxxxxxxx
```

### 7. Update App to Use Firebase

Replace in `UnifiedApp.tsx`:

```javascript
// OLD
import { useHabits } from '../hooks/useHabits';

// NEW
import { useFirebaseHabits as useHabits } from '../hooks/useFirebaseHabits';
```

Add Auth check:

```javascript
import Auth from '../components/Auth';

export function UnifiedApp() {
  const { user, ...rest } = useHabits();
  
  if (!user) {
    return <Auth />;
  }
  
  // Rest of app...
}
```

### 8. Test

```bash
npm start
```

1. Sign up with email/password
2. Add a habit
3. Open in different browser → Sign in → See same habits ✅
4. Open on phone → Sign in → See same habits ✅

---

## Data Structure

```
habits (collection)
  └── {habitId} (document)
      ├── userId: "user123"
      ├── name: "Read 10 pages"
      ├── identity: "a reader"
      ├── time: "07:00"
      ├── location: "Kitchen table"
      ├── visualCue: "Book on nightstand"
      ├── cue: "After I pour coffee..."
      ├── twoMinuteVersion: "Read 1 page"
      ├── accountabilityPartner: "Sarah"
      ├── frequency: "daily"
      ├── startDate: "2024-01-15T10:00:00.000Z"
      ├── createdAt: "2024-01-15T10:00:00.000Z"
      └── daily: [
          {key: "Mon Jan 15 2024", completed: true, count: 1},
          {key: "Tue Jan 16 2024", completed: true, count: 1}
        ]
```

---

## Features Enabled

### ✅ Cross-Device Sync
- Sign in on phone → See habits
- Sign in on laptop → See same habits
- Real-time updates

### ✅ Automatic Backup
- Data stored in cloud
- Never lost
- Recoverable

### ✅ Multi-User Support
- Each user has own data
- Secure isolation
- Privacy protected

### ✅ Offline Support
- Works offline
- Syncs when online
- No data loss

---

## Cost (Free Tier)

**Firestore:**
- 50,000 reads/day
- 20,000 writes/day
- 1 GB storage

**For 1000 users:**
- ~10 reads per user per day = 10,000 reads ✅
- ~5 writes per user per day = 5,000 writes ✅
- ~1 MB per user = 1 GB total ✅

**Verdict: FREE for most apps**

---

## Migration from localStorage

To migrate existing users:

```javascript
// In useFirebaseHabits.js, add migration:
useEffect(() => {
  if (user && habits.length === 0) {
    const localHabits = localStorage.getItem('habits');
    if (localHabits) {
      const parsed = JSON.parse(localHabits);
      parsed.forEach(habit => addHabit(habit));
      localStorage.removeItem('habits'); // Clean up
    }
  }
}, [user, habits]);
```

---

## Security

✅ **Firestore Rules** ensure:
- Users can only read/write their own data
- Authentication required
- No unauthorized access

✅ **Environment Variables**:
- API keys in .env.local
- Not committed to git
- Secure in production

---

## Deployment

Add environment variables to hosting:

**Netlify:**
1. Site settings → Environment variables
2. Add all REACT_APP_FIREBASE_* variables

**Vercel:**
1. Project settings → Environment Variables
2. Add all REACT_APP_FIREBASE_* variables

---

## Alternative: Supabase

If you prefer PostgreSQL over Firestore:

```bash
npm install @supabase/supabase-js
```

Similar setup, SQL database instead of NoSQL.

---

## Support

**Firebase Docs:** https://firebase.google.com/docs
**Pricing:** https://firebase.google.com/pricing
**Console:** https://console.firebase.google.com

---

## ✅ Ready to Deploy with Database!

Your app now has:
- ✅ Cloud database
- ✅ Real-time sync
- ✅ Authentication
- ✅ Automatic backup
- ✅ Cross-device support
