import { RouterPaths } from "src/app/providers/router/router-paths"
import cls from "./RoomsPage.module.scss"
import { useEffect } from 'react'


interface RoomsPageProps {
    setPage: (page: RouterPaths) => void
}

export const RoomsPage = ({ setPage }: RoomsPageProps) => {
    useEffect(() => {
        setPage(RouterPaths.ROOMS)
    }, [])

    return (
        <div className={cls.RoomsPage} >
            КОМНАТЫ
        </div>
    );
}
