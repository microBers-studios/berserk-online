import { ReactNode } from 'react'
import cls from './Modal.module.scss'
import crossImage from 'src/shared/assets/images/cross.svg'
import whiteCrossImage from 'src/shared/assets/images/white-cross.svg'

interface ModalProps {
    children: ReactNode
    isOpenAnimation: boolean
    isAnimation?: boolean
    isCloseAnimation: boolean
    setIsOpenAnimation: (b: boolean) => void
    setIsCloseAnimation: (b: boolean) => void
    setIsAnimation?: (b: boolean) => void
    closeModal: () => void
    modalClass?: string
    theme?: 'light' | 'dark'
}

export const Modal = ({ theme = 'light', ...props }: ModalProps) => {
    const endAnimation = () => {
        if (props.isOpenAnimation) {
            props.setIsOpenAnimation(false)
        }

        if (props.isAnimation && props.setIsAnimation) {
            props.setIsAnimation(false)
        }
    }

    return (
        <div className={cls.wrapper}>
            <div
                className={`${cls.Modal} ${
                    props.isOpenAnimation && cls.opened
                } ${props.isAnimation && cls.animated} ${
                    props.isCloseAnimation && cls.closed
                } ${props.modalClass}`}
                onAnimationEnd={endAnimation}
            >
                <img
                    src={theme === 'dark' ? whiteCrossImage : crossImage}
                    className={cls.crossImage}
                    onClick={props.closeModal}
                />
                {props.children}
            </div>
        </div>
    )
}
