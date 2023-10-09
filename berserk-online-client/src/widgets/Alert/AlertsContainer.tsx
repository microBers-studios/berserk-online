import { IAlert } from "../../app/providers/AlertProvider/lib/types/types";
import { Alert } from "./Alert";
import cls from "./Alert.module.scss"

interface AlertsContainerProps {
    alerts: IAlert[]
}

export const AlertsContainer = ({ alerts }: AlertsContainerProps) => {
    return (
        <div className={cls.AlertsContainer} >
            {alerts.map(alert => <Alert key={alert.id} alert={alert} />)}
        </div >
    );
}
