"use client"
import {
    Field,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import FileUpload from "../Components/FileUpload"
import {
    Progress,
    ProgressLabel,
    ProgressValue,
} from "@/components/ui/progress"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { toast, ToastContainer } from "react-toastify"
import axios from "axios"
import { Loader2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const Upload = () => {

    const [showProgress, setShowProgress] = useState(false);
    const [progress, setProgress] = useState(0);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [fileId, setFileId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUploadCanceled, setIsUploadCanceled] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {

        try {

            console.log("Form Data:", data);

            if (!data.title || !data.description) {
                toast.error("Please Provide a title and description for your video.");
                return;
            }

            if (!videoUrl) {
                toast.error("Please upload a video before submitting.");
                return;
            }

            const response = await axios.post("/api/video", {
                title: data.title,
                description: data.description,
                videoUrl: videoUrl,
                fileId,
                thumbnailUrl: `${videoUrl}/ik-thumbnail.jpg`
            });

            if (response.data.success) {
                toast.success(response.data.message);
                reset();
            }

        } catch (error) {
            toast.error("An error occurred while uploading the video");
            console.error("Upload Error:", error);

        } finally {
            setShowProgress(false);
            setProgress(0);
            setVideoUrl(null);
        }

    }

    const handleCancelUpload = async () => {

        try {

            const response = await axios.post("/api/delete-video", { fileId });

            if (response.data.success) {

                toast.success(response.data.message);
                setVideoUrl(null);
                setFileId(null);
                setIsUploadCanceled(true);

            } else {
                toast.error("Failed to cancel the upload");
            }

        } catch (error) {
            console.error("Cancel Upload Error:", error);
            toast.error("An error occurred while canceling the upload");
        } finally {
            setIsDialogOpen(false);
        }

    }

    return (
        <div className="w-2/3 md:w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md border border-black mt-15">
            <ToastContainer />

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { handleCancelUpload(); }}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <h1 className="text-2xl font-bold mb-4">Upload Your Video</h1>

            {/* Input Fields */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                <Field className="flex flex-col">
                    <FieldLabel className="font-bold" htmlFor="video-title">Video Title</FieldLabel>
                    <Input
                        id="video-title"
                        type="text"
                        {...register("title", { required: true, minLength: { value: 3, message: "Title must be at least 3 characters long" } })}
                        placeholder="Enter your video title"
                        className="h-12 px-4 text-base border border-black"
                    />
                    {errors.title?.message && (
                        <span className="text-sm text-red-500">
                            {String(errors.title.message)}
                        </span>
                    )}
                </Field>

                <Field className="flex flex-col">
                    <FieldLabel className="font-bold" htmlFor="textarea-message">Video Description</FieldLabel>
                    <Textarea {...register("description", { required: true, minLength: { value: 10, message: "Description must be at least 10 characters long" } })} className="h-32 border border-black" id="textarea-message" placeholder="Enter the description for your video here..." />
                    {errors.description?.message && (
                        <span className="text-sm text-red-500">
                            {String(errors.description.message)}
                        </span>
                    )}
                </Field>


                <Field className="flex flex-col">
                    <FieldLabel className="font-bold">
                        Video
                    </FieldLabel>

                    <FileUpload
                        fileType={"video"}
                        reset={isUploadCanceled}
                        onUploadSuccess={(response) => {
                            console.log("Upload successful:", response);
                            setFileId(response.fileId);
                            setVideoUrl(response.url);
                            setShowProgress(false);
                        }}
                        onProgress={(response) => {
                            setShowProgress(true);
                            setProgress(response);
                        }}
                    />

                    {
                        showProgress &&
                        <Progress value={progress} className="w-full">
                            <ProgressLabel> <Loader2 className="animate-spin" /> Video Uploading...</ProgressLabel>
                            <ProgressValue />
                        </Progress>
                    }
                    {
                        videoUrl && (
                            <>
                                <Button type="submit" variant="default" className="ml-auto shadow text-lg py-5 px-4 mt-4 cursor-pointer">
                                    Upload Video
                                </Button>
                                <Button onClick={() => { setIsDialogOpen(true) }} type="button" variant="destructive" className="ml-auto shadow text-lg py-5 px-4 mb-4 cursor-pointer">
                                    Cancel Upload
                                </Button>
                            </>
                        )
                    }
                </Field>

            </form>

        </div>
    )
}

export default Upload
