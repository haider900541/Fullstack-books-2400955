"use client";

import React, { useCallback, useState, Dispatch, SetStateAction } from "react";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { Button } from "../ui/button";
import Image from "next/image";
import { UploadCloud } from "lucide-react";
import clsx from "clsx";

type FileUploaderProps = {
  onFieldChange: (uploadedUrl: string, rawFile?: File[]) => Promise<void> | void;
  imageUrl: string;
  setFiles: Dispatch<SetStateAction<File[]>>;
};

export function FileUploader({
  onFieldChange,
  imageUrl,
  setFiles,
}: FileUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsLoading(true);
      setFiles(acceptedFiles);
      await onFieldChange("", acceptedFiles);
      setIsLoading(false);
    },
    [onFieldChange, setFiles]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(["image/*"]),
    disabled: isLoading,
  });

  return (
    <div
      {...getRootProps()}
      className={clsx(
        "relative group w-full h-72 rounded-xl border border-dashed transition-all duration-300 overflow-hidden cursor-pointer",
        "bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md hover:shadow-md hover:border-gray-400"
      )}
    >
      <input {...getInputProps()} className="cursor-pointer" />

      {/* Uploading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm text-white transition-all">
          <div className="relative w-12 h-12 mb-2">
            <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-white animate-spin" />
            <div className="absolute inset-1 rounded-full bg-white/10 blur" />
          </div>
          <p className="text-sm font-medium animate-pulse">Uploading...</p>
        </div>
      )}

      {/* Uploaded Preview */}
      {!isLoading && imageUrl ? (
        <div className="w-full h-full relative">
          <Image
            src={imageUrl}
            alt="Uploaded preview"
            fill
            className="object-cover object-center transition-opacity duration-300 group-hover:opacity-80"
          />
          <div className="absolute bottom-2 right-2 bg-white/80 px-2 py-1 text-xs rounded shadow">
            Click to replace
          </div>
        </div>
      ) : (
        // Upload UI
        <div className="flex flex-col items-center justify-center text-center px-4 text-gray-500 h-full z-0">
          <UploadCloud className="w-10 h-10 mb-3 text-gray-400 group-hover:text-primary transition-colors" />
          <p className="text-sm font-medium">Drag & drop your image here</p>
          <p className="text-xs text-gray-400 mb-4">SVG, PNG, JPG (max 5MB)</p>
          <Button
            type="button"
            variant="secondary"
            className="rounded-full px-5 py-1 text-sm"
          >
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
}
