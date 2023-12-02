import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import cls from './ProfilePill.module.scss'
import userChangeIcon from 'src/shared/assets/images/user-change.png'
import exitIcon from 'src/shared/assets/images/exit.svg'
import { RouterPaths, useAppDispatch, useAppSelector } from 'src/shared/lib'
import { logoutUser } from 'src/entities/user'

interface ProfilePillProps {
    openEditModal: () => void
}
export const ProfilePill = ({ openEditModal }: ProfilePillProps) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { user } = useAppSelector((state) => state.user)
    const [isMenuShowed, setIsMenuShowed] = useState<boolean>(false)

    const onExitClick = async () => {
        dispatch(logoutUser())
        navigate(RouterPaths.MAIN)
    }

    const onAccountEditClick = () => {
        openEditModal()
        document.body.style.overflow = 'hidden'
    }

    const onMouseEnter = () => {
        setIsMenuShowed(true)
    }

    const onMouseLeave = () => {
        setIsMenuShowed(false)
    }

    return (
        <div
            className={cls.ProfilePill}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className={cls.userImageContainer}>
                <img src={user.avatarUrl} className={cls.userImage} />
            </div>
            <span className={cls.userName}>{user.name}</span>
            {isMenuShowed && (
                <div className={cls.dropdownUserMenu}>
                    <span
                        className={cls.dropdownAccount}
                        onClick={onAccountEditClick}
                    >
                        <div className={cls.userChangeIconContainer}>
                            <img
                                src={userChangeIcon}
                                className={cls.userChangeIcon}
                            />
                        </div>
                        Аккаунт
                    </span>
                    <span className={cls.dropdownExit} onClick={onExitClick}>
                        <img src={exitIcon} className={cls.exitIcon} /> Выйти
                    </span>
                </div>
            )}
        </div>
    )
}
