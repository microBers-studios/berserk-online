import { useEffect, useState } from 'react'
import cls from './GamePage.module.scss'
import { Layout } from 'src/shared/layouts'
import { connect } from 'src/shared/api'
import { useParams } from 'react-router-dom'
import { HubConnection } from '@microsoft/signalr'
import { toast } from 'react-toastify'

export const GamePage = () => {
    const { id, mode } = useParams()
    const [room, setRoom] = useState<RoomType | null>(null)
    const [connection, setConnection] = useState<HubConnection | null>(null)

    useEffect(() => {
        const roomConnection = connect(`/connect/${id}`)
        setConnection(roomConnection)

        roomConnection.start().then(() => {
            roomConnection.on('RoomInfo', setRoom)
            roomConnection.on('Error', (error) => toast(error.message))

            if (mode === 'spectator') {
                roomConnection.invoke('SwitchToSpectator')
            }
        })

        return () => {
            roomConnection.stop()
        }
    }, [setRoom])

    console.log(room)

    return (
        <Layout
            content={
                <div className={cls.GamePage}>
                    <span style={{ color: '#ffffff' }}>
                        {JSON.stringify(room)}
                    </span>
                </div>
            }
            title={
                room ? `Комната ${room.name} | Берсерк онлайн` : 'Загрузка...'
            }
        />
    )
}
