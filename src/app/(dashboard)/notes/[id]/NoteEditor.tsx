'use client';

import { Note } from '@prisma/client';
import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '@uidotdev/usehooks';

// Tiptap Imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';

// Custom Components
import EditorToolbar from './Toolbar';
import CommandsPlugin from './commands';
import KeyboardShortcuts from './KeyboardShortcuts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Clock,
  FileText,
  Keyboard, Save
} from 'lucide-react';
import { toast } from 'sonner';

interface NoteEditorProps {
  note: Note;
}

export default function NoteEditor({ note }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content || '');
  const [status, setStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  const debouncedContent = useDebounce(content, 1000);
  const debouncedTitle = useDebounce(title, 1000);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Markdown,
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        autolink: true,
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-2 hover:text-primary/80 cursor-pointer',
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'flex items-start gap-2',
        },
      }),
      Placeholder.configure({
        placeholder: 'Commencez à écrire ou tapez "/" pour voir les commandes...',
        emptyEditorClass: 'is-editor-empty',
      }),
      CommandsPlugin,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: `focus:outline-none px-6 py-4 ${isFullscreen ? 'min-h-[calc(100vh-200px)]' : 'min-h-full'}`,
      },
    },
    onUpdate: ({ editor }) => {
      const newContent = editor.storage.markdown.getMarkdown();
      setContent(newContent);

      // Calculer les statistiques
      const text = editor.getText();
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
      setCharCount(text.length);
    },
    onCreate: ({ editor }) => {
      // Calculer les statistiques initiales
      const text = editor.getText();
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
      setCharCount(text.length);
    },
  });

  const saveNote = useCallback(async (newTitle: string, newContent: string) => {
    if (!newTitle.trim() && !newContent.trim()) return;

    setStatus('saving');
    try {
      const res = await fetch(`/api/notes/${note.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTitle.trim() || 'Note sans titre',
          content: newContent
        }),
      });

      if (res.ok) {
        setStatus('saved');
        setLastSaved(new Date());
        toast.success('Note sauvegardée', {
          duration: 1500,
        });
      } else {
        setStatus('error');
        toast.error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Failed to save note:', error);
      setStatus('error');
      toast.error('Erreur lors de la sauvegarde');
    }
  }, [note.id]);

  useEffect(() => {
    if (debouncedTitle === note.title && debouncedContent === note.content) {
      return;
    }
    saveNote(debouncedTitle, debouncedContent);
  }, [debouncedTitle, debouncedContent, saveNote, note.title, note.content]);

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            saveNote(title, content);
            break;
          case 'p':
            e.preventDefault();
            setIsPreviewMode(!isPreviewMode);
            break;
          case 'Enter':
            if (e.shiftKey) {
              e.preventDefault();
              setIsFullscreen(!isFullscreen);
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [title, content, isPreviewMode, isFullscreen, saveNote]);

  // Handlers pour les événements
  const handleTitleBlur = () => {
    saveNote(title, content);
  };

  const handleManualSave = () => {
    saveNote(title, content);
  };

  return (
    <div className={`h-full flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      {/* Header responsive avec titre */}
      <div className="flex-shrink-0 border-b bg-background">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4">
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-lg sm:text-xl lg:text-2xl font-bold bg-transparent border-none outline-none focus:ring-0 p-0 placeholder:text-muted-foreground truncate"
              placeholder="Titre de la note..."
              onBlur={handleTitleBlur}
            />
          </div>

          {/* Actions compactes sur mobile */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Status indicator - masqué sur très petits écrans */}
            <div className="hidden sm:flex items-center gap-2">
              {status === 'saving' && (
                <Badge variant="secondary" className="gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span className="hidden lg:inline">Sauvegarde...</span>
                </Badge>
              )}
              {status === 'saved' && lastSaved && (
                <Badge variant="outline" className="gap-1">
                  <Clock className="w-3 h-3" />
                  <span className="hidden lg:inline">
                    {lastSaved.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </Badge>
              )}
              {status === 'error' && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span className="hidden lg:inline">Erreur</span>
                </Badge>
              )}
            </div>

            {/* Boutons d'action - responsive */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="gap-1"
            >
              {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="hidden sm:inline">{isPreviewMode ? 'Éditer' : 'Aperçu'}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="gap-1"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span className="hidden lg:inline">{isFullscreen ? 'Réduire' : 'Plein écran'}</span>
            </Button>

            {/* Bouton de sauvegarde manuelle sur mobile */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualSave}
              disabled={status === 'saving'}
              className="sm:hidden gap-1"
            >
              {status === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Toolbar - responsive avec scroll horizontal sur mobile */}
        {!isPreviewMode && (
          <div className="border-t">
            <div className="overflow-x-auto">
              <EditorToolbar editor={editor} />
            </div>
          </div>
        )}
      </div>

      {/* Éditeur principal - responsive */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {isPreviewMode ? (
          <div className="h-full overflow-y-auto p-3 sm:p-4 lg:p-6 pb-16">
            <div className="prose prose-sm sm:prose lg:prose-lg max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }} />
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto relative">
            <EditorContent
              editor={editor}
              className="prose prose-sm sm:prose lg:prose-lg max-w-none dark:prose-invert p-3 sm:p-4 lg:p-6 pb-16 focus:outline-none"
            />

            {/* Raccourcis clavier - contrôlés par un bouton */}
            <KeyboardShortcuts
              isVisible={showKeyboardShortcuts}
              onClose={() => setShowKeyboardShortcuts(false)}
            />
          </div>
        )}
      </div>

      {/* Stats fixées en bas de l'écran */}
      <div className="fixed bottom-0 left-0 right-0 px-3 sm:px-4 py-2 bg-background/95 backdrop-blur-sm border-t shadow-lg z-30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {wordCount} mots
            </span>
            <span className="hidden sm:inline">{charCount} caractères</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
              className="gap-1 text-xs"
            >
              <Keyboard className="w-3 h-3" />
              <span>Raccourcis</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
