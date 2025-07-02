// components/GameForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { BoardGame } from './types';

type Props = {
  onAdd: (game: BoardGame) => void;
  onUpdate: (game: BoardGame) => void;
  editingGame?: BoardGame | null;
};

export default function GameForm({ onAdd, onUpdate, editingGame }: Props) {
  const [name, setName] = useState('');
  const [publisher, setPublisher] = useState('');

  useEffect(() => {
    if (editingGame) {
      setName(editingGame.name);
      setPublisher(editingGame.publisher);
    }
  }, [editingGame]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !publisher) return;

    const game: BoardGame = {
      id: editingGame ? editingGame.id : Date.now().toString(),
      name,
      publisher,
      year: editingGame ? editingGame.year : new Date().getFullYear().toString(),
    };

    if (editingGame) {
      onUpdate(game);
    } else {
      onAdd(game);
    }
    setName('');
    setPublisher('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-2">
      <input
        className="border px-2 py-1 w-full"
        placeholder="Game name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border px-2 py-1 w-full"
        placeholder="Publisher"
        value={publisher}
        onChange={(e) => setPublisher(e.target.value)}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">
        {editingGame ? 'Update Game' : 'Add Game'}
      </button>
    </form>
  );
}
