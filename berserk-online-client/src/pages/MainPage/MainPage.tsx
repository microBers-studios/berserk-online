import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import cls from "./MainPage.module.scss"
import { useAppDispatch, useAppSelector, RouterPaths } from "src/shared/lib";
import { NotificationComponent } from 'src/shared/ui';
import { setCurrentDeck } from 'src/entities/decks';
import { fetchUserStatusSelector, loginUserStatusSelector } from 'src/entities/user';
import { DecksContainer } from 'src/widgets/decksContainer';

interface MainPageProps {
    setPage: (page: RouterPaths | null) => void
}

export const MainPage = ({ setPage }: MainPageProps) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const fetchUserStatus = useAppSelector(fetchUserStatusSelector)
    const loginUserStatus = useAppSelector(loginUserStatusSelector)

    useEffect(() => {
        setPage(RouterPaths.MAIN)

        return () => {
            setPage(null)
        }
    }, [])

    useEffect(() => {
        const cashedDeck = localStorage.getItem('deck')

        if ((fetchUserStatus.isFulfilled || loginUserStatus.isFulfilled) && cashedDeck) {
            toast(<NotificationComponent
                title={'Последняя созданная дека не была сохранена.Хотите продолжить работу с ней?'}
                path={RouterPaths.CREATE_DECK}
                onClick={() => {
                    console.log('deck')
                    dispatch(setCurrentDeck(JSON.parse(cashedDeck)))
                    navigate(RouterPaths.DECK)
                    localStorage.removeItem('deck')
                }}
            />, {
                onClose: () => {
                    localStorage.removeItem('deck')
                }
            });
        }
    }, [fetchUserStatus, loginUserStatus])

    return (
        <div className={cls.MainPage}>
            <DecksContainer />
        </div>
    );
}
