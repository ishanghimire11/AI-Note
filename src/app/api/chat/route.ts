import { notesIndex } from "@/lib/db/pinecone";
import openai, { getEmbedding } from "@/lib/openai/openai";
import { auth } from "@clerk/nextjs";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import prisma from "@/lib/db/prisma";
import { OpenAIStream, StreamingTextResponse, streamToResponse } from "ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages;

    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Not authorized" }, { status: 401 });
    }

    const messsagesTruncated = messages.slice(-4);
    const embedding = await getEmbedding(
      messsagesTruncated.map((message) => message.content).join("\n"),
    );

    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      topK: 4,
      filter: { userId },
    });

    const filteredNotes = await prisma.note.findMany({
      where: { id: { in: vectorQueryResponse.matches.map((m) => m.id) } },
    });

    console.log(filteredNotes, "filtered notes");
    const systemMessage: ChatCompletionMessage = {
      role: "assistant",
      content:
        "You are a intelligent AI bot whose speciality is in note taking. You answer the user's question based on their existing notes. You give short and precise answers only, no extra texts." +
        "The relavent notes for this query are:\n" +
        filteredNotes
          .map((note) => `Title: ${note.title}\n\n Content:\n${note.content}`)
          .join("\n\n"),
    };
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [systemMessage, ...messsagesTruncated],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
