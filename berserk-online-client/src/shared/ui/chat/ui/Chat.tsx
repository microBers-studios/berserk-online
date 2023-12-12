import { useState, useEffect, useRef, useMemo } from 'react'
import { HubConnection } from '@microsoft/signalr'
import cls from './Chat.module.scss'
import { ChatMessage } from './ChatMessage'
import { generateColor } from '../lib/generate-color'
import { ChatEventMessage } from './ChatEventMessage'
import { getChatMessages } from '../lib/get-chat-messages'
import { ScrollButton } from './ScrollButton'

interface ChatProps {
    room: RoomType
    connection: HubConnection
}

export const Chat = ({ room, connection }: ChatProps) => {
    const [messages, setMessages] = useState<(IMessage | IRoomEvent)[]>(
        getChatMessages(room)
    )
    const [isScrollButton, setIsScrollButton] = useState(false)
    console.log(messages)
    const [value, setValue] = useState<string>('')

    const usersColors = useMemo(
        () =>
            Object.fromEntries(
                room.players
                    .filter((p) => p)
                    .concat(room.spectators)
                    .map((user: UserType) => [user.id, generateColor()])
            ),
        [room.players.concat(room.spectators).length]
    )

    const wrapperRef = useRef<HTMLDivElement>(null)
    const messagesRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        connection.on('ChatEvent', (message: IMessage) => {
            console.log('changeMessagesArray', messages)
            setMessages((messages) => [...messages, message])
            setValue('')
        })

        connection.on('RoomUpdate', (message: IRoomEvent) => {
            setMessages((messages) => [...messages, message])
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
                    className={`${cls.ChatMessagesWrapper} ${
                        messagesRef.current &&
                        wrapperRef.current &&
                        parseInt(
                            window.getComputedStyle(messagesRef.current).height
                        ) >
                            parseInt(
                                window.getComputedStyle(wrapperRef.current)
                                    .height
                            ) &&
                        cls.reversedFlex
                    }`}
                    ref={wrapperRef}
                    onScroll={() =>
                        setIsScrollButton(
                            Boolean(
                                wrapperRef.current &&
                                    wrapperRef.current.scrollTop < -5
                            )
                        )
                    }
                >
                    <div className={cls.ChatMessages} ref={messagesRef}>
                        {messages.map(
                            (message: IMessage | IRoomEvent, i: number) =>
                                'initiator' in message ? (
                                    <ChatEventMessage
                                        key={message.id}
                                        event={message}
                                        colors={usersColors}
                                    />
                                ) : (
                                    <ChatMessage
                                        key={message.id}
                                        message={message}
                                        colors={usersColors}
                                        isFirstFromUser={
                                            i === 0 ||
                                            'initiator' in messages[i - 1] ||
                                            (!(
                                                'initiator' in messages[i - 1]
                                            ) &&
                                                (messages[i - 1] as IMessage)
                                                    .sender.id !==
                                                    message.sender.id)
                                        }
                                    />
                                )
                        )}
                    </div>
                    {messagesRef.current && isScrollButton && (
                        <ScrollButton container={messagesRef.current} />
                    )}
                </div>

                <div className={cls.SendMessageWrapper}>
                    <input
                        type="text"
                        value={value}
                        placeholder="Сообщение..."
                        className={cls.ChatInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setValue(e.target.value)
                        }
                        onKeyDown={(e: React.KeyboardEvent) => {
                            if (e.code === 'Enter') {
                                sendMessage()
                            }
                        }}
                    />
                    <button
                        className={cls.SendMessageButton}
                        onClick={sendMessage}
                    >
                        Отправить
                    </button>
                </div>
            </div>
        </div>
    )
}
