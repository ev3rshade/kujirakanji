import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Decks from './pages/Decks';
import Library from './pages/Library';
import Practice from './pages/Practice';

export default function App() {
  const [tab, setTab] = useState<'decks' | 'library' | 'practice'>('decks');

  return (
    <AppProvider>
      <nav className="tabs">
        <button onClick={() => setTab('decks')}>Decks</button>
        <button onClick={() => setTab('library')}>Library</button>
        <button onClick={() => setTab('practice')}>Practice</button>
      </nav>

      {tab === 'decks' && <Decks />}
      {tab === 'library' && <Library />}
      {tab === 'practice' && <Practice />}
    </AppProvider>
  );
}