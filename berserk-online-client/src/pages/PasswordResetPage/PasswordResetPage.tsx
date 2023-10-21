import { PasswordResetModal } from "src/widgets/AccountModals/PasswordResetModal/PasswordResetModal";
import cls from "./PasswordResetPage.module.scss"
import { useState } from "react";
import { Navigate } from "react-router-dom";

// interface PasswordResetPageProps {
//     className?: string;
// }

export const PasswordResetPage = () => {

    const [isModal, setIsModal] = useState<boolean>(true)
    const [isNavigate, setIsNavigate] = useState<boolean>(false)

    const closeModal = () => {
        setIsModal(false)
        setIsNavigate(true)
    }

    return isNavigate
        ? <Navigate to={'/'} />
        : <div className={cls.PasswordResetPage} >
            {isModal &&
                <PasswordResetModal closeModal={closeModal} />}
        </div >
        ;
}
