import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  videoId: string;
  userId: string;
  user: string;
  avatar: string;
  text: string;
  likes: number;
  dislikes: number;
  parentId: string | null;
  replies: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    videoId: { type: String, required: true },
    userId: { type: String, required: true },
    user: { type: String, required: true },
    avatar: { type: String, default: '' },
    text: { type: String, required: true, trim: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    parentId: { type: String, default: null },
    replies: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
