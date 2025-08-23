import { auth } from "@/auth";
import {prisma} from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import NoteEditor from "./NoteEditor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, MoreVertical } from "lucide-react";
import DeleteNoteButton from "./DeleteNoteButton";
import { ExportMarkdown } from "@/components/ExportMarkdown";
import { BreadcrumbMobile } from "@/components/ui/breadcrumb-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const breadcrumbItems = [
    { label: "Accueil", href: "/dashboard" },
    { label: note.cours.classe.name, href: `/classes/${note.cours.classe.id}` },
    { label: note.cours.name, href: `/cours/${note.cours.id}` },
    { label: note.title, isActive: true },
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Header Mobile/Desktop */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-10">
        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          {/* Breadcrumb */}
          <BreadcrumbMobile items={breadcrumbItems} />

          {/* Actions - Responsive */}
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold truncate">
                {note.title}
              </h1>
            </div>

            {/* Actions Desktop */}
            <div className="hidden sm:flex items-center gap-2">
              <ExportMarkdown noteId={note.id} variant="compact" />
              <DeleteNoteButton noteId={note.id} noteTitle={note.title} />
            </div>

            {/* Actions Mobile - Menu déroulant */}
            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <ExportMarkdown noteId={note.id} variant="menuItem" />
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <DeleteNoteButton noteId={note.id} noteTitle={note.title} variant="menuItem" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Note Metadata - Responsive */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span>Modifié le {new Date(note.updatedAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{session.user.name || session.user.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0 p-3 sm:p-4">
        <NoteEditor note={note} />
      </div>
    </div>
  );
}
