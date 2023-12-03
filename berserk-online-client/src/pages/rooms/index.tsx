import { RouterPaths } from 'src/shared/lib'
import cls from './RoomsPage.module.scss'
import { useEffect, useState } from 'react'
import { Layout } from 'src/shared/layouts'
import { Header } from 'src/widgets/header'
import { Footer } from 'src/widgets/footer'
import { RoomsContainer } from 'src/widgets/roomsContainer'
import { signalRConnection } from 'src/shared/api'

interface RoomsPageProps {
    setPage: (page: RouterPaths | null) => void
    currentPage: RouterPaths | null
}

export const RoomsPage = ({ setPage, currentPage }: RoomsPageProps) => {
    const [rooms, setRooms] = useState<RoomType[] | null>(null)
    const [connection, setConnection] = useState(false)

    useEffect(() => {
        setPage(RouterPaths.ROOMS)

        signalRConnection.start().then(() => {
            setConnection(true)
            signalRConnection.on('RoomsList', (roomsList: RoomType[]) => {
                setRooms(roomsList)
            })
            signalRConnection.on('RoomsListUpdate', (roomsList: RoomType[]) => {
                setRooms(roomsList)
            })
        })

        return () => {
            setPage(null)
            signalRConnection.stop()
            setConnection(false)
        }
    }, [setPage])

    return (
        <Layout
            header={<Header currentPage={currentPage} />}
            content={
                <div className={cls.RoomsPage}>
                    <RoomsContainer connection={connection} rooms={rooms} />
                </div>
            }
            footer={<Footer />}
            title="Комнаты | Берсерк онлайн"
        />
    )
}
