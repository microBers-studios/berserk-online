import { useState } from 'react'
import { IUser, UserContextProps } from "src/app/providers/UserProvider/lib/types/types";
import defaultUserAvatar from "src/shared/assets/images/default-avatar.jpg"
import userChangeIcon from "src/shared/assets/images/user-change.png"
import exitIcon from "src/shared/assets/images/exit.svg"
import cls from "../Navbar.module.scss"
import { useRequiredContext } from 'src/helpers/hooks/useRequiredContext';
import { UserContext } from 'src/app/providers/UserProvider';

interface UserButtonProps {
    user: IUser
}

export const UserButton = ({ user }: UserButtonProps) => {
    const [isMenuShowed, setIsMenuShowed] = useState<boolean>(false)
    const { setUser } = useRequiredContext<UserContextProps>(UserContext)

    const onExitClick = () => setUser({
        id: -1,
        email: '',
        name: '',
        avatarUrl: ''
    })

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
                    src={defaultUserAvatar}
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
