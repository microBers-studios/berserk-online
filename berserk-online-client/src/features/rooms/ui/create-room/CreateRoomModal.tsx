import { useState } from 'react'
import { Modal, ModalButton, TextInput } from 'src/shared/ui'
import cls from './CreateRoomModal.module.scss'
import { useAnimate } from 'src/shared/lib'
import { signalRConnection } from 'src/shared/api'

interface CreateRoomModalProps {
    closeModal: () => void
}

export const CreateRoomModal = ({ closeModal }: CreateRoomModalProps) => {
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
        await signalRConnection.invoke('Create', name)
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
