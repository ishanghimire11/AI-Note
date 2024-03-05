import {
  createNoteSchema,
  deleteNoteSchema,
  updateNoteSchema,
} from "@/lib/validation/validation";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedValue = createNoteSchema.safeParse(body);
    if (!parsedValue.success) {
      console.error(parsedValue.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { title, content } = parsedValue.data;

    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Not authorized" }, { status: 401 });
    }

    const note = await prisma?.note.create({
      data: {
        title,
        content,
        userId,
      },
    });
    return Response.json({ note }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parsedValue = updateNoteSchema.safeParse(body);
    if (!parsedValue.success) {
      console.error(parsedValue.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id, title, content } = parsedValue.data;

    const note = await prisma?.note.findUnique({ where: { id } });

    if (!note) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }

    const { userId } = auth();

    if (!userId || userId !== note.userId) {
      return Response.json({ error: "Not authorized" }, { status: 401 });
    }

    const updatedNote = await prisma?.note.update({
      where: { id },
      data: {
        title,
        content,
      },
    });
    return Response.json({ updatedNote }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const parsedValue = deleteNoteSchema.safeParse(body);
    if (!parsedValue.success) {
      console.error(parsedValue.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id } = parsedValue.data;

    const note = await prisma?.note.findUnique({ where: { id } });

    if (!note) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }

    const { userId } = auth();

    if (!userId || userId !== note.userId) {
      return Response.json({ error: "Not authorized" }, { status: 401 });
    }

    const deletedNote = await prisma?.note.delete({
      where: { id },
    });

    return Response.json(
      { message: "Note Sucessfully deleted" },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
