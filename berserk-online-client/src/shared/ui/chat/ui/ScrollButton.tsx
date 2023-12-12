import cls from './Chat.module.scss'
import arrowSvg from 'src/shared/assets/images/arrow.svg'

interface ScrollButtonProps {
    container: HTMLDivElement
}

export const ScrollButton = ({ container }: ScrollButtonProps) => {
    const scrollToBottom = () => {
        container.scrollIntoView({ block: 'end' })
    }

    return (
        <div className={cls.ScrollButton} onClick={scrollToBottom}>
            <img className={cls.arrowImage} src={arrowSvg} alt="" />
        </div>
    )
}
