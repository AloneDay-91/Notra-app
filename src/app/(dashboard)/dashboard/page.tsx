import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardContent from "./DashboardContent";

async function getRecentNotes(userId: string) {
  return await prisma.note.findMany({
    where: { cours: { classe: { userId } } },
    orderBy: { updatedAt: "desc" },
    take: 4,
    include: {
      cours: {
        include: {
          classe: true,
        },
      },
    },
  });
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const recentNotes = await getRecentNotes(session.user.id!);

  return <DashboardContent user={session.user} recentNotes={recentNotes} />;
}
