# YourTube – YouTube Clone (Next.js)

A pixel-perfect YouTube frontend clone built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

## Features

- **Dark theme** matching YouTube's exact color palette
- **Responsive layout** – works on mobile, tablet, and desktop
- **Collapsible sidebar** with mini-mode on desktop
- **Category chips** with horizontal scroll + fade buttons
- **Video grid** with infinite scroll simulation
- **Shimmer skeleton** loading states
- **Video watch page** with fake player, like/subscribe, comments
- **Shorts page** with vertical scroll UI
- **Explore / Search results** page
- **Trending** page with numbered rankings
- **History** page with grouped timeline
- **Hover animations** – scale thumbnail, reveal context menu

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home feed with video grid |
| `/watch` | Video player + comments + related |
| `/shorts` | Vertical short-form videos |
| `/explore` | Search results / filter view |
| `/trending` | Trending videos by category |
| `/history` | Watch history grouped by date |

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
youtube-clone/
├── app/
│   ├── globals.css       # Global styles + CSS variables
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   ├── data.ts           # Mock video/channel data
│   ├── watch/page.tsx    # Watch page
│   ├── shorts/page.tsx   # Shorts page
│   ├── explore/page.tsx  # Explore/search page
│   ├── trending/page.tsx # Trending page
│   └── history/page.tsx  # History page
├── components/
│   ├── Navbar.tsx        # Top navigation bar
│   ├── Sidebar.tsx       # Left sidebar (full + mini)
│   ├── CategoryBar.tsx   # Scrollable filter chips
│   ├── VideoCard.tsx     # Video thumbnail card
│   └── VideoGrid.tsx     # Infinite scroll grid
├── tailwind.config.ts    # Custom YT color tokens
└── next.config.js
```

## Customization

### Adding real videos
Replace the `VIDEOS` array in `app/data.ts` with data from an API (YouTube Data API v3, etc.).

### Adding backend
- **Auth**: NextAuth.js for Google OAuth
- **Database**: Prisma + PostgreSQL for user data
- **Storage**: AWS S3 or Cloudflare R2 for video files
- **Streaming**: Use HLS.js for actual video playback

### Color tokens (tailwind.config.ts)
```ts
yt: {
  bg: '#0F0F0F',       // page background
  surface: '#272727',  // card/button bg
  surface2: '#1F1F1F', // input bg
  border: '#3F3F3F',   // borders
  red: '#FF0000',      // brand accent
  text: '#FFFFFF',     // primary text
  muted: '#AAAAAA',    // secondary text
}
```

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (icons)
