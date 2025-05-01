// components/GameList.tsx
'use client';

import { BoardGame } from './types';

type Props = {
  games: BoardGame[];
  onDelete: (id: string) => void;
  onEdit: (game: BoardGame) => void;
};

export default function GameList({ games, onDelete, onEdit }: Props) {
  if (!games.length) return <p className="text-center text-gray-500">No games yet!</p>;

  return (
    <ul className="space-y-2">
      {games.map((game) => (
        <li key={game.id} className="border p-3 flex justify-between items-center rounded">
          <div>
            <h3 className="font-semibold">{game.name}</h3>
            <p className="text-sm text-gray-600">{game.publisher}</p>
          </div>
          <div className="space-x-2">
            <button onClick={() => onEdit(game)} className="text-yellow-600">Edit</button>
            <button onClick={() => onDelete(game.id)} className="text-red-600">Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
