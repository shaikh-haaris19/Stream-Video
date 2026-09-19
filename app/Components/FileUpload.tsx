"use client"

import { Input } from "@/components/ui/input";
import {
    upload,
} from "@imagekit/next";
import axios from "axios";
import { useState } from "react";

interface FileUploadProps {
    onUploadSuccess: (response: any) => void;
    onProgress?: (progress: number) => void;
    fileType?: 'image' | 'video';
}

const FileUpload = ({
    onUploadSuccess,
    onProgress,
    fileType
}: FileUploadProps) => {

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Validate File
    const validateFile = (file: File) => {

        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Plase upload a valid video file");
            }
        }

        if (file.size > 100 * 1024 * 1024) {
            setError("File size should not exceed 100MB");
        }

        return true;

    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files?.[0];

        if (!file || !validateFile(file)) return;

        setUploading(true);
        setError(null);

        try {

            const response = await axios.get("/api/auth/upload-auth")

            const { signature, expire, token } = response.data.authenticationParams;

            const uploadFile = await upload({
                file,
                fileName: file.name,
                expire,
                token,
                signature,
                publicKey: response.data.publicKey,
                onProgress: (event) => {
                    if (event.lengthComputable && onProgress) {
                        const progress = (event.loaded / event.total) * 100;
                        onProgress(Math.round(progress));
                    }
                },
            })

            onUploadSuccess(uploadFile);

        } catch (error) {
            console.error("Upload failed:", error);

        } finally {
            setUploading(false);
        }

    }

    return (
        <>
            <div className="flex items-center gap-3 border border-black rounded-sm">
                <label
                    htmlFor="file-upload"
                    className="border-r text-sm md:text-base border-black bg-gray-50 px-2 md:px-4 py-2 rounded-sm cursor-pointer"
                >
                    Choose {fileType === "video" ? "Video" : "Image"}
                </label>

                <span className="text-sm text-muted-foreground">
                    {fileType === "video"
                        ? "MP4, WebM, MOV"
                        : "JPG, PNG, WebP"}
                </span>

                <Input
                    id="file-upload"
                    type="file"
                    accept={fileType === "video" ? "video/*" : "image/*"}
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
        </>
    );
};

export default FileUpload;