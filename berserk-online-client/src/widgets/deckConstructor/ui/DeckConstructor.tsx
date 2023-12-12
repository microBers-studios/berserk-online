import { useState } from 'react'
import cls from './DeckConstructor.module.scss'
import { CardItem, CardModal } from 'src/features/decks'

interface DeckConstructorProps {
    deck: DeckType | null
    isSaveDisabled: boolean
    setIsSaveDisabled: (b: boolean) => void
}

export const DeckConstructor = ({
    deck,
    isSaveDisabled,
    setIsSaveDisabled,
}: DeckConstructorProps) => {
    const [modalCardId, setModalCardId] = useState<number | null>(null)

    const modalCard = deck?.main.find((c) => c.id === modalCardId)
    const ordinaryCards = deck?.main.filter((c) => !c.elite)

    const eliteCards = deck?.main.filter((c) => c.elite)

    return (
        <>
            <div className={cls.DeckConstructor}>
                <div className={cls.CardsContainer}>
                    <div className={cls.EliteCardsContainer}>
                        <h2 className={cls.EliteCardsHeader}>
                            Элитные карты (
                            {eliteCards?.reduce(
                                (acc, curr) => acc + curr.amount,
                                0
                            )}
                            )
                        </h2>

                        <ul className={cls.CardsWrapper}>
                            {eliteCards && eliteCards.length ? (
                                eliteCards.map((card) => (
                                    <CardItem
                                        key={card.id}
                                        card={card}
                                        isSaveDisabled={isSaveDisabled}
                                        setIsSaveDisabled={setIsSaveDisabled}
                                        setModalCard={(id: number | null) => {
                                            setModalCardId(id)
                                            document.body.style.overflow =
                                                'hidden'
                                        }}
                                    />
                                ))
                            ) : (
                                <span className={cls.NoCardsText}>
                                    Карт нет
                                </span>
                            )}
                        </ul>
                    </div>
                    <div className={cls.OrdinaryCardsContainer}>
                        <h2 className={cls.OrdinaryCardsHeader}>
                            Рядовые карты (
                            {ordinaryCards?.reduce(
                                (acc, curr) => acc + curr.amount,
                                0
                            )}
                            )
                        </h2>

                        <ul className={cls.CardsWrapper}>
                            {ordinaryCards && ordinaryCards.length ? (
                                ordinaryCards.map((card) => (
                                    <CardItem
                                        key={card.id}
                                        card={card}
                                        isSaveDisabled={isSaveDisabled}
                                        setIsSaveDisabled={setIsSaveDisabled}
                                        setModalCard={(id: number | null) => {
                                            setModalCardId(id)
                                            document.body.style.overflow =
                                                'hidden'
                                        }}
                                    />
                                ))
                            ) : (
                                <span className={cls.NoCardsText}>
                                    Карт нет
                                </span>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
            {modalCard && (
                <CardModal
                    card={modalCard}
                    closeModal={() => setModalCardId(null)}
                    isSaveDisabled={isSaveDisabled}
                    setIsSaveDisabled={setIsSaveDisabled}
                />
            )}
        </>
    )
}
