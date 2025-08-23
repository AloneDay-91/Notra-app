import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { name, email } = await req.json();

    if (!name || !email) {
      return new NextResponse("Name and email are required", { status: 400 });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
        NOT: {
          id: session.user.id,
        },
      },
    });

    if (existingUser) {
      return new NextResponse("Email already in use", { status: 409 });
    }

    // Mettre à jour le profil utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        email: email.trim(),
      },
    });

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
