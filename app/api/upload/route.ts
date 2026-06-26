import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
const uuidv4 = () => crypto.randomUUID();
import connectDB from '@/lib/mongodb';
import Video from '@/models/Video';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const channel = formData.get('channel') as string;
    const channelId = formData.get('channelId') as string;
    const channelAvatar = formData.get('channelAvatar') as string;
    const tags = formData.get('tags') as string;
    const videoUrl = formData.get('videoUrl') as string;
    const thumbnailUrl = formData.get('thumbnailUrl') as string;
    const videoFile = formData.get('videoFile') as File | null;
    const thumbnailFile = formData.get('thumbnailFile') as File | null;

    if (!title || !channel) {
      return NextResponse.json({ success: false, error: 'Title and channel are required' }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    let finalVideoUrl = videoUrl || '';
    let finalThumbnailUrl = thumbnailUrl || '';
    let duration = '0:00';

    // Handle video file upload
    if (videoFile && videoFile.size > 0) {
      const videoExt = videoFile.name.split('.').pop();
      const videoFileName = `${uuidv4()}.${videoExt}`;
      const videoPath = path.join(uploadsDir, videoFileName);
      const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
      await writeFile(videoPath, videoBuffer);
      finalVideoUrl = `/uploads/${videoFileName}`;
    }

    // Handle thumbnail file upload
    if (thumbnailFile && thumbnailFile.size > 0) {
      const thumbExt = thumbnailFile.name.split('.').pop();
      const thumbFileName = `${uuidv4()}.${thumbExt}`;
      const thumbPath = path.join(uploadsDir, thumbFileName);
      const thumbBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
      await writeFile(thumbPath, thumbBuffer);
      finalThumbnailUrl = `/uploads/${thumbFileName}`;
    }

    // Use picsum as default thumbnail if none provided
    if (!finalThumbnailUrl) {
      finalThumbnailUrl = `https://picsum.photos/seed/${uuidv4()}/640/360`;
    }

    // Save to MongoDB
    const video = await Video.create({
      title,
      description: description || '',
      thumbnail: finalThumbnailUrl,
      videoUrl: finalVideoUrl,
      channel,
      channelId: channelId || 'default',
      channelAvatar: channelAvatar || '',
      duration,
      tags: tags ? tags.split(',').map((t: string) => t.trim()) : [],
      category: category || 'General',
      verified: false,
      views: 0,
      likes: 0,
    });

    return NextResponse.json({ success: true, video }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
