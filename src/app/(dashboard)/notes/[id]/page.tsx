import { auth } from "@/auth";
import {prisma} from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import NoteEditor from "./NoteEditor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";
import DeleteNoteButton from "./DeleteNoteButton";
import { ExportMarkdown } from "@/components/ExportMarkdown";

async function getNoteDetails(noteId: string, userId: string) {
  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      cours: {
        classe: {
          userId: userId,
        },
      },
    },
    include: {
      cours: {
        include: {
          classe: true
        }
      }
    }
  });
  return note;
}

export default async function NotePage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const note = await getNoteDetails(params.id, session.user.id);

  if (!note) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Note non trouvée</h1>
          <p className="text-muted-foreground">Cette note n&apos;existe pas ou vous n&apos;avez pas la permission de la voir.</p>
          <Link href="/dashboard">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Accueil
          </Link>
          <span>/</span>
          <span>{note.cours.classe.name}</span>
          <span>/</span>
          <span>{note.cours.name}</span>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-[200px]">
            {note.title}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ExportMarkdown noteId={note.id} variant="compact" />
          <DeleteNoteButton noteId={note.id} noteTitle={note.title} />
        </div>
      </div>

      {/* Note Metadata */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6 pb-4 border-b">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Modifié le {new Date(note.updatedAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </div>
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {session.user.name || session.user.email}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <NoteEditor note={note} />
      </div>
    </div>
  );
}
