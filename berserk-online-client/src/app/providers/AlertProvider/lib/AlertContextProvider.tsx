import { useMemo, useState } from "react";
import { AlertContext } from "..";
import { IAlert } from "./types/types";

interface AlertContextProviderProps {
    children: React.ReactNode
}

export const AlertContextProvider = ({ children }: AlertContextProviderProps) => {
    const [alertsArray, setAlertsArray] = useState<IAlert[]>([])
    const IDsArray: number[] = []

    const defaultValue = useMemo(() => {
        return {
            alerts: alertsArray,

            setAlert: (message: string) => {
                const id = IDsArray.includes(alertsArray.length) ? Math.max(...IDsArray) : alertsArray.length;
                setAlertsArray([...alertsArray, { id, message }])
                IDsArray.push(id)
            },

            deleteAlert: (id: number) => {
                setAlertsArray(alertsArray.filter(a => a.id !== id))
            }
        }
    }, [alertsArray])

    return (
        <AlertContext.Provider value={defaultValue}>
            {children}
        </AlertContext.Provider>
    );
}
