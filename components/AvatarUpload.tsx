"use client";
import React from "react";

const AvatarUpload = () => {
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [uploading, setUploading] = React.useState(false);
    const [uploadError, setUploadError] = React.useState<string | null>(null);
    const [uploadedUrl, setUploadedUrl] = React.useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setSelectedFile(file);
        setUploadError(null);
        setUploadedUrl(null);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setUploading(true);
        setUploadError(null);
        setUploadedUrl(null);
        const formData = new FormData();
        formData.append("file", selectedFile);
        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            setUploadedUrl(data.url || data.path || null);
        } catch (err: any) {
            setUploadError(err.message || "Upload error");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-2 w-full max-w-xs">
            <label className="block text-white font-medium mb-1">Upload Avatar</label>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-neutral-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {previewUrl && (
                <img
                    src={previewUrl}
                    alt="Avatar Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-400 mt-2"
                />
            )}
            <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="mt-2 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:opacity-50"
            >
                {uploading ? "Uploading..." : "Upload"}
            </button>
            {uploadError && <div className="text-red-400 text-xs mt-1">{uploadError}</div>}
            {uploadedUrl && (
                <div className="text-green-400 text-xs mt-1">Uploaded! <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="underline">View</a></div>
            )}
        </div>
    );
};

export default AvatarUpload;
