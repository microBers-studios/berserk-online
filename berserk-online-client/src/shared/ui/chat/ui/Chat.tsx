import { useState, useEffect, useRef, useMemo } from 'react'
import { HubConnection } from '@microsoft/signalr'
import cls from './Chat.module.scss'
import { ChatMessage } from './ChatMessage'
import { generateColor } from '../lib/generate-color'

interface ChatProps {
    room: RoomType
    connection: HubConnection
}

export const Chat = ({ room, connection }: ChatProps) => {
    const [messages, setMessages] = useState<IMessage[]>(room.chatMessages)
    const [value, setValue] = useState<string>('')


    const usersColors = useMemo(() =>
        Object.fromEntries(room.players.filter(p => p).concat(room.spectators).map((user: UserType) => [user.id, generateColor()]))
        , [room.players.concat(room.spectators).length])

    const wrapperRef = useRef<HTMLDivElement>(null)
    const messagesRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        connection.on('ChatEvent', (message: IMessage) => {
            console.log('changeMessagesArray')
            setMessages((messages) => [...messages, message])
            setValue('')
        })

        return () => connection.off('ChatEvent')
    }, [setMessages])

    const sendMessage = () => {
        if (value) {
            connection.invoke('SendChatMessage', value)
        }
    }

    return (
        <div className={cls.ChatWrapper}>
            <div className={cls.Chat}>
                <div
                    className={`${cls.ChatMessagesWrapper} ${messagesRef.current && wrapperRef.current && parseInt(window.getComputedStyle(messagesRef.current).height) > parseInt(window.getComputedStyle(wrapperRef.current).height) && cls.reversedFlex}`}
                    ref={wrapperRef}
                >
                    <div
                        className={cls.ChatMessages}
                        ref={messagesRef}
                    >
                        {messages.map((message: IMessage, i: number) => (
                            <ChatMessage
                                key={message.id}
                                message={message}
                                colors={usersColors}
                                isFirstFromUser={i === 0 || messages[i - 1].sender.id !== message.sender.id}
                            />
                        ))}
                    </div>
                </div>
                {/* <span style={{ color: 'white' }}>{JSON.stringify(messages)}</span> */}
                <div className={cls.SendMessageWrapper}>
                    <input
                        type="text"
                        value={value}
                        placeholder='Сообщение...'
                        className={cls.ChatInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                        onKeyDown={(e: React.KeyboardEvent) => {
                            if (e.code === 'Enter') {
                                sendMessage()
                            }
                        }}
                    />
                    <button
                        className={cls.SendMessageButton}
                        onClick={sendMessage}
                    >Send</button>
                </div>
            </div>
        </div>
    )
}
