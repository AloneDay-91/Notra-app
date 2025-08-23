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

  const debouncedContent = useDebounce(content, 1000);
  const debouncedTitle = useDebounce(title, 1000);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      KeyboardShortcuts, // Placer les raccourcis tôt pour qu'ils aient la priorité
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
        class: `focus:outline-none min-h-[600px] px-6 py-4 ${isFullscreen ? 'min-h-[calc(100vh-200px)]' : ''}`,
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

  const StatusBadge = () => {
    switch (status) {
      case 'saving':
        return (
          <Badge variant="secondary" className="gap-1.5 text-xs">
            <Loader2 className="h-3 w-3 animate-spin" />
            Sauvegarde...
          </Badge>
        );
      case 'saved':
        return (
          <Badge variant="default" className="gap-1.5 text-xs">
            <Save className="h-3 w-3" />
            Sauvegardé
            {lastSaved && (
              <span className="text-xs opacity-70">
                • {lastSaved.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive" className="gap-1.5 text-xs">
            <AlertCircle className="h-3 w-3" />
            Erreur
          </Badge>
        );
    }
  };

  const StatsBar = () => (
    <div className="flex items-center gap-4 text-xs text-muted-foreground border-t bg-muted/20 px-6 py-2">
      <div className="flex items-center gap-1">
        <FileText className="h-3 w-3" />
        {wordCount} mots
      </div>
      <div>{charCount} caractères</div>
      {lastSaved && (
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Dernière modification: {lastSaved.toLocaleString('fr-FR')}
        </div>
      )}
    </div>
  );

  return (
    <div className={`h-full flex flex-col bg-background ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Enhanced Title Input */}
      <div className="px-6 pt-6 pb-4">
        <div className="relative">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de la note..."
            className="text-4xl font-bold w-full focus:outline-none bg-transparent
                     placeholder:text-muted-foreground/30 border-none resize-none
                     hover:bg-muted/10 focus:bg-muted/20 rounded-lg px-3 py-2 -mx-3 -my-2
                     transition-colors duration-200"
            style={{ lineHeight: '1.2' }}
          />
        </div>
      </div>

      {/* Enhanced Toolbar */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
          <div className="flex items-center gap-2">
            <EditorToolbar editor={editor} />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="h-7 px-2"
            >
              {isPreviewMode ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-7 px-2"
            >
              {isFullscreen ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast.info('Raccourcis clavier :\n- Cmd/Ctrl + S : Sauvegarder\n- Cmd/Ctrl + P : Prévisualiser\n- Shift + Enter : Basculer le mode plein écran', { duration: 5000 })}
              className="h-7 px-2"
            >
              <Keyboard className="h-3 w-3" />
            </Button>

            <div className="h-4 w-px bg-border mx-1" />

            <StatusBadge />
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto relative">
          {isPreviewMode ? (
            <div className="px-6 py-4">
              <div
                className="prose dark:prose-invert max-w-none prose-sm sm:prose-base lg:prose-lg xl:prose-xl prose-headings:scroll-mt-20 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-7 prose-li:leading-7 prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:pl-4 prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg prose-img:rounded-lg prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }}
              />
            </div>
          ) : (
            <div className="relative h-full">
              <EditorContent editor={editor} className="h-full relative z-10" />
            </div>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <StatsBar />
    </div>
  );
}
