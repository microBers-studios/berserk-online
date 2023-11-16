import { RouterPaths } from "src/shared/lib"
import cls from "./RoomsPage.module.scss"
import { useEffect } from 'react'
import { Layout } from "src/shared/layouts"
import { Header } from "src/widgets/header";
import { Footer } from "src/widgets/footer";


interface RoomsPageProps {
    setPage: (page: RouterPaths | null) => void;
    currentPage: RouterPaths | null;
}

export const RoomsPage = ({ setPage, currentPage }: RoomsPageProps) => {
    useEffect(() => {
        setPage(RouterPaths.ROOMS)

        return () => {
            setPage(null)
        }
    }, [])

    return (
        <Layout
            header={<Header currentPage={currentPage} />}
            content={<div className={cls.RoomsPage} >
                КОМНАТЫ
            </div>}
            footer={<Footer />}
            title='Комнаты | Берсерк онлайн'
        />

    );
}
