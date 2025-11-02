# Deploy to Vercel - Complete Guide

## Step 1: Push Your Code to GitHub

```bash
# Add all changes
git add .

# Commit changes
git commit -m "feat: complete calendar view implementation with all features"

# Push to GitHub
git push origin main
```

## Step 2: Deploy Main App to Vercel

1. **Go to Vercel:**
   - Visit: https://vercel.com
   - Sign in with GitHub

2. **Import Project:**
   - Click "Add New Project"
   - Select your `calendar-view` repository
   - Click "Import"

3. **Configure Build Settings:**
   - **Framework Preset:** Vite (auto-detected)
   - **Build Command:** `npm run build` (already set in vercel.json)
   - **Output Directory:** `dist` (already set in vercel.json)
   - **Install Command:** `npm install`

4. **Deploy:**
   - Click "Deploy"
   - Wait 1-2 minutes
   - Get your app URL: `https://calendar-view.vercel.app`

## Step 3: Deploy Storybook (Optional - Separate Project)

### Option A: Deploy Storybook as Separate Vercel Project

1. **Create New Vercel Project:**
   - Add another project in Vercel dashboard
   - Use the same GitHub repo

2. **Configure for Storybook:**
   - **Build Command:** `npm run build-storybook`
   - **Output Directory:** `storybook-static`
   - **Framework Preset:** Other

3. **Deploy:**
   - Deploy and get Storybook URL

### Option B: Deploy Storybook via Netlify (Easier)

1. Build Storybook locally:
   ```bash
   npm run build-storybook
   ```

2. Go to: https://app.netlify.com/drop
3. Drag `storybook-static` folder
4. Get Storybook URL

## Step 4: Update README

After deployment, update your README.md:

```markdown
## Live App
https://your-app.vercel.app

## Live Storybook  
https://your-storybook-url.netlify.app
```

## Automatic Deployments

Once connected to GitHub:
- ✅ Every push to `main` = Auto-deploy
- ✅ Pull requests = Preview deployments
- ✅ Zero downtime updates

## Troubleshooting

If deployment fails:
1. Check build logs in Vercel dashboard
2. Make sure `vercel.json` is in root
3. Verify `npm run build` works locally
4. Check environment variables if needed

