import cls from "./ModalButton.module.scss"

interface ModalButtonProps {
    text: string;
    isActive: boolean;
    onButtonClick?: (e: React.MouseEvent<HTMLElement>) => void | Promise<void>;
}

export const ModalButton = ({ text, isActive, onButtonClick }: ModalButtonProps) => {
    return (
        <button
            className={`${cls.ModalButton} ${isActive && cls.grayButton}`}
            disabled={isActive}
            onClick={onButtonClick}
        >
            {text}
        </button>
    );
}
