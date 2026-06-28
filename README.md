<div align="center">

# 🎬 YourTube

### A Full-Stack YouTube Clone built with Next.js 14, MongoDB & TypeScript

![YourTube Banner](https://picsum.photos/seed/yourtube/1200/400)

[![Next.js](https://img.shields.io/badge/Next.js-16.x-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Live Demo](#) • [Features](#features) • [Tech Stack](#tech-stack) • [Installation](#installation) • [API](#api-routes)

</div>

---

## 📸 Screenshots

| Home Page | Watch Page |
|-----------|------------|
| ![Home](https://picsum.photos/seed/home1/600/338) | ![Watch](https://picsum.photos/seed/watch1/600/338) |

| Upload Page | Channel Page |
|-------------|-------------|
| ![Upload](https://picsum.photos/seed/upload1/600/338) | ![Channel](https://picsum.photos/seed/channel1/600/338) |

---

## ✨ Features

### 🎥 Video
- ✅ Upload videos from local files or URL
- ✅ Real video playback with HTML5 player
- ✅ Custom thumbnail upload
- ✅ Video categories and tags
- ✅ View count tracking
- ✅ Like / Dislike system

### 👤 User
- ✅ Register & Login with JWT authentication
- ✅ Create your own channel
- ✅ Edit channel name, description, avatar
- ✅ View your uploaded videos
- ✅ Watch history

### 💬 Social
- ✅ Comments with replies
- ✅ Subscribe / Unsubscribe to channels
- ✅ Watch Later playlist
- ✅ Liked videos collection

### 🔍 Discovery
- ✅ Search videos by title, tags, channel
- ✅ Filter by category
- ✅ Trending page
- ✅ Explore page
- ✅ Shorts page

### ⚙️ Settings
- ✅ Dark mode
- ✅ Notification preferences
- ✅ Privacy settings
- ✅ Playback settings
- ✅ Language & Region

---

## 🗂️ Project Structure

```
yourtube/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 api/                      # Backend API Routes
│   │   ├── 📁 auth/
│   │   │   ├── login/route.ts       # POST - User Login
│   │   │   └── register/route.ts   # POST - User Register
│   │   ├── 📁 videos/
│   │   │   ├── route.ts            # GET all, POST video
│   │   │   └── [id]/route.ts       # GET, PATCH, DELETE
│   │   ├── comments/route.ts       # GET, POST, DELETE
│   │   ├── upload/route.ts         # POST - File Upload
│   │   ├── watchlater/route.ts     # GET, POST, DELETE
│   │   ├── subscriptions/route.ts  # GET, POST, DELETE
│   │   ├── channel/route.ts        # GET, POST, PATCH
│   │   └── users/route.ts          # GET, POST, PATCH
│   ├── 📄 page.tsx                  # Home Page
│   ├── 📄 watch/page.tsx            # Video Player
│   ├── 📄 upload/page.tsx           # Upload Video
│   ├── 📄 channel/page.tsx          # Channel Profile
│   ├── 📄 search/page.tsx           # Search Results
│   ├── 📄 shorts/page.tsx           # YouTube Shorts
│   ├── 📄 trending/page.tsx         # Trending Videos
│   ├── 📄 explore/page.tsx          # Explore
│   ├── 📄 history/page.tsx          # Watch History
│   ├── 📄 watch-later/page.tsx      # Watch Later
│   ├── 📄 subscriptions/page.tsx    # Subscriptions
│   ├── 📄 playlists/page.tsx        # Playlists
│   ├── 📄 your-videos/page.tsx      # Your Videos
│   ├── 📄 liked/page.tsx            # Liked Videos
│   ├── 📄 settings/page.tsx         # Settings
│   ├── 📄 login/page.tsx            # Login/Register
│   ├── 📄 feedback/page.tsx         # Send Feedback
│   └── 📄 help/page.tsx             # Help Center
├── 📁 components/                   # Reusable Components
│   ├── Navbar.tsx                   # Top Navigation
│   ├── Sidebar.tsx                  # Left Sidebar
│   ├── VideoCard.tsx                # Video Card
│   ├── VideoGrid.tsx                # Video Grid
│   ├── CategoryBar.tsx              # Category Chips
│   ├── Comments.tsx                 # Comments Section
│   └── CreateChannelDialog.tsx      # Create Channel Modal
├── 📁 lib/
│   └── mongodb.ts                   # Database Connection
├── 📁 models/                       # Mongoose Schemas
│   ├── Video.ts                     # Video Model
│   ├── User.ts                      # User Model
│   └── Comment.ts                   # Comment Model
└── 📁 scripts/
    └── seed.ts                      # Database Seeder
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js | React Framework | 16.x |
| TypeScript | Type Safety | 5.x |
| Tailwind CSS | Styling | 3.x |
| Lucide React | Icons | 0.383.0 |

### Backend

| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js API Routes | REST API | 16.x |
| MongoDB | Database | 7.x |
| Mongoose | ODM | 8.x |
| bcryptjs | Password Hashing | 2.x |
| jsonwebtoken | Authentication | 9.x |

---

## 🔌 API Routes

### 🎬 Videos

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/videos` | Get all videos |
| `GET` | `/api/videos?q=search` | Search videos |
| `GET` | `/api/videos?category=Music` | Filter by category |
| `POST` | `/api/videos` | Create video |
| `GET` | `/api/videos/:id` | Get single video |
| `PATCH` | `/api/videos/:id` | Update video |
| `DELETE` | `/api/videos/:id` | Delete video |

### 💬 Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/comments?videoId=xxx` | Get comments |
| `POST` | `/api/comments` | Add comment |
| `DELETE` | `/api/comments?id=xxx` | Delete comment |

### 👤 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register user |
| `POST` | `/api/auth/login` | Login user |

### 📺 Channel

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/channel?userId=xxx` | Get channel |
| `POST` | `/api/channel` | Create channel |
| `PATCH` | `/api/channel` | Update channel |

### 🔔 Subscriptions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/subscriptions?userId=xxx` | Get subscriptions |
| `POST` | `/api/subscriptions` | Subscribe |
| `DELETE` | `/api/subscriptions?channelId=xxx` | Unsubscribe |

### ⏰ Watch Later

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/watchlater?userId=xxx` | Get watch later |
| `POST` | `/api/watchlater` | Add to watch later |
| `DELETE` | `/api/watchlater?videoId=xxx` | Remove |

---

## 🚀 Installation

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Git

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/Naveenpandey2008/yourtube.git
cd yourtube
```

**2. Install dependencies**
```bash
npm install
```

**3. Setup environment variables**

Create a `.env.local` file:
```env
MONGODB_URI=mongodb://localhost:27017/yourtube
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

**4. Seed the database**
```bash
node scripts/seed.ts
```

**5. Start the development server**
```bash
npm run dev
```

**6. Open your browser**
```
http://localhost:3000
```

---

## 🗄️ Database Schema

### Video Model
```
Video {
  title: String
  description: String
  thumbnail: String
  videoUrl: String
  channel: String
  channelId: String
  views: Number
  likes: Number
  dislikes: Number
  duration: String
  tags: [String]
  category: String
  verified: Boolean
  createdAt: Date
}
```

### User Model
```
User {
  name: String
  email: String (unique)
  password: String (hashed)
  avatar: String
  handle: String (unique)
  subscribers: Number
  description: String
  verified: Boolean
  createdAt: Date
}
```

### Comment Model
```
Comment {
  videoId: String
  userId: String
  user: String
  text: String
  likes: Number
  parentId: String (for replies)
  createdAt: Date
}
```

---

## 📱 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Video feed with category filters |
| Watch | `/watch?id=xxx` | Video player with comments |
| Upload | `/upload` | Upload video page |
| Channel | `/channel` | Your channel profile |
| Search | `/search?q=xxx` | Search results |
| Shorts | `/shorts` | Short videos |
| Trending | `/trending` | Trending videos |
| Explore | `/explore` | Explore videos |
| History | `/history` | Watch history |
| Watch Later | `/watch-later` | Saved videos |
| Subscriptions | `/subscriptions` | Subscribed channels |
| Playlists | `/playlists` | Your playlists |
| Your Videos | `/your-videos` | Manage your videos |
| Liked | `/liked` | Liked videos |
| Settings | `/settings` | Account settings |
| Login | `/login` | Login / Register |
| Help | `/help` | Help center |
| Feedback | `/feedback` | Send feedback |

---

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#0F0F0F` | Page background |
| Surface | `#272727` | Cards, buttons |
| Surface 2 | `#1F1F1F` | Input fields |
| Border | `#3F3F3F` | Borders, dividers |
| Red | `#FF0000` | Brand accent |
| Text | `#FFFFFF` | Primary text |
| Muted | `#AAAAAA` | Secondary text |

---

## 👨‍💻 Author

**Naveen Pandey**

- GitHub: [@Naveenpandey2008](https://github.com/Naveenpandey2008)

---

## 📄 License

This project is for educational purposes only.

---

<div align="center">

Made with ❤️ by Naveen Pandey

⭐ Star this repository if you found it helpful!

</div>