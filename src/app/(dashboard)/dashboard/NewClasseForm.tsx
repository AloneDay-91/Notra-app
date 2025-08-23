'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface NewClasseFormProps {
  onSuccess?: () => void;
}

export default function NewClasseForm({ onSuccess }: NewClasseFormProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (res.ok) {
        setName('');
        toast.success('Classe créée avec succès');
        router.refresh();
        onSuccess?.(); // Ferme le dialog
      } else {
        toast.error('Erreur lors de la création de la classe');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de la création de la classe');
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom de la classe..."
        disabled={isLoading}
      />
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading || !name.trim()}>
          {isLoading ? 'Création...' : 'Créer la classe'}
        </Button>
      </div>
    </form>
  );
}
