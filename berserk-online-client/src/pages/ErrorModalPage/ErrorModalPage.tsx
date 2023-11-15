import { ErrorModal } from "src/shared/ui";
import cls from "./ErrorModalPage.module.scss"

export const ErrorModalPage = () => {
    return (
        <div className={cls.ErrorModalPage} >
            <ErrorModal />
        </div >
    );
}
