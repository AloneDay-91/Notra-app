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

  const { id: classId } = await params;

  try {
    // Vérifier que la classe appartient à l'utilisateur
    const classe = await prisma.classe.findFirst({
      where: {
        id: classId,
        userId: session.user.id,
      },
    });

    if (!classe) {
      return new NextResponse("Class not found or you do not have permission", { status: 404 });
    }

    // Supprimer la classe (cascade supprime automatiquement les cours et notes)
    await prisma.classe.delete({
      where: { id: classId },
    });

    return new NextResponse("Class deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting class:", error);
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

  const { id: classId } = await params;
  const { name } = await req.json();

  if (!name || !name.trim()) {
    return new NextResponse("Name is required", { status: 400 });
  }

  try {
    // Vérifier que la classe appartient à l'utilisateur
    const classe = await prisma.classe.findFirst({
      where: {
        id: classId,
        userId: session.user.id,
      },
    });

    if (!classe) {
      return new NextResponse("Class not found or you do not have permission", { status: 404 });
    }

    // Mettre à jour la classe
    const updatedClass = await prisma.classe.update({
      where: { id: classId },
      data: { name: name.trim() },
    });

    return NextResponse.json(updatedClass, { status: 200 });
  } catch (error) {
    console.error("Error updating class:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
