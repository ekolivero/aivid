import { client } from "@/trigger";

export async function POST(request: Request) {
  const { videoUrl } = await request.json();

  const data = await client.sendEvent({
    name: "extract-audio",
    payload: {
      videoUrl,
    },
  });

  console.log(data);

  return Response.json({
    name: "erik",
  });
}
