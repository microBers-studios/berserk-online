import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import cls from './MainPage.module.scss'
import {
    useAppDispatch,
    useAppSelector,
    RouterPaths,
    createDeck,
} from 'src/shared/lib'
import { NotificationComponent } from 'src/shared/ui'
import { setCurrentDeck } from 'src/entities/decks'
import {
    fetchUserStatusSelector,
    loginUserStatusSelector,
} from 'src/entities/user'
import { DecksContainer } from 'src/widgets/decksContainer'
import { Layout } from 'src/shared/layouts'
import { Header } from 'src/widgets/header'
import { Footer } from 'src/widgets/footer'

interface MainPageProps {
    setPage: (page: RouterPaths | null) => void
    currentPage: RouterPaths | null
}

export const MainPage = ({ setPage, currentPage }: MainPageProps) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const fetchUserStatus = useAppSelector(fetchUserStatusSelector)
    const loginUserStatus = useAppSelector(loginUserStatusSelector)

    useEffect(() => {
        setPage(RouterPaths.MAIN)

        return () => {
            setPage(null)
        }
    }, [setPage])

    useEffect(() => {
        const cashedDeck = localStorage.getItem('deck')
        console.log(cashedDeck)

        if (
            (fetchUserStatus.isFulfilled || loginUserStatus.isFulfilled) &&
            cashedDeck
        ) {
            toast(
                <NotificationComponent
                    title={
                        'Последняя созданная дека не была сохранена.Хотите продолжить работу с ней?'
                    }
                    path={RouterPaths.CREATE_DECK}
                    onClick={() => {
                        dispatch(
                            setCurrentDeck(createDeck(JSON.parse(cashedDeck)))
                        )
                        navigate(RouterPaths.DECK)
                        localStorage.removeItem('deck')
                    }}
                />,
                {
                    onClose: () => {
                        localStorage.removeItem('deck')
                    },
                    onClick: () => {
                        const deck = JSON.parse(cashedDeck)
                        dispatch(
                            setCurrentDeck({
                                deck,
                            })
                        )
                        navigate(RouterPaths.CREATE_DECK)
                        localStorage.removeItem('deck')
                    },
                }
            )
        }
    }, [fetchUserStatus, loginUserStatus, dispatch, navigate])

    return (
        <Layout
            header={<Header currentPage={currentPage} />}
            content={
                <div className={cls.MainPage}>
                    <DecksContainer />
                </div>
            }
            footer={<Footer />}
            title="Главная | Берсерк онлайн"
        />
    )
}
