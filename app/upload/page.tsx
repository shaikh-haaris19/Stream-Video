"use client"
import {
    Field,
    FieldDescription,
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

const Upload = () => {

    const [showProgress, setShowProgress] = useState(false);
    const [progress, setProgress] = useState(0);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    const handleVideoSubmit = async (videoUrl: string) => {

        try {

        } catch (error) {

        }

    }

    return (
        <div className="w-2/3 md:w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md border border-black mt-15">

            <h1 className="text-2xl font-bold mb-4">Upload Your Video</h1>

            {/* Input Fields */}
            <div className="space-y-4">

                <Field className="flex flex-col">
                    <FieldLabel className="font-bold" htmlFor="video-title">Video Title</FieldLabel>
                    <Input
                        id="video-title"
                        type="text"
                        placeholder="Enter your video title"
                        className="h-12 px-4 text-base border border-black"
                    />
                </Field>

                <Field className="flex flex-col">
                    <FieldLabel className="font-bold" htmlFor="textarea-message">Video Description</FieldLabel>
                    <Textarea className="h-32 border border-black" id="textarea-message" placeholder="Enter the description for your video here..." />
                </Field>

                <Field className="flex flex-col">
                    <FieldLabel className="font-bold">
                        Video
                    </FieldLabel>

                    <FileUpload
                        fileType="video"
                        onUploadSuccess={(response) => {
                            setVideoUrl(response.url);
                            setShowProgress(false);
                        }}
                        onProgress={(progress) => {
                            console.log("Upload Progress:", progress);
                            setShowProgress(true);
                            setProgress(progress);
                        }}
                    />

                    {
                        showProgress &&
                        <Progress value={progress} className="w-full">
                            <ProgressLabel>Upload progress</ProgressLabel>
                            <ProgressValue />
                        </Progress>
                    }
                    {
                        videoUrl && (
                            <Button onClick={() => handleVideoSubmit(videoUrl)} variant="default" className="ml-auto shadow text-lg py-5 px-4 mt-4 cursor-pointer">
                                Upload Video
                            </Button>
                        )
                    }
                </Field>

            </div>

        </div>
    )
}

export default Upload
