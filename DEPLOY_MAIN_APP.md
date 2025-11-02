# Deploy Your Main Calendar App

## You now have TWO deployments:

1. **Storybook** (`storybook-static/`) - Component documentation (required by assignment)
2. **Main App** (`dist/`) - Your actual calendar application ← **This is what you want**

## Quick Deploy Main App (Vite Build)

### Option 1: Netlify Drag & Drop

1. The `dist` folder is now open in Windows Explorer
2. Go to: https://app.netlify.com/drop
3. Drag the `dist` folder onto the page
4. Wait ~30 seconds
5. Get your live app URL!

### Option 2: Vercel (via GitHub)

1. Push code to GitHub:
   ```bash
   git add .
   git commit -m "feat: calendar view app"
   git push origin main
   ```

2. Go to vercel.com → Import project
3. Vercel will auto-detect Vite and deploy
4. Your app will be live!

### Option 3: Vercel CLI

```bash
npm i -g vercel
cd dist
vercel --prod
```

## What's the difference?

- **Storybook** (`storybook-static/`) = Component documentation & stories (for developers)
- **Main App** (`dist/`) = Your actual calendar application (for users)

For your assignment submission, you need BOTH:
- Storybook URL (component documentation)
- Main App URL (working calendar)

## Update README

After deploying, update README.md with both URLs:
- Live Storybook: [your-storybook-url]
- Live App: [your-app-url]

