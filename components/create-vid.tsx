"use client";

import { UploadButton } from "@/lib/uploadthing";
import { UploadFileResponse } from "uploadthing/client";
import { Label } from "./ui/label";

export function CreateNewVideoPlaceholder({
  video,
  setVideo,
  attachments,
  setAttachments,
}: {
  video: UploadFileResponse | null;
  attachments: UploadFileResponse[];
  setVideo: (p: UploadFileResponse) => void;
  setAttachments: (p: UploadFileResponse[]) => void;
}) {
  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-10 w-10 text-muted-foreground"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="11" r="1" />
          <path d="M11 17a1 1 0 0 1 2 0c0 .5-.34 3-.5 4.5a.5.5 0 0 1-1 0c-.16-1.5-.5-4-.5-4.5ZM8 14a5 5 0 1 1 8 0" />
          <path d="M17 18.5a9 9 0 1 0-10 0" />
        </svg>

        <h3 className="mt-4 text-lg font-semibold">
          Upload video and attachments
        </h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          We support all major video formats, for documents we currently support
          PDFs
        </p>
        {video ? (
          <Label> {video.name} </Label>
        ) : (
          <UploadButton
            endpoint="videoUploader"
            onClientUploadComplete={(res) => {
              if (!res) return;
              setVideo(res?.[0]);
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />
        )}

        <UploadButton
          className="mb-4"
          endpoint="documentUploader"
          onClientUploadComplete={(res) => {
            if (!res) return;
            setAttachments([...attachments, ...res]);
          }}
          onUploadError={(error: Error) => {
            alert(`ERROR! ${error.message}`);
          }}
        />

        {attachments?.map((attachment) => {
          return (
            <Label key={attachment.key} className="mb-2">
              {" "}
              {attachment.name}{" "}
            </Label>
          );
        })}
        <button
          onClick={() => {
            fetch("/api/extract-audio", {
              method: "POST",
              body: JSON.stringify({
                videoUrl:
                  "https://utfs.io/f/ea5a3cd7-ed14-41fb-bbfe-063740705f74-1uswaj.mp4",
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });
          }}
        >
          {" "}
          Upload{" "}
        </button>
      </div>
    </div>
  );
}
