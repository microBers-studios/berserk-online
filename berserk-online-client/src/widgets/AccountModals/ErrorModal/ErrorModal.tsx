import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cls from "./ErrorModal.module.scss";
import { Modal } from "src/widgets/Modal/Modal";
import { IAnimator, useAnimate } from "src/helpers/hooks/useAnimate";
import errorSvg from 'src/shared/assets/images/error.svg'
import { RouterPaths } from 'src/app/providers/router/router-paths';
import { Mode } from 'src/app/store/slices/modalSlice/modalSlice';

// interface ErrorModalProps {
//     className?: string;
// }


export const ErrorModal = () => {

    const { isOpenAnimation, setIsOpenAnimation,
        isCloseAnimation, setIsCloseAnimation }: IAnimator = useAnimate()

    const navigate = useNavigate()

    useEffect(() => {
        document.body.style.overflow = 'hidden';
    }, [])

    const closeModal = () => {
        navigate(RouterPaths.MAIN)
    }

    return (
        <Modal
            isCloseAnimation={isCloseAnimation}
            isOpenAnimation={isOpenAnimation}
            setIsCloseAnimation={setIsCloseAnimation}
            setIsOpenAnimation={setIsOpenAnimation}
            closeModal={closeModal}
            modalClass={Mode.EMAIL}
        >
            <div
                className={cls.ErrorWrapper}
            >
                <img
                    src={errorSvg}
                    className={cls.ErrorImage}
                />
                <h1
                    className={cls.ErrorModalHeader}
                >Ошибка!</h1>
                <p
                    className={cls.ErrorText}
                >Возможно&nbsp;ссылка&nbsp;устарела или неверна.</p>
            </div>
        </Modal>
    );
}
