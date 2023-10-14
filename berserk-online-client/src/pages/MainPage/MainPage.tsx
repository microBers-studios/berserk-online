import { useEffect } from 'react'
import { RouterPaths } from "src/app/providers/router/router-paths";
import cls from "./MainPage.module.scss"

interface MainPageProps {
    setPage: (page: RouterPaths) => void
}

export const MainPage = ({ setPage }: MainPageProps) => {

    useEffect(() => {
        setPage(RouterPaths.MAIN)
    }, [])

    return (
        <div className={cls.MainPage}>
            ГЛАВНАЯ
        </div>
    );
}
