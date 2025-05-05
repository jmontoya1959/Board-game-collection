import { useEffect, useState } from 'react';
import { XMLParser } from 'fast-xml-parser';

type Game = {
  id: string;
  name: string;
  image: string;
  description: string;
};

export default function Home() {
  const [search, setSearch] = useState('');
  const [collection, setCollection] = useState<Game[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('collection');
    if (saved) setCollection(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('collection', JSON.stringify(collection));
  }, [collection]);

  const handleAddGame = async () => {
    // Simulate API fetch or replace this with actual API logic
    const game: Game = {
      id: Date.now().toString(),
      name: search,
      image: `https://via.placeholder.com/150?text=${encodeURIComponent(search)}`,
      description: `This is a description for ${search}.`
    };

    setCollection(prev => [...prev, game]);
    setSearch('');
  };

  const handleRemove = (id: string) => {
    setCollection(prev => prev.filter(g => g.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">My Board Game Collection</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search a board game"
          className="p-2 rounded bg-gray-800 border border-gray-700 flex-1"
        />
        <button
          onClick={handleAddGame}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {collection.map(game => (
          <div key={game.id} className="bg-gray-800 rounded p-4 shadow-lg">
            <img src={game.image} alt={game.name} className="rounded mb-2" />
            <h2 className="text-xl font-bold">{game.name}</h2>
            <p className="text-gray-400">{game.description}</p>
            <button
              onClick={() => handleRemove(game.id)}
              className="mt-2 text-sm text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
