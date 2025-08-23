import { auth } from "@/auth";
import {prisma} from "@/lib/prisma";
import { redirect } from "next/navigation";
import NewNoteForm from "./NewNoteForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getCoursDetails(coursId: string, userId: string) {
  return await prisma.cours.findFirst({
    where: { 
      id: coursId, 
      classe: { userId: userId }
    },
  });
}

export default async function CoursPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }

  const cours = await getCoursDetails(params.id, session.user.id);

  if (!cours) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Cours non trouvé</h1>
        <Link href="/dashboard" className="mt-4 inline-block">
            <Button>Retour au Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Cours : {cours.name}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Ajouter une nouvelle note</CardTitle>
          <CardDescription>
            Créez une nouvelle note pour commencer à écrire.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewNoteForm coursId={cours.id} />
        </CardContent>
      </Card>
    </div>
  );
}
