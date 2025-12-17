import { useState, useEffect } from 'react';
import { getDecks, saveDeck, addKanjiToDeck } from '../db';
import type { Deck, Kanji } from '../db';

export default function Decks() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [deckName, setDeckName] = useState('');
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [kanjiChar, setKanjiChar] = useState('');
  const [kanjiMeaning, setKanjiMeaning] = useState('');

  useEffect(() => {
    getDecks().then(setDecks);
  }, []);

  const handleAddDeck = async () => {
    if (!deckName) return;
    const deck: Deck = { id: Date.now().toString(), name: deckName, kanji: [] };
    await saveDeck(deck);
    setDecks(await getDecks());
    setDeckName('');
  };

  const handleAddKanji = async () => {
    if (!selectedDeckId || !kanjiChar) return;
    const kanji: Kanji = { id: Date.now().toString(), char: kanjiChar, meaning: kanjiMeaning };
    await addKanjiToDeck(selectedDeckId, kanji);
    setDecks(await getDecks());
    setKanjiChar('');
    setKanjiMeaning('');
  };

  return (
    <div style={{ padding: 16 }}>
      <h1>Decks</h1>

      <div style={{ marginBottom: 20 }}>
        {decks.map(deck => (
          <div key={deck.id} style={{ marginBottom: 8, cursor: 'pointer' }}>
            <strong onClick={() => setSelectedDeckId(deck.id)}>
              {deck.name}
            </strong> ({deck.kanji.length} kanji)
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="New deck name"
          value={deckName}
          onChange={e => setDeckName(e.target.value)}
        />
        <button onClick={handleAddDeck}>Add Deck</button>
      </div>

      {selectedDeckId && (
        <div style={{ marginTop: 20 }}>
          <h2>Add Kanji to Selected Deck</h2>
          <input
            type="text"
            placeholder="Kanji character"
            value={kanjiChar}
            onChange={e => setKanjiChar(e.target.value)}
          />
          <input
            type="text"
            placeholder="Meaning"
            value={kanjiMeaning}
            onChange={e => setKanjiMeaning(e.target.value)}
          />
          <button onClick={handleAddKanji}>Add Kanji</button>
        </div>
      )}
    </div>
  );
}