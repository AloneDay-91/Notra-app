import { auth } from "@/auth";
import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { title, content, coursId } = await req.json();

  if (!title || !coursId) {
    return new NextResponse("Missing title or coursId", { status: 400 });
  }

  // Optional: Verify that the user owns the course they are adding a note to
  const cours = await prisma.cours.findFirst({
    where: {
      id: coursId,
      classe: {
        userId: session.user.id,
      },
    },
  });

  if (!cours) {
    return new NextResponse("Course not found or you do not have permission", { status: 404 });
  }

  try {
    const newNote = await prisma.note.create({
      data: {
        title,
        content: content || "", // Content is optional
        coursId,
      },
    });
    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
