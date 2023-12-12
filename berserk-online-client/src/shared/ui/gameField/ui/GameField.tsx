import { Button } from '../..'
import { DeckCell } from '../../deckCell'
import { GraveCell } from '../../graveCell'
import cls from './GameField.module.scss'

export const GameField = () => {
    const startGame = () => {}

    return (
        <div className={cls.GameField}>
            <div className={cls.SideColumn}>
                {Array.from(Array(6)).map((_, i) => (
                    <div key={i} className={cls.GameFieldCell}>
                        Летающее
                    </div>
                ))}
            </div>
            <div className={cls.SideColumn}>
                {Array.from(Array(6)).map((_, i) => (
                    <div key={i} className={cls.GameFieldCell}>
                        Летающее
                    </div>
                ))}
            </div>
            <div className={cls.MainField}>
                <div className={cls.GameFieldHalf}>
                    <div className={cls.GameFieldRow}>
                        {Array.from(Array(5)).map((_, i) => (
                            <div key={i} className={cls.GameFieldCell} />
                        ))}
                    </div>
                    <div className={cls.GameFieldRow}>
                        {Array.from(Array(5)).map((_, i) => (
                            <div key={i} className={cls.GameFieldCell} />
                        ))}
                    </div>
                    <div className={cls.GameFieldRow}>
                        {Array.from(Array(5)).map((_, i) => (
                            <div key={i} className={cls.GameFieldCell} />
                        ))}
                    </div>
                </div>
                <div className={cls.GameFieldHalf}>
                    <div className={cls.GameFieldRow}>
                        {Array.from(Array(5)).map((_, i) => (
                            <div key={i} className={cls.GameFieldCell} />
                        ))}
                    </div>
                    <div className={cls.GameFieldRow}>
                        {Array.from(Array(5)).map((_, i) => (
                            <div key={i} className={cls.GameFieldCell} />
                        ))}
                    </div>
                    <div className={cls.GameFieldRow}>
                        {Array.from(Array(5)).map((_, i) => (
                            <div key={i} className={cls.GameFieldCell} />
                        ))}
                    </div>
                </div>
            </div>

            <div className={cls.SideColumn}>
                <GraveCell className={cls.GameFieldCell} />
                <DeckCell className={cls.GameFieldCell} />
                <div className={cls.GameFieldCell}>Местность</div>
                <div className={cls.GameFieldCell}>Местность</div>
                <DeckCell className={cls.GameFieldCell} />
                <GraveCell className={cls.GameFieldCell} />
            </div>
            <div className={cls.blocked}>
                <Button title="Начать игру" onClick={startGame} />
            </div>
        </div>
    )
}
