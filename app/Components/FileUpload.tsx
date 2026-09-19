"use client"

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

        }finally {
            setUploading(false);
        }

    }

    return (
        <>
            <input
                type="file"
                accept={fileType === "video" ? "video/*" : "image/*"}
                onChange={handleFileChange}
            />
            {
                uploading && <p>Uploading...</p>
            }
        </>
    );
};

export default FileUpload;