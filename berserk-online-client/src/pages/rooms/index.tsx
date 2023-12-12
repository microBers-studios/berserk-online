import { RouterPaths } from 'src/shared/lib'
import cls from './RoomsPage.module.scss'
import { useCallback, useEffect, useState } from 'react'
import { Layout } from 'src/shared/layouts'
import { Header } from 'src/widgets/header'
import { Footer } from 'src/widgets/footer'
import { RoomsContainer } from 'src/widgets/roomsContainer'
import { connect } from 'src/shared/api'
import { HubConnection } from '@microsoft/signalr'

interface RoomsPageProps {
    setPage: (page: RouterPaths | null) => void
    currentPage: RouterPaths | null
}

export const RoomsPage = ({ setPage, currentPage }: RoomsPageProps) => {
    const [rooms, setRooms] = useState<RoomType[] | null>(null)
    const [connection, setConnection] = useState<HubConnection | null>(null)
    const [isInvoking, setIsInvoking] = useState(false)

    const disconnect = useCallback(() => {
        setPage(null)
        if (!isInvoking) connection?.stop()
        setConnection(null)
    }, [isInvoking])

    useEffect(() => {
        setPage(RouterPaths.ROOMS)
        const roomsConnection = connect('/connect')
        setConnection(roomsConnection)

        roomsConnection.start().then(() => {
            roomsConnection.on('RoomsList', (roomsList: RoomType[]) => {
                setRooms(roomsList)
            })

            roomsConnection.on('RoomsListUpdate', (roomsList: RoomType[]) => {
                setRooms(roomsList)
            })
        })

        return disconnect
    }, [setPage])

    return (
        <Layout
            header={<Header currentPage={currentPage} />}
            content={
                <div className={cls.RoomsPage}>
                    <RoomsContainer
                        connection={connection}
                        rooms={rooms}
                        setIsInvoking={setIsInvoking}
                    />
                </div>
            }
            footer={<Footer />}
            title="Комнаты | Берсерк онлайн"
        />
    )
}
