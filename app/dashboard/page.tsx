"use client";
import { Sidebar } from "@/components/sidebar";
import { CreateNewVideoPlaceholder } from "@/components/create-vid";
import { UploadVideo } from "@/components/upload-vid";
import { UploadFileResponse } from "uploadthing/client";
import { useState } from "react";

export default function Dashboard() {
  const [video, setVideo] = useState<UploadFileResponse | null>(null);
  const [attachments, setAttachments] = useState<UploadFileResponse[]>([]);

  return (
    <div className="border-t">
      <div className="bg-background">
        <div className="grid lg:grid-cols-5">
          <Sidebar className="hidden lg:block" />
          <div className="col-span-3 lg:col-span-4 lg:border-l p-4">
            <CreateNewVideoPlaceholder
              setVideo={setVideo}
              video={video}
              attachments={attachments}
              setAttachments={setAttachments}
            />
            <UploadVideo video={video} attachments={attachments} />
          </div>
        </div>
      </div>
    </div>
  );
}
