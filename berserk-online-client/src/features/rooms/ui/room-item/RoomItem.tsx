import cls from './RoomItem.module.scss'

interface RoomItemProps {
    className?: string
}

export const RoomItem = () => {
    return <div className={cls.RoomItem}></div>
}
