import { useApp } from '../context/AppContext';

export default function Library() {
  const { decks } = useApp();
  const kanji = decks.flatMap(d => d.kanji);

  return (
    <div className="page">
      <h1>Library</h1>
      {kanji.map(k => (
        <div key={k.id} style={{ fontSize: '2rem' }}>
          {k.char} – {k.meaning}
        </div>
      ))}
    </div>
  );
}