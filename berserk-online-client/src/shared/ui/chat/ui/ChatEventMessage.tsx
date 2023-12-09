import cls from './Chat.module.scss'

interface ChatEventMessageProps {
    event: IRoomEvent
    colors: Record<string, string>
}

export const ChatEventMessage = ({ event, colors }: ChatEventMessageProps) => {
    return (
        <div
            className={cls.ChatMessage}
            style={{ borderLeft: `3px solid ${colors[event.initiator.id]}` }}
        >
            <p className={cls.MessageContent}>
                {event.type === 'PlayerJoined' && (
                    <>
                        Игрок{' '}
                        <span
                            style={{
                                color: colors[event.initiator.id],
                                fontWeight: 'bold',
                            }}
                        >
                            {event.initiator.name}
                        </span>{' '}
                        присоединился к игре.
                    </>
                )}
                {event.type === 'PlayerLeaved' && (
                    <>
                        Игрок{' '}
                        <span
                            style={{
                                color: colors[event.initiator.id],
                                fontWeight: 'bold',
                            }}
                        >
                            {event.initiator.name}
                        </span>{' '}
                        покинул комнату.
                    </>
                )}
            </p>
            <span className={cls.MessageTime}>
                {event.timeStamp.split(':').slice(0, 2).join(':')}
            </span>
        </div>
    )
}
