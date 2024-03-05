import React from "react";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import { Note } from "@/components/Note/Note";

const Notes = async () => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not found");
  }

  const allNotes = await prisma.note.findMany({ where: { userId } });

  return (
    <div className="grid auto-rows-auto grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {allNotes.map((note) => {
        return <Note key={note.id} note={note} />;
      })}
      <div className="col-span-full pt-8 text-center">
        {allNotes.length === 0 && (
          <span>No notes found. Create to see some magic.</span>
        )}
      </div>
    </div>
  );
};

export default Notes;
