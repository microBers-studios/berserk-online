import cls from "./Alert.module.scss"
import { AlertContext } from "src/app/providers/AlertProvider/index";
import { useRequiredContext } from "src/helpers/hooks/useRequiredContext";
import { AlertContextProps } from "src/app/providers/AlertProvider/lib/AlertContext";
import { IAlert } from "src/app/providers/AlertProvider/lib/types/types";
import CrossImage from "src/shared/assets/images/cross.svg";

interface AlertProps {
    alert: IAlert;
}

export const Alert = ({ alert }: AlertProps) => {
    const { deleteAlert } = useRequiredContext<AlertContextProps>(AlertContext)

    return (
        <div
            className={cls.Alert}
            onAnimationEnd={() => deleteAlert(alert.id)}
        >
            {alert.message}
            <img
                src={CrossImage}
                className={cls.CrossImage}
            />
        </div >
    )
}
