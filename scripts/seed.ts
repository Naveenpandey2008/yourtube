import mongoose from 'mongoose';

const MONGODB_URI = "mongodb://localhost:27017/yourtube";

const VideoSchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnail: String,
  videoUrl: String,
  channel: String,
  channelId: String,
  channelAvatar: String,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  duration: String,
  tags: [String],
  category: String,
  verified: { type: Boolean, default: false },
}, { timestamps: true });

const Video = mongoose.models.Video || mongoose.model('Video', VideoSchema);

const SAMPLE_VIDEOS = [
  {
    title: 'Building a Full-Stack App with Next.js 14 & TypeScript',
    description: 'Complete tutorial on building a full-stack app with Next.js 14 and TypeScript.',
    thumbnail: 'https://picsum.photos/seed/code1/640/360',
    videoUrl: '',
    channel: 'CodeWithMe',
    channelId: 'channel1',
    channelAvatar: 'https://i.pravatar.cc/40?img=1',
    views: 2300000,
    likes: 87000,
    duration: '1:24:17',
    tags: ['nextjs', 'typescript', 'react'],
    category: 'Technology',
    verified: true,
  },
  {
    title: 'Lofi Hip Hop Radio – Beats to Relax / Study To',
    description: 'Chill lofi beats to help you relax and study.',
    thumbnail: 'https://picsum.photos/seed/lofi2/640/360',
    videoUrl: '',
    channel: 'ChillBeats',
    channelId: 'channel2',
    channelAvatar: 'https://i.pravatar.cc/40?img=2',
    views: 14000000,
    likes: 412000,
    duration: 'LIVE',
    tags: ['lofi', 'music', 'chill'],
    category: 'Music',
    verified: true,
  },
  {
    title: 'I Spent 30 Days Hiking the Entire Appalachian Trail Alone',
    description: 'My solo journey across the Appalachian Trail over 30 days.',
    thumbnail: 'https://picsum.photos/seed/hike3/640/360',
    videoUrl: '',
    channel: 'WildExplorer',
    channelId: 'channel3',
    channelAvatar: 'https://i.pravatar.cc/40?img=3',
    views: 8100000,
    likes: 234000,
    duration: '22:43',
    tags: ['hiking', 'adventure', 'travel'],
    category: 'Travel',
    verified: false,
  },
  {
    title: 'The Science Behind Why We Dream – Sleep Explained',
    description: 'Exploring the science of dreams and sleep cycles.',
    thumbnail: 'https://picsum.photos/seed/science4/640/360',
    videoUrl: '',
    channel: 'ScienceDaily',
    channelId: 'channel4',
    channelAvatar: 'https://i.pravatar.cc/40?img=4',
    views: 3700000,
    likes: 156000,
    duration: '18:09',
    tags: ['science', 'sleep', 'dreams'],
    category: 'Science',
    verified: true,
  },
  {
    title: 'Gordon Ramsay Makes the Perfect Pasta Carbonara at Home',
    description: 'Gordon Ramsay teaches you how to make the perfect pasta carbonara.',
    thumbnail: 'https://picsum.photos/seed/food5/640/360',
    videoUrl: '',
    channel: 'GordonRamsay',
    channelId: 'channel5',
    channelAvatar: 'https://i.pravatar.cc/40?img=5',
    views: 21000000,
    likes: 623000,
    duration: '9:32',
    tags: ['cooking', 'pasta', 'recipe'],
    category: 'Cooking',
    verified: true,
  },
  {
    title: 'I Built a PC for $300 – Is It Worth It in 2025?',
    description: 'Building a budget PC for $300 and testing its performance.',
    thumbnail: 'https://picsum.photos/seed/tech7/640/360',
    videoUrl: '',
    channel: 'TechTinkerer',
    channelId: 'channel7',
    channelAvatar: 'https://i.pravatar.cc/40?img=7',
    views: 1900000,
    likes: 72000,
    duration: '16:28',
    tags: ['pc', 'tech', 'budget'],
    category: 'Technology',
    verified: false,
  },
  {
    title: 'Minecraft But Every 60 Seconds the World Shrinks…',
    description: 'A unique Minecraft challenge where the world shrinks every 60 seconds.',
    thumbnail: 'https://picsum.photos/seed/game9/640/360',
    videoUrl: '',
    channel: 'PixelCraft',
    channelId: 'channel9',
    channelAvatar: 'https://i.pravatar.cc/40?img=9',
    views: 12400000,
    likes: 445000,
    duration: '24:01',
    tags: ['minecraft', 'gaming', 'challenge'],
    category: 'Gaming',
    verified: true,
  },
  {
    title: 'Morning Yoga for Beginners – 20 Minute Full Body Flow',
    description: 'A relaxing 20-minute yoga flow perfect for beginners.',
    thumbnail: 'https://picsum.photos/seed/yoga13/640/360',
    videoUrl: '',
    channel: 'YogaWithAria',
    channelId: 'channel13',
    channelAvatar: 'https://i.pravatar.cc/40?img=13',
    views: 9300000,
    likes: 378000,
    duration: '20:00',
    tags: ['yoga', 'fitness', 'beginner'],
    category: 'Fitness',
    verified: true,
  },
];

async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log('URI:', MONGODB_URI ? 'Found ✅' : 'Missing ❌');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!');

    console.log('🗑️  Clearing existing videos...');
    await Video.deleteMany({});

    console.log('🌱 Seeding videos...');
    await Video.insertMany(SAMPLE_VIDEOS);

    console.log(`✅ Successfully seeded ${SAMPLE_VIDEOS.length} videos!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();