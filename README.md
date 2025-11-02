# Calendar View Component

## Live Storybook
Add your deployed Storybook URL here.

## Installation
```bash
npm install
npm run storybook
```

## Architecture
- React + TypeScript + Vite
- Tailwind CSS with extended design tokens (colors, spacing, radius, shadows, animations)
- Storybook for documentation
- date-fns for date math

## Features
- Month and Week views
- Event create/edit/delete via accessible modal
- Keyboard navigation and ARIA roles
- Responsive layouts and dark mode

## Storybook Stories
- CalendarView/Default, EmptyState, WeekView, LargeDataset, InteractivePlayground, MobileView
- Components/Calendar variants (weekStartsOn, different months, dark mode, disabled dates)

## Scripts
- `npm run dev` – Vite dev server
- `npm run storybook` – Storybook on port 6006
- `npm run storybook:6007` – Storybook on port 6007

## Notes
- No prebuilt calendar UI libraries are used; only date-fns utilities.
- Tailwind tokens align with the assignment (primary/neutral palettes, spacing, radius, shadows, animations).
