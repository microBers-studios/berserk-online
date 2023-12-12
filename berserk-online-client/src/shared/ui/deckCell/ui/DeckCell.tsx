import cls from './DeckCell.module.scss'
import berserkCard from 'src/shared/assets/images/classical-berserk-card.jpg'

interface DeckCellProps {
    className?: string
}

export const DeckCell = ({ className }: DeckCellProps) => {
    return (
        <div className={className} id={cls.DeckCell} title="Колода">
            <div className={cls.DeckWrapper}>
                <img src={berserkCard} className={cls.DeckItem} alt="Колода" />
            </div>
        </div>
    )
}
