"use client";

import React from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { X } from "lucide-react";

import "@/app/uploadthing-styles.css";

type FileUploaderType = {
  endpoint: "serverImage" | "fileMessage";
  value: string;
  onChange: (url?: string) => void;
};

const FileUploader = ({ endpoint, value, onChange }: FileUploaderType) => {
  const fileType = value.split(".").pop();
  if (fileType && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="image" className="rounded-full" />
        <button
          className="p-1 bg-rose-500 text-white rounded-full absolute top-0 right-0 shadow-sm cursor-pointer"
          onClick={() => onChange("")}
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className='uploadthing-wrapper'>
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => onChange(res[0].url)}
        onUploadError={(err) => {
          console.log("err", err);
        }}
      />
    </div>

  );
};

export default FileUploader;
