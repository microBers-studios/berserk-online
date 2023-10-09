import { useMemo, useState } from "react";
import { AlertContext } from "..";

interface AlertContextProviderProps {
    children: React.ReactNode
}

export const AlertContextProvider = ({ children }: AlertContextProviderProps) => {
    const [alertsArray, setAlertsArray] = useState<string[]>([])
    const defaultValue = useMemo(() => {
        return {
            alerts: alertsArray,

            setAlert: (alert: string) => {
                setAlertsArray(() => [...alertsArray, alert])
            },

            deleteAlert: (alert: string) => {
                const newAlerts = [...alertsArray]
                newAlerts.splice(newAlerts.indexOf(alert), 1)

                setAlertsArray(() => newAlerts)
            }
        }
    }, [])

    return (
        <AlertContext.Provider value={defaultValue}>
            {children}
        </AlertContext.Provider>
    );
}
