import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  channel: string;
  channelId: string;
  channelAvatar: string;
  views: number;
  likes: number;
  dislikes: number;
  duration: string;
  tags: string[];
  category: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    thumbnail: { type: String, required: true },
    videoUrl: { type: String, default: '' },
    channel: { type: String, required: true },
    channelId: { type: String, required: true },
    channelAvatar: { type: String, default: '' },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    duration: { type: String, default: '0:00' },
    tags: [{ type: String }],
    category: { type: String, default: 'General' },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Add text index for search
VideoSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);
