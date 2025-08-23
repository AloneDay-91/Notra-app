import { auth } from "@/auth";
import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { name } = await req.json();

  if (!name) {
    return new NextResponse("Missing name", { status: 400 });
  }

  try {
    const newClasse = await prisma.classe.create({
      data: {
        name,
        userId: session.user.id,
      },
    });
    return NextResponse.json(newClasse, { status: 201 });
  } catch (error) {
    console.error("Error creating class:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
