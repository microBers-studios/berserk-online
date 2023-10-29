import { useEffect } from 'react';
import { Modal } from "src/widgets/Modal/Modal";
import cls from "./ErrorModal.module.scss";
import { IAnimator, useAnimate } from "src/helpers/hooks/useAnimate";

// interface ErrorModalProps {
//     className?: string;
// }


export const ErrorModal = () => {

    const { isOpenAnimation, setIsOpenAnimation,
        isCloseAnimation, setIsCloseAnimation }: IAnimator = useAnimate()

    useEffect(() => {
        document.body.style.overflow = 'hidden';
    }, [])

    const closeModal = () => {
        setIsCloseAnimation(true)
        setTimeout(() => closeModal(), 300)
        document.body.style.overflow = ''
    }

    return (
        <div className={cls.ErrorModal} >
            <Modal
                isCloseAnimation={isCloseAnimation}
                isOpenAnimation={isOpenAnimation}
                setIsCloseAnimation={setIsCloseAnimation}
                setIsOpenAnimation={setIsOpenAnimation}
                closeModal={closeModal}
            >
                <h1
                    className={cls.ErrorModalHeader}
                >Ошибка!</h1>
            </Modal>
        </div>
    );
}
