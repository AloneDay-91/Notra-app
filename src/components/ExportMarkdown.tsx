'use client';

import { useState } from 'react';
import { Download, FileText, Settings, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { MarkdownExporter, ExportOptions, downloadMarkdownFile, downloadMultipleMarkdownFiles } from '@/lib/markdown-exporter';

interface ExportMarkdownProps {
  userId?: string;
  classeId?: string;
  coursId?: string;
  noteId?: string;
  variant?: 'full' | 'compact';
}

export function ExportMarkdown({ userId, classeId, coursId, noteId, variant = 'full' }: ExportMarkdownProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    includeMetadata: true,
    includeTableOfContents: true,
    dateFormat: 'french',
    separateFiles: false,
  });

  const getExportScope = () => {
    if (noteId) return 'note';
    if (coursId) return 'cours';
    if (classeId) return 'classe';
    return 'all';
  };

  const getExportLabel = () => {
    const scope = getExportScope();
    switch (scope) {
      case 'note': return 'cette note';
      case 'cours': return 'ce cours';
      case 'classe': return 'cette classe';
      default: return 'toutes mes données';
    }
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const scope = getExportScope();
      const endpoint = '/api/export';
      const params = new URLSearchParams();

      if (noteId) params.append('noteId', noteId);
      if (coursId) params.append('coursId', coursId);
      if (classeId) params.append('classeId', classeId);
      if (userId) params.append('userId', userId);

      const response = await fetch(`${endpoint}?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Erreur lors de l\'export');
      }

      const data = await response.json();
      const exporter = new MarkdownExporter(options);

      if (scope === 'note' && data.note) {
        // Export d'une seule note
        const markdown = exporter.exportNote(data.note);
        const filename = `${data.note.title.replace(/[<>:"/\\|?*]/g, '-')}.md`;
        downloadMarkdownFile(markdown, filename);
        toast.success('Note exportée avec succès !');
      } else if (scope === 'cours' && data.cours) {
        // Export d'un cours
        const markdown = exporter.exportCours(data.cours);
        const filename = `${data.cours.name.replace(/[<>:"/\\|?*]/g, '-')}.md`;
        downloadMarkdownFile(markdown, filename);
        toast.success('Cours exporté avec succès !');
      } else if (scope === 'classe' && data.classe) {
        // Export d'une classe
        const markdown = exporter.exportClasse(data.classe);
        const filename = `${data.classe.name.replace(/[<>:"/\\|?*]/g, '-')}.md`;
        downloadMarkdownFile(markdown, filename);
        toast.success('Classe exportée avec succès !');
      } else if (scope === 'all' && data.classes) {
        // Export complet
        const files = exporter.exportAll({ classes: data.classes });

        if (options.separateFiles) {
          downloadMultipleMarkdownFiles(files);
          toast.success(`${files.size} fichiers exportés avec succès !`);
        } else {
          const firstEntry = files.entries().next();
          if (!firstEntry.done) {
            const [filename, content] = firstEntry.value;
            downloadMarkdownFile(content, filename);
            toast.success('Export complet réalisé avec succès !');
          }
        }
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast.error('Erreur lors de l\'export des données');
    } finally {
      setIsExporting(false);
    }
  };

  const OptionsContent = () => (
    <div className="space-y-4">
      {/* Options d'export */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <Label className="text-sm font-medium">Options d&apos;export</Label>
        </div>

        {/* Métadonnées */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="metadata"
            checked={options.includeMetadata}
            onChange={(e) =>
              setOptions(prev => ({ ...prev, includeMetadata: e.target.checked }))
            }
            className="h-4 w-4"
          />
          <Label htmlFor="metadata" className="text-sm">
            Inclure les métadonnées (dates de création/modification)
          </Label>
        </div>

        {/* Table des matières */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="toc"
            checked={options.includeTableOfContents}
            onChange={(e) =>
              setOptions(prev => ({ ...prev, includeTableOfContents: e.target.checked }))
            }
            className="h-4 w-4"
          />
          <Label htmlFor="toc" className="text-sm">
            Inclure une table des matières
          </Label>
        </div>

        {/* Format de date */}
        <div className="space-y-2">
          <Label htmlFor="dateFormat" className="text-sm">
            Format des dates
          </Label>
          <Select
            value={options.dateFormat}
            onValueChange={(value: 'iso' | 'french' | 'us') =>
              setOptions(prev => ({ ...prev, dateFormat: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="french">Français (JJ/MM/AAAA)</SelectItem>
              <SelectItem value="us">Anglais (MM/JJ/AAAA)</SelectItem>
              <SelectItem value="iso">ISO (AAAA-MM-JJ)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fichiers séparés (seulement pour l'export complet) */}
        {getExportScope() === 'all' && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="separate"
              checked={options.separateFiles}
              onChange={(e) =>
                setOptions(prev => ({ ...prev, separateFiles: e.target.checked }))
              }
              className="h-4 w-4"
            />
            <Label htmlFor="separate" className="text-sm">
              Créer des fichiers séparés pour chaque élément
            </Label>
          </div>
        )}
      </div>

      <Separator />

      {/* Bouton d'export */}
      <Button
        onClick={handleExport}
        disabled={isExporting}
        className="w-full"
      >
        {isExporting ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Download className="h-4 w-4 mr-2" />
        )}
        {isExporting ? 'Export en cours...' : 'Exporter en Markdown'}
      </Button>

      {/* Informations */}
      <div className="text-xs text-muted-foreground">
        {getExportScope() === 'all' && options.separateFiles
          ? 'Plusieurs fichiers seront téléchargés'
          : 'Un fichier Markdown sera téléchargé'}
      </div>
    </div>
  );

  // Version compacte pour les barres d'actions
  if (variant === 'compact') {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Markdown</DialogTitle>
            <DialogDescription>
              Exporter {getExportLabel()} au format Markdown
            </DialogDescription>
          </DialogHeader>
          <OptionsContent />
        </DialogContent>
      </Dialog>
    );
  }

  // Version complète pour le dashboard
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Export Markdown
        </CardTitle>
        <CardDescription>
          Exporter {getExportLabel()} au format Markdown
        </CardDescription>
      </CardHeader>

      <CardContent>
        <OptionsContent />
      </CardContent>
    </Card>
  );
}
