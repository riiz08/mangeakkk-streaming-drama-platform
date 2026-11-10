"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  FolderUp,
  FileVideo,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  FileCheck,
} from "lucide-react";

interface R2UploaderProps {
  mode: "image" | "video-folder";
  folderPrefix?: string;
  label?: string;
  currentUrl?: string;
  onUploadComplete: (url: string) => void;
}

interface UploadStatus {
  totalFiles: number;
  completedFiles: number;
  currentFileName: string;
  percentage: number;
  isUploading: boolean;
  isSuccess: boolean;
  errorMessage: string | null;
  uploadedUrl: string | null;
}

export default function R2Uploader({
  mode,
  folderPrefix = "media",
  label,
  currentUrl,
  onUploadComplete,
}: R2UploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<UploadStatus>({
    totalFiles: 0,
    completedFiles: 0,
    currentFileName: "",
    percentage: 0,
    isUploading: false,
    isSuccess: false,
    errorMessage: null,
    uploadedUrl: currentUrl || null,
  });

  // Handle image upload (single file)
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus({
      totalFiles: 1,
      completedFiles: 0,
      currentFileName: file.name,
      percentage: 10,
      isUploading: true,
      isSuccess: false,
      errorMessage: null,
      uploadedUrl: null,
    });

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "poster");
      formData.append("folder", folderPrefix || "posters");

      setStatus((prev) => ({ ...prev, percentage: 50 }));

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengunggah gambar ke R2.");
      }

      setStatus({
        totalFiles: 1,
        completedFiles: 1,
        currentFileName: file.name,
        percentage: 100,
        isUploading: false,
        isSuccess: true,
        errorMessage: null,
        uploadedUrl: data.url,
      });

      onUploadComplete(data.url);
    } catch (err: any) {
      setStatus((prev) => ({
        ...prev,
        isUploading: false,
        isSuccess: false,
        errorMessage: err.message || "Gagal upload.",
      }));
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Handle HLS Folder upload (folder containing .m3u8 and .ts segments)
  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    const total = files.length;

    // Locate primary .m3u8 file
    const m3u8File = files.find((f) => f.name.toLowerCase().endsWith(".m3u8"));
    if (!m3u8File && mode === "video-folder") {
      alert("Folder yang dipilih tidak memiliki file manifest .m3u8!");
      return;
    }

    setStatus({
      totalFiles: total,
      completedFiles: 0,
      currentFileName: "Menyiapkan file...",
      percentage: 0,
      isUploading: true,
      isSuccess: false,
      errorMessage: null,
      uploadedUrl: null,
    });

    let completed = 0;
    let finalManifestUrl = "";

    // Upload files in concurrency chunks of 3 to optimize speed and reliability
    const CONCURRENCY = 3;
    const cleanFolder = folderPrefix || `hls_${Date.now()}`;

    try {
      for (let i = 0; i < files.length; i += CONCURRENCY) {
        const chunk = files.slice(i, i + CONCURRENCY);

        await Promise.all(
          chunk.map(async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", "video");
            formData.append("folder", cleanFolder);
            // webkitRelativePath provides the file path inside folder
            const relativePath = file.webkitRelativePath
              ? file.webkitRelativePath.split("/").slice(1).join("/") || file.name
              : file.name;
            formData.append("relativePath", relativePath);

            setStatus((prev) => ({
              ...prev,
              currentFileName: file.name,
            }));

            const res = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
              throw new Error(data.error || `Gagal mengunggah ${file.name}`);
            }

            if (file.name.toLowerCase().endsWith(".m3u8")) {
              finalManifestUrl = data.url;
            }

            completed++;
            const pct = Math.round((completed / total) * 100);
            setStatus((prev) => ({
              ...prev,
              completedFiles: completed,
              percentage: pct,
            }));
          })
        );
      }

      setStatus({
        totalFiles: total,
        completedFiles: total,
        currentFileName: "Semua file berhasil diunggah!",
        percentage: 100,
        isUploading: false,
        isSuccess: true,
        errorMessage: null,
        uploadedUrl: finalManifestUrl,
      });

      if (finalManifestUrl) {
        onUploadComplete(finalManifestUrl);
      }
    } catch (err: any) {
      setStatus((prev) => ({
        ...prev,
        isUploading: false,
        isSuccess: false,
        errorMessage: err.message || "Gagal mengunggah sebagian file.",
      }));
    } finally {
      if (folderInputRef.current) folderInputRef.current.value = "";
    }
  };

  // Handle single video file upload (.mp4 or .m3u8 directly)
  const handleSingleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus({
      totalFiles: 1,
      completedFiles: 0,
      currentFileName: file.name,
      percentage: 20,
      isUploading: true,
      isSuccess: false,
      errorMessage: null,
      uploadedUrl: null,
    });

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "video");
      formData.append("folder", folderPrefix || "single_videos");
      formData.append("relativePath", file.name);

      setStatus((prev) => ({ ...prev, percentage: 60 }));

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengunggah video ke R2.");
      }

      setStatus({
        totalFiles: 1,
        completedFiles: 1,
        currentFileName: file.name,
        percentage: 100,
        isUploading: false,
        isSuccess: true,
        errorMessage: null,
        uploadedUrl: data.url,
      });

      onUploadComplete(data.url);
    } catch (err: any) {
      setStatus((prev) => ({
        ...prev,
        isUploading: false,
        isSuccess: false,
        errorMessage: err.message || "Gagal upload video.",
      }));
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2 mt-1.5">
      {/* Upload Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {mode === "image" ? (
          <>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleImageFileChange}
              disabled={status.isUploading}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={status.isUploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors disabled:opacity-50"
            >
              {status.isUploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-400" />
              ) : (
                <Upload className="w-3.5 h-3.5 text-brand-400" />
              )}
              <span>{label || "Upload Gambar ke R2"}</span>
            </button>
          </>
        ) : (
          <>
            {/* Hidden directory input */}
            <input
              type="file"
              ref={folderInputRef}
              className="hidden"
              // @ts-expect-error webkitdirectory is standard for folder uploads in browsers
              webkitdirectory=""
              directory=""
              multiple
              onChange={handleFolderUpload}
              disabled={status.isUploading}
            />

            {/* Hidden single file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".m3u8,.mp4"
              className="hidden"
              onChange={handleSingleVideoUpload}
              disabled={status.isUploading}
            />

            <button
              type="button"
              onClick={() => folderInputRef.current?.click()}
              disabled={status.isUploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-200 text-xs font-semibold border border-indigo-700/60 transition-colors disabled:opacity-50"
              title="Pilih folder yang berisi playlist.m3u8 dan file segment .ts"
            >
              {status.isUploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              ) : (
                <FolderUp className="w-3.5 h-3.5 text-indigo-400" />
              )}
              <span>Upload Folder HLS (.m3u8 + .ts)</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={status.isUploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold border border-zinc-700 transition-colors disabled:opacity-50"
              title="Upload file video tunggal (.mp4 atau .m3u8)"
            >
              <FileVideo className="w-3.5 h-3.5 text-zinc-400" />
              <span>File Tunggal (.mp4 / .m3u8)</span>
            </button>
          </>
        )}
      </div>

      {/* Upload Progress Bar & Detail */}
      {status.isUploading && (
        <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-zinc-300">
            <span className="font-semibold flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin text-brand-400" />
              Mengupload {status.completedFiles}/{status.totalFiles} file...
            </span>
            <span className="font-bold text-brand-400">{status.percentage}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-600 to-indigo-500 rounded-full transition-all duration-200"
              style={{ width: `${status.percentage}%` }}
            />
          </div>

          <p className="text-[11px] text-zinc-400 truncate">
            Sedang memproses: <code className="text-zinc-200">{status.currentFileName}</code>
          </p>
        </div>
      )}

      {/* Success Notification */}
      {status.isSuccess && status.uploadedUrl && (
        <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">Tersimpan di Cloudflare R2!</span>
          </div>
          <a
            href={status.uploadedUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-emerald-400 underline hover:text-emerald-300 shrink-0"
          >
            Buka Link
          </a>
        </div>
      )}

      {/* Error Notification */}
      {status.errorMessage && (
        <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{status.errorMessage}</span>
        </div>
      )}

      {/* Image Preview if mode is image and currentUrl exists */}
      {mode === "image" && (currentUrl || status.uploadedUrl) && (
        <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800 max-w-sm">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700">
            <Image
              src={status.uploadedUrl || currentUrl || ""}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              Preview Gambar
            </p>
            <p className="text-[10px] text-zinc-500 truncate">{status.uploadedUrl || currentUrl}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setStatus((prev) => ({ ...prev, uploadedUrl: null }));
              onUploadComplete("");
            }}
            className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
            title="Hapus"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

