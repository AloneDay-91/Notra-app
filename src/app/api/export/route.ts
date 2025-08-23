import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get('noteId');
    const coursId = searchParams.get('coursId');
    const classeId = searchParams.get('classeId');
    const userId = searchParams.get('userId') || session.user.id;

    // Vérification que l'utilisateur a accès aux données demandées
    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    if (noteId) {
      // Export d'une note spécifique
      const note = await prisma.note.findFirst({
        where: {
          id: noteId,
          cours: {
            classe: {
              userId: session.user.id
            }
          }
        }
      });

      if (!note) {
        return NextResponse.json({ error: 'Note non trouvée' }, { status: 404 });
      }

      return NextResponse.json({ note });
    }

    if (coursId) {
      // Export d'un cours spécifique
      const cours = await prisma.cours.findFirst({
        where: {
          id: coursId,
          classe: {
            userId: session.user.id
          }
        },
        include: {
          notes: {
            orderBy: { createdAt: 'asc' }
          }
        }
      });

      if (!cours) {
        return NextResponse.json({ error: 'Cours non trouvé' }, { status: 404 });
      }

      return NextResponse.json({ cours });
    }

    if (classeId) {
      // Export d'une classe spécifique
      const classe = await prisma.classe.findFirst({
        where: {
          id: classeId,
          userId: session.user.id
        },
        include: {
          courses: {
            orderBy: { createdAt: 'asc' },
            include: {
              notes: {
                orderBy: { createdAt: 'asc' }
              }
            }
          }
        }
      });

      if (!classe) {
        return NextResponse.json({ error: 'Classe non trouvée' }, { status: 404 });
      }

      return NextResponse.json({ classe });
    }

    // Export complet de toutes les données de l'utilisateur
    const classes = await prisma.classe.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: { createdAt: 'asc' },
      include: {
        courses: {
          orderBy: { createdAt: 'asc' },
          include: {
            notes: {
              orderBy: { createdAt: 'asc' }
            }
          }
        }
      }
    });

    return NextResponse.json({ classes });

  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
