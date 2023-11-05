import { createContext } from 'react';
import { DecksArray } from 'src/API/utils/types';

export interface DecksContextProps {
    decks: DecksArray;
    setDecks: (decks: DecksArray) => void;
}

export const DecksContext = createContext<DecksContextProps | null>(null)