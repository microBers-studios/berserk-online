import { ReactNode } from 'react'
import cls from "./Modal.module.scss"
import crossImage from "src/shared/assets/images/cross.svg"
import { Mode } from 'src/app/store/slices/modalSlice/modalSlice';


interface ModalProps {
    children: ReactNode;
    isOpenAnimation: boolean;
    isAnimation?: boolean;
    isCloseAnimation: boolean;
    setIsOpenAnimation: (b: boolean) => void;
    setIsCloseAnimation: (b: boolean) => void;
    setIsAnimation?: (b: boolean) => void;
    closeModal: () => void;
    modalClass?: Mode;
}

export const Modal = (props: ModalProps) => {
    const endAnimation = () => {
        if (props.isOpenAnimation) {
            props.setIsOpenAnimation(false)
        }

        if (props.isAnimation && props.setIsAnimation) {
            props.setIsAnimation(false)
        }
    }

    return (
        <div
            className={cls.wrapper}
        >
            <div
                className={`${cls.Modal} ${props.isOpenAnimation && cls.opened} ${props.isAnimation && cls.animated} ${props.isCloseAnimation && cls.closed} ${props.modalClass == Mode.EMAIL && cls.EmailModal} ${props.modalClass == Mode.CLOSE && cls.CloseModal}`}
                onAnimationEnd={endAnimation}>
                <img
                    src={crossImage}
                    className={cls.crossImage}
                    onClick={props.closeModal}
                />
                {props.children}
            </div >
        </div>
    );
}
