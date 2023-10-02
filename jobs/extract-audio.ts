import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "@/trigger";
import ffmpeg from "fluent-ffmpeg";

client.defineJob({
  id: "extract-audio",
  name: "Extract audio from video",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "extract-audio",
  }),
  run: async (payload, io, ctx) => {
    const videoUrl = payload.videoUrl; // Assuming the video URL is provided in the payload

    // Define a function to extract audio
    const extractAudio = (url: string) => {
      return new Promise((resolve, reject) => {
        let audioBuffer = [] as any[];

        ffmpeg(url)
          .toFormat("wav")
          .on("data", (chunk: any) => {
            audioBuffer.push(chunk);
          })
          .on("end", () => {
            const audioData = Buffer.concat(audioBuffer);
            resolve(audioData);
          })
          .on("error", (err: any) => {
            reject(err);
          })
          .pipe(io, { end: true }); // Assuming 'io' can be used to send the response back
      });
    };

    try {
      const audioData = await extractAudio(videoUrl);
      // You can now use the audioData or send it as a response
      // For example:
      console.log(audioData);
    } catch (error) {}
  },
});
