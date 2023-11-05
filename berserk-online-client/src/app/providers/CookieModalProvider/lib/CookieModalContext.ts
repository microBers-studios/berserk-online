import { createContext } from 'react'

export interface CookieModalContextProps {
    isCookieModal: boolean;
    setIsCookieModal: (b: boolean) => void;
}

export const CookieModalContext = createContext<CookieModalContextProps | null>(null)