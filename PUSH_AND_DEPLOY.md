# Push to GitHub & Deploy on Vercel

## Step 1: Create a new repo on GitHub

1. Open **https://github.com/new**
2. **Repository name:** e.g. `skillbridge` or `Project_HK`
3. Leave it **empty** (no README, no .gitignore).
4. Click **Create repository**.

---

## Step 2: Push your code (run in project folder)

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and repo name.

```bash
cd "d:\Rohit Wakodikar\programming\Web Development\Project_HK"

git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Example if your username is `rohit` and repo is `skillbridge`:

```bash
git remote add origin https://github.com/rohit/skillbridge.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy frontend on Vercel

1. Go to **https://vercel.com** and sign in with **GitHub**.
2. Click **Add New** → **Project**.
3. **Import** the repo you just pushed (`YOUR_REPO_NAME`).
4. **Important:** Under "Root Directory", click **Edit** and set it to **`frontend`**.
5. **Environment Variables:** add one (you can add backend URL later):
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-url.com` (or leave blank for now; add after deploying backend)
6. Click **Deploy**.

Your app will be live at `https://your-project.vercel.app`.

---

## Step 4: Deploy backend (so Register/Login work)

The backend needs to run somewhere (e.g. **Render** or **Railway**) and use **MongoDB Atlas**.  
Full steps are in **DEPLOY.md** (Render/Railway + MongoDB Atlas).  
After the backend is deployed, set `VITE_API_URL` in Vercel to that URL and redeploy the frontend.
