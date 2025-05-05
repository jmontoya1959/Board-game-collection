// app/page.tsx
'use client';

import { useState } from 'react';
import { useLocalStorage } from './lib/useLocalStorage';
import { XMLParser } from 'fast-xml-parser';

type Game = {
  id: string;
  name: string;
  image: string;
  description: string;
};

export default function Home() {
  const [search, setSearch] = useState('');
  const [collection, setCollection] = useLocalStorage<Game[]>('boardgame-collection', []);

  const handleAddGame = async () => {
    if (!search.trim()) return;

    const parser = new XMLParser({
      ignoreAttributes: false, // ✅ this is IMPORTANT to parse @ attributes
    });

    try {
      // Fetch search results
      const searchRes = await fetch(`https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(search)}&type=boardgame`);
      const searchXml = await searchRes.text();
      const searchData = parser.parse(searchXml);

      const items = searchData.items?.item;
      if (!items) {
        alert('No games found!');
        return;
      }

      const firstItem = Array.isArray(items) ? items[0] : items;
      const gameId = firstItem['@_id']; // ✅ use '@_id' for attribute

      // Fetch game details
      const detailsRes = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${gameId}&stats=1`);
      const detailsXml = await detailsRes.text();
      const detailsData = parser.parse(detailsXml);

      const gameData = detailsData.items.item;

      // ✅ Get primary name
      let name = '';
      if (Array.isArray(gameData.name)) {
        const primary = gameData.name.find((n: any) => n['@_type'] === 'primary');
        name = primary ? primary['@_value'] : gameData.name[0]['@_value'];
      } else {
        name = gameData.name['@_value'];
      }

      const image = gameData.image || '';
      const description = gameData.description || '';

      const newGame: Game = { id: gameId, name, image, description };

      setCollection(prev => [...prev, newGame]);
      setSearch('');
    } catch (err) {
      console.error(err);
      alert('Error fetching game info.');
    }
  };

  const handleDelete = (id: string) => {
    setCollection(prev => prev.filter(game => game.id !== id));
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-4">🎲 Board Game Collection</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          className="border p-2 rounded flex-1 bg-gray-800 text-white placeholder-gray-400"
          placeholder="Search for a game..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          onClick={handleAddGame}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Game
        </button>
      </div>

      {collection.length === 0 ? (
        <p className="text-gray-400 text-center">No games in your collection yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {collection.map(game => (
            <div key={game.id} className="bg-gray-900 rounded shadow p-4">
              <h2 className="text-xl font-semibold mb-2">{game.name}</h2>
              {game.image && (
                <img
                  src={game.image}
                  alt={game.name}
                  className="mb-2 w-full h-48 object-cover rounded"
                />
              )}
              <p className="text-sm text-gray-300 mb-2">
                {game.description.slice(0, 150)}...
              </p>
              <button
                onClick={() => handleDelete(game.id)}
                className="text-sm text-red-400 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
