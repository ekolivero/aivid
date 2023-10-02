import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "@/trigger";
import { promisify } from "util";
import fs from "fs";
import { exec } from "node:child_process";

const execAsync = promisify(exec);

async function transcribeAudio(filePath: any) {
  const endpoint = `https://speech.googleapis.com/v1/speech:recognize?key=${process.env.GOOGLE_API_KEY}`;

  const audioContent = fs.readFileSync(filePath).toString("base64");

  const requestPayload = {
    config: {
      encoding: "LINEAR16",
      sampleRateHertz: 16000,
      languageCode: "en-US",
    },
    audio: {
      content: audioContent,
    },
  };

  const response = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify(requestPayload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `API request failed with status ${
        response.status
      }: ${await response.text()}`
    );
  }

  const data = await response.json();
  const transcription = data.results
    .map((result: any) => result.alternatives[0].transcript)
    .join("\n");

  return transcription;
}

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
    async function downloadVideoAndExtractAudio(
      videoUrl: string,
      outputAudioPath: string
    ) {
      console.log(videoUrl);
      let tempVideoPath = "temp_video.mp4";
      // Download the video
      try {
        const response = await fetch(videoUrl);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch the video. Status: ${response.status}`
          );
        }

        const videoArrayBuffer = await response.arrayBuffer();
        const videoBuffer = Buffer.from(videoArrayBuffer);

        fs.writeFileSync(tempVideoPath, videoBuffer);
        console.log(`Video saved to ${tempVideoPath}`);
      } catch (error) {
        console.error("Error downloading or saving the video:", error);
      }
      console.log("Extracting audio...");
      try {
        await execAsync(
          `ffmpeg -i ${tempVideoPath} -vn -acodec pcm_s16le -ar 16000 -ac 1 audio.wav`
        );
        console.log("Audio extracted successfully!");
        transcribeAudio("audio.wav")
          .then((transcription) => {
            console.log("Transcription:", transcription);
          })
          .catch((error) => {
            console.error("Error transcribing the audio:", error);
          });
        // Optionally, delete the temporary video file
        fs.unlinkSync("audio.wav");
        fs.unlinkSync(tempVideoPath);
      } catch (error) {
        io.logger.error("Something went wrong", {
          error,
        });
        console.error(`Error extracting audio: ${error}`);
        throw new Error("Error extracting audio");
      }

      // Use FFmpeg to extract aud
    }

    try {
      const audioData = await downloadVideoAndExtractAudio(
        videoUrl,
        "audio.mp3"
      );
      // You can now use the audioData or send it as a response
      // For example:
      return {
        name: "erik",
      };
    } catch (error) {
      await io.logger.error("Something went wrong", {
        error,
      });
      return {
        name: "erik - error",
      };
    }
  },
});
