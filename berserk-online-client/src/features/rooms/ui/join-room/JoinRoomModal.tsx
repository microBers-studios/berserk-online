import { Modal, ModalButton } from "src/shared/ui";
import cls from "./JoinRoomModal.module.scss"
import { useAnimate } from "src/shared/lib";

interface JoinRoomModalProps {
    closeModal: () => void;
    room: RoomType;
}

export const JoinRoomModal = ({closeModal, room}: JoinRoomModalProps) => {
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

    const joinRoom = (role: 'player' | 'spectator') => {

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
            <form className={cls.Form} onSubmit={(e: React.FormEvent) => e.preventDefault()}>
                <h2 className={cls.ModalHeader}>Зайти</h2>
                
                {room.players.filter(p => p).length < room.players.length && <ModalButton text="Как игрок" onButtonClick={() => joinRoom('player')} />}
                <ModalButton text="Как наблюдатель" onButtonClick={() => joinRoom('spectator')} />
            </form>
        </Modal>
    );
}
