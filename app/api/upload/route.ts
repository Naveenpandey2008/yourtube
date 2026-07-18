import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Video from "@/models/Video";
import cloudinary from "@/lib/cloudinary";
import streamifier from "streamifier";

function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  resourceType: "image" | "video"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const channel = formData.get("channel") as string;
    const channelId = formData.get("channelId") as string;
    const channelAvatar = formData.get("channelAvatar") as string;
    const tags = formData.get("tags") as string;
    const duration = (formData.get("duration") as string) || "0:00";

    let videoUrl = formData.get("videoUrl") as string;
    let thumbnailUrl = formData.get("thumbnailUrl") as string;

    const videoFile = formData.get("videoFile") as File | null;
    const thumbnailFile = formData.get("thumbnailFile") as File | null;

    if (!title || !channel) {
      return NextResponse.json(
        {
          success: false,
          error: "Title and channel are required",
        },
        { status: 400 }
      );
    }

    // Upload Video
    if (videoFile && videoFile.size > 0) {
      const buffer = Buffer.from(await videoFile.arrayBuffer());

      videoUrl = await uploadToCloudinary(
        buffer,
        "youtube-clone/videos",
        "video"
      );
    }

    // Upload Thumbnail
    if (thumbnailFile && thumbnailFile.size > 0) {
      const buffer = Buffer.from(await thumbnailFile.arrayBuffer());

      thumbnailUrl = await uploadToCloudinary(
        buffer,
        "youtube-clone/thumbnails",
        "image"
      );
    }

    if (!thumbnailUrl) {
      thumbnailUrl = `https://picsum.photos/seed/${Date.now()}/640/360`;
    }

    const video = await Video.create({
      title,
      description: description || "",
      thumbnail: thumbnailUrl,
      videoUrl,
      channel,
      channelId: channelId || "default",
      channelAvatar: channelAvatar || "",
   duration,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      category: category || "General",
      verified: false,
      views: 0,
      likes: 0,
    });

    return NextResponse.json(
      {
        success: true,
        video,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);
throw error;

    return NextResponse.json(
      {
        success: false,
        error: "Upload failed",
      },
      { status: 500 }
    );
  }
}