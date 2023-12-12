import cls from './Button.module.scss'

interface ButtonProps {
    title: string
    onClick: React.MouseEventHandler<HTMLButtonElement>
    className?: string
    disabled?: boolean
}

export const Button = ({
    className,
    title,
    disabled = false,
    onClick,
}: ButtonProps) => {
    return (
        <button
            className={`${cls.Button} ${className}`}
            {...{ onClick, disabled }}
        >
            {title}
        </button>
    )
}
