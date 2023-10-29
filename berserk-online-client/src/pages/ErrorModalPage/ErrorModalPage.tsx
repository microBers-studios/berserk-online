import { ErrorModal } from "src/widgets/AccountModals/ErrorModal/ErrorModal";
import cls from "./ErrorModalPage.module.scss"

// interface ErrorModalPageProps {
//     className?: string;
// }

export const ErrorModalPage = () => {
    return (
        <div className={cls.ErrorModalPage} >
            <ErrorModal />
        </div >
    );
}
