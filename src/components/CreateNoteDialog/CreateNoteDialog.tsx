import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import {
  CreateNoteSchema,
  createNoteSchema,
} from "@/lib/validation/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LoaderButton from "../ui/loader-button";
import { useRouter } from "next/navigation";
import { Note } from "@prisma/client";
import { Button } from "../ui/button";

interface CreateNoteDialogProps {
  open: boolean;
  setOpen(open: boolean): void;
  noteToEdit?: Note;
  type: "Add" | "Edit";
}

export const CreateNoteDialog = ({
  open,
  setOpen,
  noteToEdit,
  type,
}: CreateNoteDialogProps) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] =
    useState<boolean>(false);

  const router = useRouter();

  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: noteToEdit?.title || "",
      content: noteToEdit?.content || "",
    },
  });

  async function onSubmit(input: CreateNoteSchema) {
    try {
      if (noteToEdit) {
        const response = await fetch("/api/notes", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: noteToEdit.id,
            ...input,
          }),
        });
        if (!response.ok) {
          throw new Error(
            "Couldn't create a note. Try again later." + response.status,
          );
        }
      } else {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });
        if (!res.ok) {
          throw new Error(
            "Couldn't create a note. Try again later." + res.status,
          );
        }
        form.reset();
      }
      router.refresh();
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  }

  const deleteNote = async () => {
    if (!noteToEdit) return;
    setIsDeleting(true);
    try {
      const response = await fetch("/api/notes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: noteToEdit.id,
        }),
      });
      if (!response.ok) {
        throw new Error(
          "Couldn't delete a note. Try again later." + response.status,
        );
      }
      router.refresh();
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{type} Note</DialogTitle>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 pt-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your note title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your note content"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="gap-2 md:gap-0">
                  {noteToEdit && (
                    <Button
                      type="button"
                      onClick={() => setConfirmDeleteDialog(true)}
                      className="sm:w-full lg:w-fit"
                      variant={"outline"}
                    >
                      Delete
                    </Button>
                  )}

                  <LoaderButton
                    type="submit"
                    isLoading={form.formState.isSubmitting}
                    className="sm:w-full lg:w-fit"
                  >
                    Submit
                  </LoaderButton>
                </DialogFooter>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDeleteDialog} onOpenChange={setConfirmDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            Are you sure you want to delete this note? This action cannot be
            reversed.
          </DialogHeader>
          <DialogFooter className="gap-2 md:gap-0">
            <Button
              type="button"
              onClick={() => setConfirmDeleteDialog(false)}
              className="sm:w-full lg:w-fit"
              variant={"outline"}
            >
              Cancel
            </Button>
            <LoaderButton
              type="button"
              isLoading={isDeleting}
              className="sm:w-full lg:w-fit"
              variant={"destructive"}
              onClick={deleteNote}
            >
              Delete
            </LoaderButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
