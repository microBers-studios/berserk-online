import { Modal, ModalButton } from 'src/shared/ui'
import cls from './JoinRoomModal.module.scss'
import { RouterPaths, useAnimate } from 'src/shared/lib'
import { useNavigate } from 'react-router-dom'

interface JoinRoomModalProps {
    closeModal: () => void
    room: RoomType
}

export const JoinRoomModal = ({ closeModal, room }: JoinRoomModalProps) => {
    const {
        isOpenAnimation,
        setIsOpenAnimation,
        isCloseAnimation,
        setIsCloseAnimation,
    }: IAnimator = useAnimate()

    const navigate = useNavigate()

    const roomPlayers = room.players.filter((p) => p)

    const hideModal = () => {
        setIsCloseAnimation(true)
        setTimeout(closeModal, 300)
        document.body.style.overflow = ''
    }

    const joinRoom = async (role: 'play' | 'spectate') => {
        navigate(`${RouterPaths.ROOMS}/${room.id}/${role}`)
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
            <form
                className={cls.Form}
                onSubmit={(e: React.FormEvent) => e.preventDefault()}
            >
                <h2 className={cls.ModalHeader}>Зайти</h2>
                <div className={cls.RoomInfo}>
                    <h3 className={cls.RoomName}>{room.name}</h3>
                    <span className={cls.RoomParticipantsCount}>
                        {roomPlayers.length}/{room.players.length} игроков
                    </span>
                </div>

                <div className={cls.ModalButtonsWrapper}>
                    {room.players.filter((p) => p).length <
                        room.players.length && (
                        <ModalButton
                            text="Как игрок"
                            onButtonClick={() => joinRoom('play')}
                        />
                    )}
                    <ModalButton
                        text="Как наблюдатель"
                        onButtonClick={() => joinRoom('spectate')}
                    />
                </div>
            </form>
        </Modal>
    )
}
