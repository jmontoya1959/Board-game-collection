// app/page.tsx
'use client';

import { useState } from 'react';
import { useLocalStorage } from './lib/useLocalStorage';
import { BoardGame } from './components/types';
import GameForm from './components/BoardGameForm';
import GameList from './components/BoardGameList';

export default function Home() {
  const [games, setGames] = useLocalStorage<BoardGame[]>('boardGames', []);
  const [editingGame, setEditingGame] = useState<BoardGame | null>(null);
  const [search, setSearch] = useState('');

  const addGame = (newGame: BoardGame) => {
    setGames([...games, newGame]);
  };

  const updateGame = (updatedGame: BoardGame) => {
    setGames(games.map((g) => (g.id === updatedGame.id ? updatedGame : g)));
    setEditingGame(null);
  };

  const deleteGame = (id: string) => {
    setGames(games.filter((game) => game.id !== id));
    setEditingGame(null);
  };

  // 🔍 Filter the list based on search text
  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(search.toLowerCase()) ||
    game.publisher.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="max-w-xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-4">🎲 My Board Game Collection</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search games..."
        className="border w-full px-3 py-2 mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <GameForm onAdd={addGame} onUpdate={updateGame} editingGame={editingGame} />
      <GameList games={filteredGames} onDelete={deleteGame} onEdit={setEditingGame} />
    </main>
  );
}