import cls from './SymbolIcon.module.scss'

interface SymbolIconProps {
    src: string
}

export const SymbolIcon = ({ src }: SymbolIconProps) => {
    return (
        <div className={cls.SymbolIcon}>
            <img src={src} className={cls.SymbolImage} />
        </div>
    )
}
