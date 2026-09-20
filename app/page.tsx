"use client";
import { VideoInterface } from "@/models/VideoModel";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Video } from '@imagekit/next';

export default function Home() {

  const [videos, setVideos] = useState<VideoInterface[]>([]);

  useEffect(() => {

    const fetchAllVideos = async () => {

      try {

        const response = await axios.get("/api/video");

        if (response.data.success) {
          setVideos(response.data.videos);
        } else {
          toast.error("Failed to fetch videos");
        }

      } catch (error) {
        toast.error("Error fetching videos");
        console.error("Error fetching videos:", error);
      }
    }

    fetchAllVideos();

  }, []);

  return (
    <div className="container mx-auto p-4">

      <h1 className="text-2xl font-bold mb-4">Welcome to the Video Upload App</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.length > 0 ? (

          videos.map(video => (
            <div key={video.videoUrl} className="border p-4 rounded shadow">
              <Video
                urlEndpoint="https://ik.imagekit.io/haaris19"
                src={video.videoUrl}
                width={video.transformations?.width}
                height={video.transformations?.height}
                transformation={[
                  {
                    height: video.transformations?.height,
                    width: video.transformations?.width,
                    quality: video.transformations?.quality,
                  },
                ]}
                controls={video.controls}
              />
              <h2 className="text-lg font-semibold mt-2">{video.title}</h2>
              <p className="text-gray-600">{video.description}</p>
            </div>
          ))

        ) : (
          <p>No videos available.</p>
        )}
      </div>

    </div>
  );
}
