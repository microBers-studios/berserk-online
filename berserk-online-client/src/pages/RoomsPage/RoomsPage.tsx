import { RouterPaths } from "src/shared/lib"
import cls from "./RoomsPage.module.scss"
import { useEffect } from 'react'


interface RoomsPageProps {
    setPage: (page: RouterPaths | null) => void
}

export const RoomsPage = ({ setPage }: RoomsPageProps) => {
    useEffect(() => {
        setPage(RouterPaths.ROOMS)

        return () => {
            setPage(null)
        }
    }, [])

    return (
        <div className={cls.RoomsPage} >
            КОМНАТЫ
        </div>
    );
}
