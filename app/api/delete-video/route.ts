import VideoModel from '@/models/VideoModel';
import ImageKit from '@imagekit/nodejs';

export async function POST(request: Request) {

    const client = new ImageKit({
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY!
    });

    try {

        const { fileId }: { fileId: string } = await request.json();

        if (!fileId) {
            return Response.json({ success: false, message: "File ID is required" }, { status: 400 });
        }

        const result = await client.files.delete(fileId);

        // Also Delete The Video From The Database
        await VideoModel.findOneAndDelete({ fileId });

        return Response.json({ success: true, message: "Video Uploading Cancelled Successfully", result }, { status: 200 });

    } catch (error) {
        console.error("Delete Error:", error);
        return Response.json({ success: false, message: "An error occurred while deleting the video" }, { status: 500 });
    }

}