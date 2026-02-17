# Deploy SkillBridge

## 1. Push to GitHub

```bash
# Already done: git init, add, commit. Now add your repo and push:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Create the repo on GitHub first: https://github.com/new (name it e.g. `skillbridge` or `Project_HK`).

---

## 2. Deploy frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (use GitHub).
2. **Add New Project** → **Import** your GitHub repo.
3. **Root Directory:** set to `frontend` (click Edit, then enter `frontend`).
4. **Build Command:** `npm run build` (default).
5. **Output Directory:** `dist` (default for Vite).
6. **Environment Variables:** add:
   - `VITE_API_URL` = your backend URL (see step 3 below).  
   Example: `https://your-backend.onrender.com` or `https://your-app.railway.app`
7. Click **Deploy**.

After deploy, your app will be at `https://your-project.vercel.app`.  
If you haven’t deployed the backend yet, use a placeholder for `VITE_API_URL` and update it later.

---

## 3. Deploy backend (Render or Railway)

The backend needs Node.js + MongoDB. Use **Render** or **Railway** (both have free tiers).

### Option A: Render

1. Go to [render.com](https://render.com), sign in with GitHub.
2. **New** → **Web Service**.
3. Connect the same GitHub repo.
4. **Root Directory:** `backend`.
5. **Build Command:** `npm install`.
6. **Start Command:** `npm start` (or `node server.js`).
7. **Environment Variables:** add:
   - `MONGODB_URI` = your MongoDB Atlas connection string (create free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)).
   - `JWT_SECRET` = any long random string.
   - `OPENAI_API_KEY` = optional, for AI roadmap and chat.
8. Create the service. Note the URL (e.g. `https://your-app.onrender.com`).

### Option B: Railway

1. Go to [railway.app](https://railway.app), sign in with GitHub.
2. **New Project** → **Deploy from GitHub** → select your repo.
3. Set **Root Directory** to `backend`.
4. Add **MongoDB** from Railway’s data services (or use MongoDB Atlas).
5. In your service **Variables**, add `JWT_SECRET`, `OPENAI_API_KEY`, and `MONGODB_URI` if using Atlas.
6. Deploy and copy the public URL.

---

## 4. Connect frontend to backend

In your **Vercel** project → **Settings** → **Environment Variables**:

- Set `VITE_API_URL` to your backend URL (no trailing slash), e.g. `https://your-app.onrender.com`.

Redeploy the frontend so it picks up the new variable.

---

## 5. MongoDB Atlas (if not using Railway DB)

1. [cloud.mongodb.com](https://cloud.mongodb.com) → Create free cluster.
2. **Database Access** → Add user (username + password).
3. **Network Access** → Add IP `0.0.0.0/0` (allow from anywhere for Render/Railway).
4. **Connect** → **Drivers** → copy connection string.
5. Put that in your backend’s `MONGODB_URI` (replace `<password>` with the user password).

Done. Your frontend (Vercel) will call the backend (Render/Railway), and the backend will use MongoDB Atlas.
