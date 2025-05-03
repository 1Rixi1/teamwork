"use client";

import React from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { FileIcon, X } from "lucide-react";

import "@/app/uploadthing-styles.css";

type FileUploaderType = {
  endpoint: "serverImage" | "fileMessage";
  value: string;
  onChange: (url?: string) => void;
};

function safeParse(value: string) {
  try {
    return value.trim().startsWith("{") ? JSON.parse(value) : { url: value };
  } catch (err) {
    return { url: value };
  }
}

const FileUploader = ({ endpoint, value, onChange }: FileUploaderType) => {
  const parsed = value ? safeParse(value) : null;

  const isPdf = parsed?.mine === "application/pdf";
  if (parsed && parsed.url && !isPdf) {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={parsed.url} alt="image" className="rounded-full" />
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

  if (parsed && isPdf) {
    const displayName = parsed.name;

    return (
      <div className="relative rounded-md p-2 mt-2 bg-gray-400/20">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />

        <a
          className="ml-2 text-sm text-indigo-500 inline-block max-w-[220px] overflow-hidden text-ellipsis
           dark:text-indigo-400 hover:underline"
          href={parsed.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {displayName}
        </a>

        <button
          className="p-1 bg-rose-500 text-white rounded-full absolute -top-2 -right-2 shadow-sm cursor-pointer"
          onClick={() => onChange("")}
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="uploadthing-wrapper">
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(
            JSON.stringify({
              url: res[0].url,
              mine: res[0].type,
              name: res[0].name,
            }),
          );
        }}
        onUploadError={(err) => {
          console.log("err", err);
        }}
      />
    </div>
  );
};

export default FileUploader;
