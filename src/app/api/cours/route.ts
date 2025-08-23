import { auth } from "@/auth";
import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { name, classeId } = await req.json();

  if (!name || !classeId) {
    return new NextResponse("Missing name or classeId", { status: 400 });
  }

  // Optional: Verify that the user owns the class they are adding a course to
  const classe = await prisma.classe.findFirst({
    where: {
      id: classeId,
      userId: session.user.id,
    },
  });

  if (!classe) {
    return new NextResponse("Class not found or you do not have permission", { status: 404 });
  }

  try {
    const newCours = await prisma.cours.create({
      data: {
        name,
        classeId,
      },
    });
    return NextResponse.json(newCours, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
