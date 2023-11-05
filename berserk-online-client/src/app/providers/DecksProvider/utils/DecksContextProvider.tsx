import { useState, useMemo } from "react";
import { DecksArray } from "src/API/utils/types";
import { DecksContext } from "./DecksContext";

interface DecksContextProviderProps {
    children: React.ReactNode;
}

export const DecksContextProvider = ({ children }: DecksContextProviderProps) => {
    const [decks, setDecks] = useState<DecksArray>([])

    const defaultValue = useMemo(() => {
        return {
            decks,
            setDecks
        }
    }, [decks])

    return (
        <DecksContext.Provider value={defaultValue}>
            {children}
        </DecksContext.Provider>
    );
}
