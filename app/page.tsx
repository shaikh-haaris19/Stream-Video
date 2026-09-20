"use client";

import { VideoInterface } from "@/models/VideoModel";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Video } from "@imagekit/next";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Home() {

  const [videos, setVideos] = useState<VideoInterface[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fileIdToDelete, setFileIdToDelete] = useState<string | null>(null);

  // Fetch videos
  const fetchAllVideos = async () => {

    try {

      const response = await axios.get("/api/video");

      if (response.data.success) {
        setVideos(response.data.videos);
      } else {
        toast.error("Failed to fetch videos");
      }

    } catch (error) {

      console.error("Error fetching videos:", error);
      toast.error("Error fetching videos");

    }
  };

  useEffect(() => {
    fetchAllVideos();
  }, []);

  // Delete video
  const handleDeleteVideo = async () => {

    if (!fileIdToDelete) {
      toast.error("Unable to delete video! Please try again.");
      return;
    }

    try {

      const response = await axios.post("/api/delete-video", {
        fileId: fileIdToDelete,
      });

      if (response.data.success) {

        toast.success("Video deleted successfully!");

        // Remove deleted video from UI immediately
        setVideos(previousVideos =>
          previousVideos.filter(video => video.fileId !== fileIdToDelete)
        );

      } else {

        toast.error("Failed to delete the video");

      }

    } catch (error) {

      console.error("Delete Video Error:", error);
      toast.error("An error occurred while deleting the video");

    } finally {

      setIsDialogOpen(false);
      setFileIdToDelete(null);

    }
  };

  return (
    <div className="container mx-auto p-4">

      <ToastContainer />

      {/* Delete Confirmation Dialog */}

      <AlertDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >

        <AlertDialogContent>

          <AlertDialogHeader>

            <AlertDialogTitle>
              Are you sure?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. This will permanently
              delete this video from ImageKit.
            </AlertDialogDescription>

          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                handleDeleteVideo();
              }}
            >
              Continue
            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>

      </AlertDialog>


      <h1 className="text-2xl font-bold mb-4">
        Welcome to the Video Upload App
      </h1>


      {/* Videos */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {videos.length > 0 ? (

          videos.map((video) => (

            <div
              key={video.videoUrl}
              className="border p-4 rounded shadow"
            >

              {/* Delete Button */}

              <div className="flex justify-end">

                <Button
                  type="button"
                  variant="destructive"
                  className="mb-2 cursor-pointer"
                  onClick={() => {

                    setFileIdToDelete(video.fileId!);
                    setIsDialogOpen(true);

                  }}
                >
                  Delete Video

                  <X className="h-4 w-4" />
                </Button>

              </div>


              {/* Video */}

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


              {/* Video Information */}

              <h2 className="text-lg font-semibold mt-2">
                {video.title}
              </h2>

              <p className="text-gray-600">
                {video.description}
              </p>

            </div>

          ))

        ) : (

          <p>No videos available.</p>

        )}

      </div>

    </div>
  );
}