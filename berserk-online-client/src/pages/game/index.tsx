import { useEffect, useState } from 'react'
import cls from './GamePage.module.scss'
import { Layout } from 'src/shared/layouts'
import { connect } from 'src/shared/api'
import { useParams } from 'react-router-dom'
import { HubConnection } from '@microsoft/signalr'
import { toast } from 'react-toastify'
import ReactLoading from 'react-loading'
import { GamePageContent } from 'src/widgets/gameContent'

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
            roomConnection.on('RoomUpdate', (message: IRoomEvent) => {
                console.log('PlayerJoined')
            })
            if (mode === 'spectate') {
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
                    {room && connection ? (
                        <GamePageContent connection={connection} room={room} />
                    ) : (
                        <ReactLoading
                            type={'bubbles'}
                            color={'#ffffff'}
                            height={100}
                            width={90}
                        />
                    )}
                </div>
            }
            title={
                room ? `Комната ${room.name} | Берсерк онлайн` : 'Загрузка...'
            }
        />
    )
}
