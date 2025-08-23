import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Supprimer l'utilisateur et toutes ses données associées
    // Prisma supprimera automatiquement les données liées grâce aux relations onDelete: Cascade
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return new NextResponse("Account deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting account:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
