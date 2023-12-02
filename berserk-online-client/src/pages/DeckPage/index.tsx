import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import cls from './DeckPage.module.scss'
import ReactLoading from 'react-loading'
import { CardsSearchbar } from 'src/widgets/cardsSearchbar'
import {
    useAppDispatch,
    useAppSelector,
    RouterPaths,
    useResize,
} from 'src/shared/lib'
import { getDeck, getDeckStatusSelector } from 'src/entities/decks'
import {
    fetchUserStatusSelector,
    loginUserStatusSelector,
    registrateUserStatusSelector,
} from 'src/entities/user'
import { DeckConstructor } from 'src/widgets/deckConstructor'
import { DeckStatistics } from 'src/widgets/deckStatistics'
import { SaveButton } from 'src/features/decks'
import { Layout } from 'src/shared/layouts'
import { Header } from 'src/widgets/header'
import { Footer } from 'src/widgets/footer'

interface DeckPageProps {
    currentPage: RouterPaths | null
}

export const DeckPage = ({ currentPage }: DeckPageProps) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { width } = useResize()

    const fetchUserStatus = useAppSelector(fetchUserStatusSelector)
    const loginUserStatus = useAppSelector(loginUserStatusSelector)
    const registrateUserStatus = useAppSelector(registrateUserStatusSelector)
    const getDeckStatus = useAppSelector(getDeckStatusSelector)
    const updateDeckStatus = useAppSelector(getDeckStatusSelector)
    const { user } = useAppSelector((state) => state.user)

    const { id } = useParams()

    const deck = useAppSelector((state) => state.decks.currentDeck)
    const [isSaveDisabled, setIsSaveDisabled] = useState(true)
    const isLoading =
        ((!deck || deck.id !== id) && getDeckStatus.isUncompleted) ||
        updateDeckStatus.isPending ||
        (fetchUserStatus.isUncompleted &&
            loginUserStatus.isUncompleted &&
            registrateUserStatus.isUncompleted)

    useEffect(() => {
        if (fetchUserStatus.isRejected) {
            navigate(RouterPaths.ERROR)
        }

        if (user.id) {
            if (!id) {
                navigate(RouterPaths.ERROR)
                return
            }
            if (!deck || deck.id !== id) dispatch(getDeck(id))
        }
    }, [user, deck, dispatch, id, navigate, fetchUserStatus])

    return (
        <Layout
            header={<Header currentPage={currentPage} />}
            content={
                <div className={cls.DeckPage}>
                    {isLoading ? (
                        <ReactLoading
                            type={'bubbles'}
                            color={'#ffffff'}
                            height={100}
                            width={90}
                        />
                    ) : (
                        <>
                            <div className={cls.DeckPageWrapper}>
                                <div className={cls.DeckHeaderWrapper}>
                                    <h1 className={cls.DeckPageHeader}>
                                        {deck?.name}
                                    </h1>
                                    <p className={cls.DeckCardsCount}>
                                        Всего карт:{' '}
                                        {deck?.main.reduce(
                                            (acc, curr) => acc + curr.amount,
                                            0
                                        )}
                                    </p>
                                    <SaveButton
                                        isSaveDisabled={isSaveDisabled}
                                        setIsSaveDisabled={setIsSaveDisabled}
                                    />
                                </div>
                                {width <= 700 && (
                                    <CardsSearchbar
                                        setIsSaveDisabled={setIsSaveDisabled}
                                    />
                                )}
                                <DeckConstructor
                                    deck={deck}
                                    isSaveDisabled={isSaveDisabled}
                                    setIsSaveDisabled={setIsSaveDisabled}
                                />
                                <DeckStatistics deck={deck as DeckType} />
                            </div>
                            {width > 700 && (
                                <CardsSearchbar
                                    setIsSaveDisabled={setIsSaveDisabled}
                                />
                            )}
                        </>
                    )}
                </div>
            }
            footer={<Footer />}
            title={
                deck
                    ? `Колода ${deck?.name} | Берсерк онлайн`
                    : 'Берсерк онлайн'
            }
        />
    )
}
