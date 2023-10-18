import { useState } from 'react'
import { IUser, UserContextProps } from "src/app/providers/UserProvider/lib/types/types";
import userChangeIcon from "src/shared/assets/images/user-change.png"
import exitIcon from "src/shared/assets/images/exit.svg"
import cls from "../Navbar.module.scss"
import { useRequiredContext } from 'src/helpers/hooks/useRequiredContext';
import { UserContext } from 'src/app/providers/UserProvider';
import { Modals } from '../Navbar';
import { defaultUser } from 'src/app/providers/UserProvider/lib/UserContextProvider';

interface UserButtonProps {
    user: IUser;
    setModal: (modal: false | Modals) => void
}

export const UserButton = ({ user, setModal }: UserButtonProps) => {
    const [isMenuShowed, setIsMenuShowed] = useState<boolean>(false)
    const { setUser } = useRequiredContext<UserContextProps>(UserContext)

    const onExitClick = () => setUser(defaultUser)

    const onAccountEditClick = () => {
        setModal(Modals.EDIT)
        document.body.style.overflow = 'hidden';
    }

    const onMouseEnter = () => {
        setIsMenuShowed(true)
    }

    const onMouseLeave = () => {
        setIsMenuShowed(false)
    }

    console.log(user)


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
