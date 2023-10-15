import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LoginModal } from "src/widgets/AccountModals/LoginModal/LoginModal";
import cls from "./Navbar.module.scss"
import { Burger } from "./items/Burger";
import { RouterPaths } from "src/app/providers/router/router-paths";
import { IUser } from "src/app/providers/UserProvider/lib/types/types";
import { UserButton } from "./items/UserButton";
import { AccountEditModal } from "src/widgets/AccountModals/AccountEditModal/AccountEditModal";

interface NavbarProps {
    currentPage: RouterPaths;
    user: IUser
}

export enum Modals {
    LOGIN = 'login',
    REGISTRATION = 'registration',
    EDIT = 'account'
}

export const Navbar = ({ currentPage, user }: NavbarProps) => {
    const [modal, setModal] = useState<false | Modals>(false)
    const [isBurgerClicked, setIsBurgerClicked] = useState<boolean>(false)
    const [isUser, setIsUser] = useState<boolean>(false)

    useEffect(() => {
        console.log(user.id !== -1)
        setIsUser(user.id !== -1)
    },
        [user])

    const onLinkClick = () => {
        setIsBurgerClicked(false)
    }

    const onLoginClick = () => {
        setModal(Modals.LOGIN)
        document.body.style.overflow = 'hidden';
    }

    const onRegistrationClick = () => {
        setModal(Modals.REGISTRATION)
        document.body.style.overflow = 'hidden';
    }

    return (
        <>
            <div className={cls.Navbar}>
                <Burger
                    isBurgerClicked={isBurgerClicked}
                    setIsBurgerClicked={setIsBurgerClicked}
                />
                <div className={`${cls.NavbarMenu} ${isBurgerClicked && cls.opened}`}>
                    <Link
                        to={RouterPaths.MAIN}
                        onClick={onLinkClick}
                        className={`${cls.NavbarLink}`}
                    >
                        <span className={`${currentPage === RouterPaths.MAIN ? cls.active : ''}`}>Главная</span>
                    </Link>
                    <Link
                        to={RouterPaths.ROOMS}
                        onClick={onLinkClick}
                        className={`${cls.NavbarLink}`}
                    >
                        <span className={`${currentPage === RouterPaths.ROOMS ? cls.active : ''}`}>Комнаты</span>
                    </Link>
                </div>

                {isUser
                    ? <UserButton
                        setModal={setModal}
                        user={user}
                    />
                    : <div
                        className={cls.NavbarLoginButtons}
                    >
                        <span
                            onClick={onLoginClick}
                            className={cls.login}
                        >Войти</span>
                        <span
                            onClick={onRegistrationClick}
                            className={cls.registration}
                        >Зарегистрироваться</span>
                    </div>
                }

            </div >
            {modal === Modals.LOGIN &&
                <LoginModal
                    setModal={setModal}
                    defaultModal={modal}
                />}
            {modal === Modals.REGISTRATION &&
                <LoginModal
                    setModal={setModal}
                    defaultModal={modal}
                />}
            {modal === Modals.EDIT &&
                <AccountEditModal
                    setModal={setModal}
                />}
        </>
    );
}
