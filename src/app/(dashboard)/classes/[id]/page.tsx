import { auth } from "@/auth";
import {prisma} from "@/lib/prisma";
import { redirect } from "next/navigation";
import NewCoursForm from "./NewCoursForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getClasseDetails(classeId: string, userId: string) {
  return await prisma.classe.findFirst({
    where: { id: classeId, userId: userId },
  });
}

export default async function ClassePage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }

  const classe = await getClasseDetails(params.id, session.user.id);

  if (!classe) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Classe non trouvée</h1>
        <Link href="/dashboard" className="mt-4 inline-block">
            <Button>Retour au Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Classe : {classe.name}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un nouveau cours</CardTitle>
           <CardDescription>
            Ajoutez un nouveau cours à cette classe pour commencer à prendre des notes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewCoursForm classeId={classe.id} />
        </CardContent>
      </Card>
    </div>
  );
}
