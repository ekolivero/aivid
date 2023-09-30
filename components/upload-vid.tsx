import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UploadFileResponse } from "uploadthing/client";

export function UploadVideo({
  video,
  attachments,
}: {
  video: UploadFileResponse | null;
  attachments: UploadFileResponse[];
}) {
  const isDisabled = !video || attachments.length === 0;

  return (
    <div className="flex flex-1 justify-center items-center mt-4">
      <Dialog>
        <DialogTrigger disabled={isDisabled} className={cn(buttonVariants())}>
          Upload Video
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Some information</DialogTitle>
            <DialogDescription>
              Add some information about your video
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Video Title</Label>
              <Input id="title " placeholder="My awesome video" />
            </div>
          </div>
          <DialogFooter>
            <Button>Upload video</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
