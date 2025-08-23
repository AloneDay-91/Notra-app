import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function PATCH(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return new NextResponse("Current password and new password are required", { status: 400 });
    }

    if (newPassword.length < 6) {
      return new NextResponse("New password must be at least 6 characters", { status: 400 });
    }

    // Récupérer l'utilisateur avec son mot de passe actuel
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user || !user.password) {
      return new NextResponse("User not found or no password set", { status: 404 });
    }

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return new NextResponse("Current password is incorrect", { status: 400 });
    }

    // Hasher le nouveau mot de passe
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Mettre à jour le mot de passe
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedNewPassword },
    });

    return new NextResponse("Password updated successfully", { status: 200 });
  } catch (error) {
    console.error("Error updating password:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
