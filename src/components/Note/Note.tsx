"use client";

import { useState } from "react";
import { Note as NoteModel } from "@prisma/client";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import CreateNoteDialog from "@/components/CreateNoteDialog";

interface NoteProps {
  note: NoteModel;
}

export function Note({ note }: NoteProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const wasUpdated = note.updatedAt > note.createdAt;

  const timeStamp = (wasUpdated ? note.updatedAt : note.createdAt)
    .toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/,/g, "");

  return (
    <>
      <Card
        onClick={() => setShowEditDialog(true)}
        className="flex h-fit cursor-pointer flex-col gap-y-4 p-4 transition-all duration-300 hover:ring-1 hover:ring-zinc-500"
      >
        <CardTitle className="pr-12">{note.title}</CardTitle>
        {note.content && (
          <CardContent className="p-0">
            <p className="whitespace-pre-line">{note.content}</p>
          </CardContent>
        )}
        <CardFooter className="mt-auto p-0 text-xs opacity-60">
          Last updated: {timeStamp}
        </CardFooter>
      </Card>
      <CreateNoteDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        noteToEdit={note}
        type="Edit"
      />
    </>
  );
}
