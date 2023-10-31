import { useState } from "react";
import { CookieModalContext } from "../CookieModalProvider/lib/CookieModalContext";

interface CookieModalContextProviderProps {
    children: React.ReactNode
}

export const CookieModalContextProvider = ({ children }: CookieModalContextProviderProps) => {
    const [isCookieModal, setIsCookieModal] = useState<boolean>(false)

    const defaultValue = {
        isCookieModal,
        setIsCookieModal
    }

    return (
        <CookieModalContext.Provider value={defaultValue}>
            {children}
        </CookieModalContext.Provider>
    );
}
