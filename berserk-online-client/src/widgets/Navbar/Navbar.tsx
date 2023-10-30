import { useState } from "react";
import { Link } from "react-router-dom";
import { LoginModal } from "src/widgets/AccountModals/LoginModal/LoginModal";
import cls from "./Navbar.module.scss"
import { Burger } from "./items/Burger";
import { RouterPaths } from "src/app/providers/router/router-paths";
import { IUser } from "src/app/providers/UserProvider/lib/types/types";
import { UserButton } from "./items/UserButton";
import { AccountEditModal } from "src/widgets/AccountModals/AccountEditModal/AccountEditModal";
import { EmailModal } from "../AccountModals/EmailModal/EmailModal";
import { CloseModal } from "../AccountModals/CloseModal/CloseModal";
import { CookieModal } from "../AccountModals/CookieModal/CookieModal";
import { defaultUser } from "src/app/providers/UserProvider/lib/UserContextProvider";
import { useRequiredContext } from "src/helpers/hooks/useRequiredContext";
import { CookieModalContext, CookieModalContextProps } from "src/app/providers/CookieModalProvider/lib/CookieModalContext";

interface NavbarProps {
    currentPage: RouterPaths;
    user: IUser;
}

export enum Modals {
    LOGIN = 'login',
    REGISTRATION = 'registration',
    EDIT = 'account',
    EMAIL = 'reset-email',
    CLOSE = 'close',
    COOKIE = 'cookie'
}

export const Navbar = ({ currentPage, user }: NavbarProps) => {
    const [modal, setModal] = useState<false | Modals>(false)
    const [modalProps, setModalProps] = useState<object | null>(null)
    const [isBurgerClicked, setIsBurgerClicked] = useState<boolean>(false)

    const { isCookieModal } = useRequiredContext<CookieModalContextProps>(CookieModalContext)

    const changeModal = (modal: false | Modals, extra: object | null = null) => {
        setModal(modal)
        setModalProps(extra)
    }

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

                {user !== defaultUser
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
            {(modal === Modals.LOGIN || modal === Modals.REGISTRATION) &&
                <LoginModal
                    setModal={changeModal}
                    defaultModal={modal}
                />}

            {modal === Modals.EDIT &&
                <AccountEditModal
                    setModal={changeModal}
                />}

            {modal === Modals.EMAIL &&
                <EmailModal
                    setModal={changeModal}
                />}

            {modal === Modals.CLOSE &&
                <CloseModal
                    setModal={changeModal}
                    emailObject={modalProps as { email: string }}
                />
            }
            {(modal === Modals.COOKIE || isCookieModal) &&
                <CookieModal
                    modal={modal}
                    setModal={changeModal}
                />
            }
        </>
    );
}
