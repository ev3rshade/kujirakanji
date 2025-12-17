import { useState } from 'react';
import { useApp } from '../context/AppContext';
import KanjiCanvas from '../components/KanjiCanvas';
import type { StrokePoint } from '../components/KanjiCanvas';

export default function Practice() {
  const { decks } = useApp();
  const [testMode, setTestMode] = useState(false);
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [testKanji, setTestKanji] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userStrokes, setUserStrokes] = useState<{[kanji:string]: StrokePoint[][]}>({});


  const allDecks = Object.values(decks);

  const startTest = () => {
    if (!selectedDeckId) return;
    const deck = decks.find(d => d.id === selectedDeckId);
    if (!deck) return;
    const kanjiList = deck.kanji.map(k => k.char);
    setTestKanji(kanjiList);
    setCurrentIndex(0);
    setScore(0);
    setTestMode(true);
    setShowAnswer(false);
  };

  const markCorrect = () => {
    setScore(score + 1);
    nextCard();
  };

  const markIncorrect = () => {
    nextCard();
  };

  const nextCard = () => {
    if (currentIndex + 1 < testKanji.length) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setTestMode(false);
      alert(`Test finished! Score: ${score}/${testKanji.length}`);
    }
  };

  if (!testMode) {
    return (
      <div style={{ padding: 16 }}>
        <h1>Practice</h1>
        <select onChange={e => setSelectedDeckId(e.target.value)} value={selectedDeckId || ''}>
          <option value="">Select Deck</option>
          {allDecks.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <button onClick={startTest} disabled={!selectedDeckId}>Start Test</button>
      </div>
    );
  }

  const currentKanji = testKanji[currentIndex];

  return (
    <div style={{ padding: 16 }}>
      <h2>Kanji Test</h2>
      <p>Card {currentIndex + 1} / {testKanji.length}</p>

      <KanjiCanvas
        onComplete={(strokes) => {
          setUserStrokes(prev => ({ ...prev, [currentKanji]: strokes }));
          localStorage.setItem('kanji_strokes', JSON.stringify({ ...userStrokes, [currentKanji]: strokes }));
        }}
      />


      <button onClick={() => setShowAnswer(!showAnswer)}>
        {showAnswer ? 'Hide Answer' : 'Show Answer'}
      </button>

      {showAnswer && <p style={{ fontSize: '2rem' }}>Answer: {currentKanji}</p>}

      <div style={{ marginTop: 10 }}>
        <button onClick={markCorrect}>Correct</button>
        <button onClick={markIncorrect}>Incorrect</button>
      </div>
    </div>
  );
}
