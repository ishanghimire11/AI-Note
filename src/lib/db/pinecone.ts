import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_API_KEY;

if (!apiKey) {
  throw new Error("Invalid API key for PINECONE");
}

const pinecone = new Pinecone({ apiKey });

export const notesIndex = pinecone.Index("notebot");
