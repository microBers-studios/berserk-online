import cls from "./Alert.module.scss"
import { AlertContext } from "src/app/providers/AlertProvider/index";
import { useRequiredContext } from "src/helpers/hooks/useRequiredContext";
import { AlertContextProps } from "src/app/providers/AlertProvider/lib/AlertContext";
import { IAlert } from "src/app/providers/AlertProvider/lib/types/types";
// import { CrossSvg } from "../CrossSvg/CrossSvg";
import { CrossSvg } from "../CrossSvg/CrossSvg";
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
            <CrossSvg
                className={cls.CrossImage}
                fill={'var(--secondary-color)'}
                onClick={() => deleteAlert(alert.id)}
            />
        </div>
    )
}
