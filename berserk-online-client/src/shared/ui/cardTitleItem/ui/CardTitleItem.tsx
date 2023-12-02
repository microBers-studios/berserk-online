import { useEffect, useRef, useState } from 'react'
import cls from './CardTitleItem.module.scss'

interface CardTitleItemProps {
    cardSrc: string
    clientY: number
    isSearchbar?: boolean
}

export const CardTitleItem = ({
    cardSrc,
    clientY,
    isSearchbar,
}: CardTitleItemProps) => {
    const [isTop, setIsTop] = useState(false)
    const figureRef = useRef<HTMLElement>(null)

    useEffect(() => {
        if (!figureRef.current) {
            return
        }

        const elemHeight = figureRef.current.offsetHeight
        const elemBeforeHeight = parseInt(
            window
                .getComputedStyle(figureRef.current, '::before')
                .getPropertyValue('height')
        )

        const height = elemHeight + elemBeforeHeight

        if (window.innerHeight - clientY < height) {
            setIsTop(true)
        }
    }, [setIsTop, figureRef, clientY])

    return (
        <figure
            className={`${cls.CardTitleItem} ${isTop && cls.top}`}
            ref={figureRef}
        >
            <div
                className={`${cls.CardImageWrapper} ${
                    isSearchbar && cls.Searchbar
                }`}
            >
                <img className={cls.CardImage} src={cardSrc} />
            </div>
        </figure>
    )
}
