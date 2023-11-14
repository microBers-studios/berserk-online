import { useState } from "react";
import { Link } from "react-router-dom";
import ReactLoading from "react-loading";
import cls from "./Navbar.module.scss";
import { Burger } from "./items/Burger";
import { RouterPaths } from "src/app/providers/router/router-paths";
import { UserButton } from "./items/UserButton";
import { useAppDispatch, useAppSelector } from "src/shared/lib/redux/redux-hook";
import { deleteAvatarStatusSelector, getUserStatusSelector, loadAvatarStatusSelector, loginUserStatusSelector, registrateUserStatusSelector, updateUserStatusSelector } from "src/app/store/slices/userSlice/selectors";
import { Mode, setMode } from "src/app/store/slices/modalSlice/modalSlice";

interface NavbarProps {
    currentPage: RouterPaths | null;
}

export const Navbar = ({ currentPage }: NavbarProps) => {
    const dispatch = useAppDispatch()
    const [isBurgerClicked, setIsBurgerClicked] = useState<boolean>(false)
    const { user } = useAppSelector(state => state.user)

    const getUserStatus = useAppSelector(getUserStatusSelector)
    const updateUserStatus = useAppSelector(updateUserStatusSelector)
    const loadAvatarStatus = useAppSelector(loadAvatarStatusSelector)
    const deleteAvatarStatus = useAppSelector(deleteAvatarStatusSelector)
    const loginUserStatus = useAppSelector(loginUserStatusSelector)
    const registrateUserStatus = useAppSelector(registrateUserStatusSelector)

    const onLinkClick = () => {
        if (!getUserStatus.isPending) {
            setIsBurgerClicked(false)
        }
    }

    const onLoginClick = () => {
        if (!getUserStatus.isPending) {
            dispatch(setMode({ mode: Mode.LOGIN }))
            document.body.style.overflow = 'hidden';
        }
    }

    const onRegistrationClick = () => {
        if (!getUserStatus.isPending) {
            dispatch(setMode({ mode: Mode.REGISTRATION }))
            document.body.style.overflow = 'hidden';
        }
    }

    return (
        <>
            <header className={cls.Navbar}>
                <Burger
                    isBurgerClicked={isBurgerClicked}
                    setIsBurgerClicked={setIsBurgerClicked}
                />
                <nav className={`${cls.NavbarMenu} ${isBurgerClicked && cls.opened}`}>
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
                </nav>

                {getUserStatus.isPending
                    || updateUserStatus.isPending
                    || loadAvatarStatus.isPending
                    || deleteAvatarStatus.isPending
                    || loginUserStatus.isPending
                    || registrateUserStatus.isPending
                    ? <ReactLoading type={'bubbles'} color={'#ffffff'} height={100} width={90} />
                    : user.id
                        ? <UserButton />
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

            </header>
            {/* {(modal === Modals.COOKIE || isCookieModal) &&
                <CookieModal
                    modal={modal}
                    setModal={changeModal}
                />
            } */}
        </>
    );
}
