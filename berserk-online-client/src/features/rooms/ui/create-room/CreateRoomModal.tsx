import { useState } from 'react'
import { Modal, ModalButton, TextInput } from 'src/shared/ui'
import cls from './CreateRoomModal.module.scss'
import { RouterPaths, useAnimate } from 'src/shared/lib'
import { HubConnection } from '@microsoft/signalr'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

interface CreateRoomModalProps {
    closeModal: () => void
    connection: HubConnection | null
    setIsInvoking: (b: boolean) => void
}

export const CreateRoomModal = ({
    closeModal,
    connection,
    setIsInvoking,
}: CreateRoomModalProps) => {
    const navigate = useNavigate()

    const [name, setName] = useState<string>('')
    const {
        isOpenAnimation,
        setIsOpenAnimation,
        isCloseAnimation,
        setIsCloseAnimation,
    }: IAnimator = useAnimate()

    const hideModal = () => {
        setIsCloseAnimation(true)
        setTimeout(closeModal, 300)
        document.body.style.overflow = ''
    }

    const createRoom = async (e: React.FormEvent) => {
        e.preventDefault()

        if (connection) {
            connection.on('RoomInfo', async (room: RoomType) => {
                navigate(`${RouterPaths.ROOMS}/${room.id}/play`)
            })

            setIsInvoking(true)
            await connection.invoke('Create', name)
        } else {
            toast('Соединение прервано')
        }

        hideModal()
    }

    return (
        <Modal
            isOpenAnimation={isOpenAnimation}
            setIsOpenAnimation={setIsOpenAnimation}
            isCloseAnimation={isCloseAnimation}
            setIsCloseAnimation={setIsCloseAnimation}
            closeModal={hideModal}
            modalClass={cls.modal}
        >
            <form className={cls.Form} onSubmit={createRoom}>
                <h2 className={cls.ModalHeader}>Создание комнаты</h2>
                <TextInput
                    title="Введите имя комнаты:"
                    value={name}
                    setValue={setName}
                />

                <ModalButton text="Создать" />
            </form>
        </Modal>
    )
}
