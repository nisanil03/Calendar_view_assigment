# Deployment Guide

Your Storybook is built and ready in `storybook-static/` folder.

## Option 1: Deploy to Vercel (Recommended - Easiest)

### Via GitHub (Best for Continuous Deployment):

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: calendar view component implementation"
   git remote add origin https://github.com/YOUR_USERNAME/calendar-view.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "Add New Project"
   - Import your repository
   - Set Build Settings:
     - **Build Command:** `npm run build-storybook`
     - **Output Directory:** `storybook-static`
     - **Install Command:** `npm install`
   - Click Deploy
   - Vercel will give you a URL like: `https://your-project.vercel.app`

### Via CLI:
```bash
npm i -g vercel
vercel --prod
```

## Option 2: Deploy to Netlify

### Via Drag & Drop:
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop the `storybook-static` folder
3. Get your live URL instantly

### Via GitHub:
1. Push code to GitHub (same as Vercel step 1)
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect GitHub and select repository
5. Build settings:
   - **Build command:** `npm run build-storybook`
   - **Publish directory:** `storybook-static`
6. Deploy

## Option 3: Deploy to Chromatic (Storybook Hosting)

1. **Install Chromatic:**
   ```bash
   npm install --save-dev chromatic
   ```

2. **Get Project Token:**
   - Sign up at [chromatic.com](https://www.chromatic.com)
   - Create a project and get your token

3. **Deploy:**
   ```bash
   npx chromatic --project-token=YOUR_TOKEN
   ```

## Option 4: GitHub Pages

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add script to package.json:**
   ```json
   "scripts": {
     "deploy-storybook": "npm run build-storybook && gh-pages -d storybook-static"
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy-storybook
   ```

4. **Enable GitHub Pages:**
   - Go to your repo Settings → Pages
   - Source: `gh-pages` branch
   - URL: `https://YOUR_USERNAME.github.io/calendar-view/`

## After Deployment

1. **Update README.md:**
   - Replace `[Your Deployed Storybook URL]` with your actual URL

2. **Test the deployed site:**
   - Check all stories load correctly
   - Test interactions work
   - Verify responsive design

3. **Submit:**
   - Include the deployed URL in your Internshala submission

## Quick Commands Summary

```bash
# Build Storybook
npm run build-storybook

# Deploy to Vercel (after installing CLI)
vercel --prod

# Deploy to Netlify (after installing CLI)
netlify deploy --prod --dir=storybook-static

# Deploy to Chromatic
npx chromatic --project-token=YOUR_TOKEN
```

