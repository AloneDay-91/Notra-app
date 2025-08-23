import { Note, Cours, Classe } from '@prisma/client';

export type ExportData = {
  classes: (Classe & {
    courses: (Cours & {
      notes: Note[];
    })[];
  })[];
};

export type ExportOptions = {
  includeMetadata?: boolean;
  includeTableOfContents?: boolean;
  dateFormat?: 'iso' | 'french' | 'us';
  separateFiles?: boolean;
};

export class MarkdownExporter {
  private options: Required<ExportOptions>;

  constructor(options: ExportOptions = {}) {
    this.options = {
      includeMetadata: true,
      includeTableOfContents: true,
      dateFormat: 'french',
      separateFiles: false,
      ...options,
    };
  }

  private formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    switch (this.options.dateFormat) {
      case 'iso':
        return dateObj.toISOString().split('T')[0];
      case 'us':
        return dateObj.toLocaleDateString('en-US');
      case 'french':
      default:
        return dateObj.toLocaleDateString('fr-FR');
    }
  }

  private sanitizeFileName(name: string): string {
    return name
      .replace(/[<>:"/\\|?*]/g, '-')
      .replace(/\s+/g, '_')
      .toLowerCase();
  }

  private generateMetadata(item: { createdAt: Date | string; updatedAt: Date | string }): string {
    if (!this.options.includeMetadata) return '';

    return `---
created: ${this.formatDate(item.createdAt)}
updated: ${this.formatDate(item.updatedAt)}
---

`;
  }

  exportNote(note: Note): string {
    let markdown = '';

    // Métadonnées
    markdown += this.generateMetadata(note);

    // Titre
    markdown += `# ${note.title}\n\n`;

    // Contenu
    if (note.content) {
      markdown += `${note.content}\n\n`;
    }

    return markdown;
  }

  exportCours(cours: Cours & { notes: Note[] }): string {
    let markdown = '';

    // Métadonnées
    markdown += this.generateMetadata(cours);

    // Titre du cours
    markdown += `# ${cours.name}\n\n`;

    // Table des matières si demandée
    if (this.options.includeTableOfContents && cours.notes.length > 0) {
      markdown += `## Table des matières\n\n`;
      cours.notes.forEach((note, index) => {
        markdown += `${index + 1}. [${note.title}](#${this.sanitizeFileName(note.title)})\n`;
      });
      markdown += '\n';
    }

    // Notes
    if (cours.notes.length > 0) {
      markdown += `## Notes\n\n`;
      cours.notes.forEach((note, index) => {
        if (index > 0) markdown += '\n---\n\n';

        // Ancre pour la table des matières
        markdown += `<a id="${this.sanitizeFileName(note.title)}"></a>\n\n`;

        // Titre de la note (niveau 3)
        markdown += `### ${note.title}\n\n`;

        // Métadonnées de la note
        if (this.options.includeMetadata) {
          const createdDate = typeof note.createdAt === 'string' ? new Date(note.createdAt) : note.createdAt;
          const updatedDate = typeof note.updatedAt === 'string' ? new Date(note.updatedAt) : note.updatedAt;

          markdown += `*Créé le ${this.formatDate(note.createdAt)}`;
          if (updatedDate.getTime() !== createdDate.getTime()) {
            markdown += ` - Modifié le ${this.formatDate(note.updatedAt)}`;
          }
          markdown += '*\n\n';
        }

        // Contenu de la note
        if (note.content) {
          markdown += `${note.content}\n\n`;
        }
      });
    }

    return markdown;
  }

  exportClasse(classe: Classe & { courses: (Cours & { notes: Note[] })[] }): string {
    let markdown = '';

    // Métadonnées
    markdown += this.generateMetadata(classe);

    // Titre de la classe
    markdown += `# ${classe.name}\n\n`;

    // Table des matières générale
    if (this.options.includeTableOfContents && classe.courses.length > 0) {
      markdown += `## Table des matières\n\n`;
      classe.courses.forEach((cours, coursIndex) => {
        markdown += `${coursIndex + 1}. [${cours.name}](#${this.sanitizeFileName(cours.name)})\n`;
        if (cours.notes.length > 0) {
          cours.notes.forEach((note, noteIndex) => {
            markdown += `   ${coursIndex + 1}.${noteIndex + 1}. [${note.title}](#${this.sanitizeFileName(note.title)})\n`;
          });
        }
      });
      markdown += '\n';
    }

    // Cours
    if (classe.courses.length > 0) {
      classe.courses.forEach((cours, index) => {
        if (index > 0) markdown += '\n---\n\n';

        // Ancre pour la table des matières
        markdown += `<a id="${this.sanitizeFileName(cours.name)}"></a>\n\n`;

        // Titre du cours (niveau 2)
        markdown += `## ${cours.name}\n\n`;

        // Métadonnées du cours
        if (this.options.includeMetadata) {
          const createdDate = typeof cours.createdAt === 'string' ? new Date(cours.createdAt) : cours.createdAt;
          const updatedDate = typeof cours.updatedAt === 'string' ? new Date(cours.updatedAt) : cours.updatedAt;

          markdown += `*Créé le ${this.formatDate(cours.createdAt)}`;
          if (updatedDate.getTime() !== createdDate.getTime()) {
            markdown += ` - Modifié le ${this.formatDate(cours.updatedAt)}`;
          }
          markdown += '*\n\n';
        }

        // Notes du cours
        if (cours.notes.length > 0) {
          cours.notes.forEach((note, noteIndex) => {
            if (noteIndex > 0) markdown += '\n';

            // Ancre pour la table des matières
            markdown += `<a id="${this.sanitizeFileName(note.title)}"></a>\n\n`;

            // Titre de la note (niveau 3)
            markdown += `### ${note.title}\n\n`;

            // Métadonnées de la note
            if (this.options.includeMetadata) {
              const createdDate = typeof note.createdAt === 'string' ? new Date(note.createdAt) : note.createdAt;
              const updatedDate = typeof note.updatedAt === 'string' ? new Date(note.updatedAt) : note.updatedAt;

              markdown += `*Créé le ${this.formatDate(note.createdAt)}`;
              if (updatedDate.getTime() !== createdDate.getTime()) {
                markdown += ` - Modifié le ${this.formatDate(note.updatedAt)}`;
              }
              markdown += '*\n\n';
            }

            // Contenu de la note
            if (note.content) {
              markdown += `${note.content}\n\n`;
            }
          });
        }
      });
    }

    return markdown;
  }

  exportAll(data: ExportData): Map<string, string> {
    const files = new Map<string, string>();

    if (this.options.separateFiles) {
      // Export séparé : un fichier par classe, cours ou note
      data.classes.forEach(classe => {
        classe.courses.forEach(cours => {
          cours.notes.forEach(note => {
            const fileName = `${this.sanitizeFileName(classe.name)}_${this.sanitizeFileName(cours.name)}_${this.sanitizeFileName(note.title)}.md`;
            files.set(fileName, this.exportNote(note));
          });

          // Fichier du cours (sans les notes individuelles)
          const coursFileName = `${this.sanitizeFileName(classe.name)}_${this.sanitizeFileName(cours.name)}.md`;
          files.set(coursFileName, this.exportCours(cours));
        });

        // Fichier de la classe complète
        const classeFileName = `${this.sanitizeFileName(classe.name)}_complete.md`;
        files.set(classeFileName, this.exportClasse(classe));
      });
    } else {
      // Export unique : tout dans un seul fichier
      let completeMarkdown = '';

      // Titre principal
      completeMarkdown += `# Export Notra\n\n`;
      completeMarkdown += `*Exporté le ${this.formatDate(new Date())}*\n\n`;

      // Table des matières globale
      if (this.options.includeTableOfContents) {
        completeMarkdown += `## Table des matières\n\n`;
        data.classes.forEach((classe, classeIndex) => {
          completeMarkdown += `${classeIndex + 1}. [${classe.name}](#${this.sanitizeFileName(classe.name)})\n`;
          classe.courses.forEach((cours, coursIndex) => {
            completeMarkdown += `   ${classeIndex + 1}.${coursIndex + 1}. [${cours.name}](#${this.sanitizeFileName(cours.name)})\n`;
            cours.notes.forEach((note, noteIndex) => {
              completeMarkdown += `      ${classeIndex + 1}.${coursIndex + 1}.${noteIndex + 1}. [${note.title}](#${this.sanitizeFileName(note.title)})\n`;
            });
          });
        });
        completeMarkdown += '\n';
      }

      // Contenu complet
      data.classes.forEach((classe, index) => {
        if (index > 0) completeMarkdown += '\n\n---\n\n';
        completeMarkdown += this.exportClasse(classe);
      });

      files.set('notra_export_complete.md', completeMarkdown);
    }

    return files;
  }
}

// Fonctions utilitaires pour télécharger les fichiers
export function downloadMarkdownFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadMultipleMarkdownFiles(files: Map<string, string>): void {
  files.forEach((content, filename) => {
    setTimeout(() => {
      downloadMarkdownFile(content, filename);
    }, 100); // Petit délai pour éviter les problèmes de navigateur
  });
}

export function zipMarkdownFiles(files: Map<string, string>): Promise<Blob> {
  // Cette fonction nécessiterait une librairie comme JSZip
  // Pour l'instant, on retourne une promesse qui télécharge les fichiers un par un
  return new Promise((resolve) => {
    downloadMultipleMarkdownFiles(files);
    resolve(new Blob()); // Blob vide pour la compatibilité
  });
}
