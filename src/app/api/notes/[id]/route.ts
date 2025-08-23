import { auth } from "@/auth";
import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { title, content } = await req.json();
  const { id: noteId } = await params;

  if (title === undefined && content === undefined) {
    return new NextResponse("Missing title or content", { status: 400 });
  }

  // Verify that the user owns the note they are trying to update
  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      cours: {
        classe: {
          userId: session.user.id,
        },
      },
    },
  });

  if (!note) {
    return new NextResponse("Note not found or you do not have permission", { status: 404 });
  }

  try {
    const updatedNote = await prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        title: title ?? note.title,
        content: content ?? note.content,
      },
    });
    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    console.error("Error updating note:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id: noteId } = await params;

  try {
    // Verify that the user owns the note they are trying to delete
    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        cours: {
          classe: {
            userId: session.user.id,
          },
        },
      },
    });

    if (!note) {
      return new NextResponse("Note not found or you do not have permission", { status: 404 });
    }

    // Delete the note
    await prisma.note.delete({
      where: { id: noteId },
    });

    return new NextResponse("Note deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting note:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
