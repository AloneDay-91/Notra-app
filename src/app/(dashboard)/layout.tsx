import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { UserMenu } from "@/components/UserMenu";
import { Menu } from "lucide-react";
import { redirect } from "next/navigation";
import DashboardLayoutClient from "./DashboardLayoutClient";

async function getNavigationData(userId: string) {
  return await prisma.classe.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    include: {
      courses: {
        orderBy: { name: "asc" },
        include: {
          notes: {
            orderBy: { title: "asc" },
            select: { id: true, title: true },
          },
        },
      },
    },
  });
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const navigationData = await getNavigationData(session.user.id);

  return (
    <DashboardLayoutClient
      user={{
        id: session.user.id!,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image
      }}
      navigationData={navigationData}
    >
      {/* Top Bar - Hidden on mobile, shown on desktop */}
      <header className="hidden lg:flex items-center justify-between px-6 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="lg:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <UserMenu user={session.user} />
          <ModeToggle />
        </div>
      </header>

      {/* Page Content - Responsive padding */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full p-3 sm:p-4 lg:p-6">{children}</div>
      </main>
    </DashboardLayoutClient>
  );
}
