// ================================
// src/context/AppContext.tsx (LocalStorage-based)
// ================================
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getDecks, saveDeck, addKanjiToDeck } from '../db';
import type { Deck, Kanji } from '../db';

interface AppState {
  decks: Deck[];
  addDeck: (name: string) => void;
  addKanji: (deckId: string, char: string, meaning: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    getDecks().then(setDecks);
  }, []);

  const addDeck = async (name: string) => {
    if (!name) return;
    const deck: Deck = { id: Date.now().toString(), name, kanji: [] };
    await saveDeck(deck);
    setDecks(await getDecks());
  };

  const addKanji = async (deckId: string, char: string, meaning: string) => {
    if (!deckId || !char) return;
    const kanji: Kanji = { id: Date.now().toString(), char, meaning };
    await addKanjiToDeck(deckId, kanji);
    setDecks(await getDecks());
  };

  return (
    <AppContext.Provider value={{ decks, addDeck, addKanji }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext)!;