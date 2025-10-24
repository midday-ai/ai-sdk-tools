import { openai } from "@ai-sdk/openai";
import { experimental_transcribe as transcribe } from "ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Parse multipart form data
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 },
      );
    }

    // Convert File to Buffer for AI SDK
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    // Transcribe using AI SDK - pass Buffer directly
    const result = await transcribe({
      model: openai.transcription("gpt-4o-mini-transcribe"),
      audio: audioBuffer,
    });

    return NextResponse.json({
      transcription: result.text,
    });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Transcription failed",
      },
      { status: 500 },
    );
  }
}
