import { useEffect } from "react";
import cls from "./Alert.module.scss"
import { AlertContext } from "../../app/providers/AlertProvider";
import { useRequiredContext } from "../../helpers/hooks/useRequiredContext";
import { AlertContextProps } from "../../app/providers/AlertProvider/lib/AlertContext";

interface AlertProps {
    message: string
}

export const Alert = ({ message }: AlertProps) => {
    const { deleteAlert } = useRequiredContext<AlertContextProps>(AlertContext)

    useEffect(() => {
        deleteAlert(message)
    }, [])

    return (
        <div className={cls.Alert} >
            {message}
        </div >
    );
}
