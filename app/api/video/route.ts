import { NextResponse, NextRequest } from "next/server";
import VideoModel, { VIDEO_DIMENSIONS, VideoInterface } from "@/models/VideoModel";
import { connectDB } from "@/lib/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

// Controller Func To Get All Videos
export async function GET() {

    try {

        connectDB();

        // Fetch all videos from the database
        const videos = await VideoModel.find({}).sort({ createdAt: -1 }).lean();

        if (!videos || videos.length === 0) {
            return NextResponse.json({ videos: [] }, { status: 404 });
        }

        return NextResponse.json({ videos });

    } catch (error) {

        console.error(error);
        return NextResponse.json({ error: "Failed to get videos" }, { status: 500 });

    }

}


//Controller Func To Upload Video
export async function POST(request: NextRequest) {

    try {

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "User Not Authenticated" }, { status: 401 });
        }

        const body = await request.json();

        if (!body.title || !body.description || !body.videoUrl || !body.thumbnailUrl) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        connectDB();

        const videoData: VideoInterface = {
            ...body,
            transformations: {
                width: VIDEO_DIMENSIONS.width,
                height: VIDEO_DIMENSIONS.height,
                quality: body.transformations?.quality
            }
        };

        const newVideo = new VideoModel(videoData);
        await newVideo.save();

        return NextResponse.json({ message: "Video uploaded successfully", newVideo }, { status: 200 });

    } catch (error) {

        console.error(error);
        return NextResponse.json({ error: "Failed to upload video" }, { status: 500 });

    }

}