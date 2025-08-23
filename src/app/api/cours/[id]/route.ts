import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id: coursId } = await params;

  try {
    // Vérifier que le cours appartient à l'utilisateur
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

    // Supprimer le cours (cascade supprime automatiquement les notes)
    await prisma.cours.delete({
      where: { id: coursId },
    });

    return new NextResponse("Course deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting course:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id: coursId } = await params;
  const { name } = await req.json();

  if (!name || !name.trim()) {
    return new NextResponse("Name is required", { status: 400 });
  }

  try {
    // Vérifier que le cours appartient à l'utilisateur
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

    // Mettre à jour le cours
    const updatedCourse = await prisma.cours.update({
      where: { id: coursId },
      data: { name: name.trim() },
    });

    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error) {
    console.error("Error updating course:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
