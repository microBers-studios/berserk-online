import { createContext } from "react";

export interface AlertContextProps {
    alerts: string[];
    setAlert: (str: string) => void;
    deleteAlert: (str: string) => void;
}

export const AlertContext = createContext<AlertContextProps | null>(null)