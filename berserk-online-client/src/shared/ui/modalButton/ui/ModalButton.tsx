import cls from './ModalButton.module.scss'

interface ModalButtonProps {
    text: string
    isActive?: boolean
    onButtonClick?: (
        e: React.MouseEvent<HTMLButtonElement>
    ) => void | Promise<void>
}

export const ModalButton = ({
    text,
    isActive = false,
    onButtonClick,
}: ModalButtonProps) => {
    return (
        <button
            className={`${cls.ModalButton} ${isActive && cls.grayButton}`}
            disabled={isActive}
            onClick={onButtonClick}
        >
            {text}
        </button>
    )
}
