import { createContext } from "react";
import { IAlert } from "./types/types";

export interface AlertContextProps {
    alerts: IAlert[];
    setAlert: (message: string) => void;
    deleteAlert: (id: number) => void;
}

export const AlertContext = createContext<AlertContextProps | null>(null)