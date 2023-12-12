import cls from './Chat.module.scss'

interface ChatMessageProps {
    message: IMessage
    isFirstFromUser: boolean
    colors: Record<string, string>
}

export const ChatMessage = ({
    message,
    isFirstFromUser,
    colors,
}: ChatMessageProps) => {
    return (
        <div
            className={cls.ChatMessage}
            style={{ borderLeft: `3px solid ${colors[message.sender.id]}` }}
        >
            {isFirstFromUser && (
                <span
                    className={cls.ChatMessageUserName}
                    style={{ color: colors[message.sender.id] }}
                >
                    {message.sender.name}
                </span>
            )}
            <p className={cls.MessageContent}>{message.content}</p>
            <span className={cls.MessageTime}>
                {message.timeStamp.split(':').slice(0, 2).join(':')}
            </span>
        </div>
    )
}
