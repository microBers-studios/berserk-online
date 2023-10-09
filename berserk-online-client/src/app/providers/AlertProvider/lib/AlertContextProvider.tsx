import { useMemo, useState } from "react";
import { AlertContext } from "..";
import { IAlert } from "./types/types";

interface AlertContextProviderProps {
    children: React.ReactNode
}

export const AlertContextProvider = ({ children }: AlertContextProviderProps) => {
    const [alertsArray, setAlertsArray] = useState<IAlert[]>([])

    const defaultValue = useMemo(() => {
        return {
            alerts: alertsArray,

            setAlert: (message: string) => {
                setAlertsArray(() => [...alertsArray, { id: alertsArray.length, message }])
            },

            deleteAlert: (id: number) => {
                setAlertsArray(() => alertsArray.filter(a => a.id !== id))
            }
        }
    }, [alertsArray])

    return (
        <AlertContext.Provider value={defaultValue}>
            {children}
        </AlertContext.Provider>
    );
}
