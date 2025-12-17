// ================================
// src/db.ts (LocalStorage-based DB)
// ================================
export interface Kanji {
  id: string;
  char: string;
  meaning: string;
}

export interface Deck {
  id: string;
  name: string;
  kanji: Kanji[];
}

const STORAGE_KEY = 'kanji_app_data';

function loadData(): Deck[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveData(decks: Deck[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}

export async function getDecks(): Promise<Deck[]> {
  return loadData();
}

export async function saveDeck(deck: Deck) {
  const decks = loadData();
  const index = decks.findIndex(d => d.id === deck.id);
  if (index >= 0) {
    decks[index] = deck;
  } else {
    decks.push(deck);
  }
  saveData(decks);
}

export async function addKanjiToDeck(deckId: string, kanji: Kanji) {
  const decks = loadData();
  const deck = decks.find(d => d.id === deckId);
  if (!deck) return;
  deck.kanji.push(kanji);
  saveData(decks);
}