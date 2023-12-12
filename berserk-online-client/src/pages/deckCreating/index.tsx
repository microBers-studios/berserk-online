import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import cls from './DeckCreatingPage.module.scss'
import { CardItem, CardModal, CreateButton } from 'src/features/decks'
import { CardsSearchbar } from 'src/widgets/cardsSearchbar'
import { useAppSelector, RouterPaths, useResize } from 'src/shared/lib'
import { setCurrentDeck } from 'src/entities/decks'
import { Layout } from 'src/shared/layouts'
import { Header } from 'src/widgets/header'
import { Footer } from 'src/widgets/footer'

interface DeckCreatingPageProps {
    currentPage: RouterPaths | null
}

export const DeckCreatingPage = ({ currentPage }: DeckCreatingPageProps) => {
    const navigate = useNavigate()

    const { width } = useResize()
    const deck = useAppSelector((state) => state.decks.currentDeck)
    const [isSaveDisabled, setIsSaveDisabled] = useState(true)
    const [deckName, setDeckName] = useState(deck?.name ? deck.name : '')

    const [modalCardId, setModalCardId] = useState<number | null>(null)

    const modalCard = deck?.main.find((c) => c.id === modalCardId)

    useEffect(() => {
        if (deck?.main.length) {
            setIsSaveDisabled(false)
        }

        if (deck) {
            localStorage.setItem(
                'deck',
                JSON.stringify({
                    ...deck,
                    name: deckName,
                })
            )
        } else {
            navigate(RouterPaths.MAIN)
        }

        return function () {
            localStorage.removeItem('deck')
            setCurrentDeck({ deck: null })
        }
    }, [deck, navigate, deckName])

    const ordinaryCards = deck?.main.filter((c) => !c.elite)

    const eliteCards = deck?.main.filter((c) => c.elite)

    return (
        <Layout
            header={<Header currentPage={currentPage} />}
            content={
                <>
                    <div className={cls.DeckCreatingPage}>
                        <div className={cls.DeckContainer}>
                            <div className={cls.DeckHeaderWrapper}>
                                <span className={cls.DeckPageHeader}>
                                    Имя:
                                    <input
                                        className={cls.DeckPageHeaderInput}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) => setDeckName(e.target.value)}
                                        value={deckName}
                                        autoFocus={true}
                                    />
                                </span>

                                <p className={cls.DeckCardsCount}>
                                    Всего карт:{' '}
                                    {Number(
                                        eliteCards?.reduce(
                                            (acc, curr) => acc + curr.amount,
                                            0
                                        )
                                    ) +
                                        Number(
                                            ordinaryCards?.reduce(
                                                (acc, curr) =>
                                                    acc + curr.amount,
                                                0
                                            )
                                        )}
                                </p>
                                <CreateButton
                                    deckName={deckName}
                                    isSaveDisabled={isSaveDisabled}
                                />
                            </div>
                            {width <= 700 && (
                                <CardsSearchbar
                                    setIsSaveDisabled={setIsSaveDisabled}
                                />
                            )}
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
                                                    isSaveDisabled={
                                                        isSaveDisabled
                                                    }
                                                    setIsSaveDisabled={
                                                        setIsSaveDisabled
                                                    }
                                                    setModalCard={(
                                                        id: number | null
                                                    ) => {
                                                        setModalCardId(id)
                                                        if (id)
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
                                        {ordinaryCards &&
                                        ordinaryCards.length ? (
                                            ordinaryCards.map((card) => (
                                                <CardItem
                                                    key={card.id}
                                                    card={card}
                                                    isSaveDisabled={
                                                        isSaveDisabled
                                                    }
                                                    setIsSaveDisabled={
                                                        setIsSaveDisabled
                                                    }
                                                    setModalCard={(
                                                        id: number | null
                                                    ) => {
                                                        setModalCardId(id)
                                                        if (id)
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
                        {width > 700 && (
                            <CardsSearchbar
                                setIsSaveDisabled={setIsSaveDisabled}
                            />
                        )}
                    </div>
                    {modalCard && (
                        <CardModal
                            card={modalCard}
                            isSaveDisabled={isSaveDisabled}
                            setIsSaveDisabled={setIsSaveDisabled}
                            closeModal={() => setModalCardId(null)}
                        />
                    )}
                </>
            }
            footer={<Footer />}
            title={'Создание колоды | Берсерк онлайн'}
        />
    )
}
