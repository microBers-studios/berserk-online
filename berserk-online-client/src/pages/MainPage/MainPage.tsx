import { useEffect } from 'react'
import { toast } from 'react-toastify'
import cls from "./MainPage.module.scss"
import { RouterPaths } from "src/app/providers/router/router-paths";
import { DecksContainer } from 'src/widgets/DecksContainer/DecksContainer';
import { NotificationComponent } from 'src/widgets/NotificationComponent/NotificationComponent';
import { useAppDispatch, useAppSelector } from 'src/shared/lib/redux/redux-hook';
import { setCurrentDeck } from 'src/app/store/slices/decksSlice/decksSlice';
import { useNavigate } from 'react-router-dom';
import { getUserStatusSelector, loginUserStatusSelector } from 'src/app/store/slices/userSlice/selectors';

interface MainPageProps {
    setPage: (page: RouterPaths | null) => void
}

export const MainPage = ({ setPage }: MainPageProps) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const getUserStatus = useAppSelector(getUserStatusSelector)
    const loginUserStatus = useAppSelector(loginUserStatusSelector)

    useEffect(() => {
        setPage(RouterPaths.MAIN)

        return () => {
            setPage(null)
        }
    }, [])

    useEffect(() => {
        const cashedDeck = localStorage.getItem('deck')

        if ((getUserStatus.isFulfilled || loginUserStatus.isFulfilled) && cashedDeck) {
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
    }, [getUserStatus, loginUserStatus])

    return (
        <div className={cls.MainPage}>
            <DecksContainer />
        </div>
    );
}
