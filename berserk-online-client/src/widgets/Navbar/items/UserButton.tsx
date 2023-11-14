import { useState } from 'react'
import userChangeIcon from "src/shared/assets/images/user-change.png"
import exitIcon from "src/shared/assets/images/exit.svg"
import cls from "../Navbar.module.scss"
import { useAppDispatch, useAppSelector } from 'src/shared/lib/redux/redux-hook';
import { logoutUser } from 'src/app/store/slices/userSlice/userSlice';
import { Mode, setMode } from 'src/app/store/slices/modalSlice/modalSlice';

export const UserButton = () => {
    const dispatch = useAppDispatch()
    const { user } = useAppSelector(state => state.user)
    const [isMenuShowed, setIsMenuShowed] = useState<boolean>(false)

    const onExitClick = async () => {
        dispatch(logoutUser())
    }

    const onAccountEditClick = () => {
        dispatch(setMode({ mode: Mode.EDIT }))
        document.body.style.overflow = 'hidden';
    }

    const onMouseEnter = () => {
        setIsMenuShowed(true)
    }

    const onMouseLeave = () => {
        setIsMenuShowed(false)
    }

    return (
        <div
            className={cls.userButton}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div
                className={cls.userImageContainer}>
                <img
                    src={user.avatarUrl}
                    className={cls.userImage}
                />
            </div>
            <span
                className={cls.userName}>
                {user.name}
            </span>
            {isMenuShowed && <div
                className={cls.dropdownUserMenu}
            >
                <span
                    className={cls.dropdownAccount}
                    onClick={onAccountEditClick}
                >
                    <div
                        className={cls.userChangeIconContainer}
                    >
                        <img
                            src={userChangeIcon}
                            className={cls.userChangeIcon}
                        />
                    </div>
                    Аккаунт
                </span>
                <span
                    className={cls.dropdownExit}
                    onClick={onExitClick}
                >
                    <img
                        src={exitIcon}
                        className={cls.exitIcon}
                    /> Выйти
                </span>
            </div>
            }
        </div>
    );
}
