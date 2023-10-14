import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LoginModal } from "src/widgets/LoginModal/LoginModal";
import cls from "./Navbar.module.scss"
import { Burger } from "./items/Burger";
import { RouterPaths } from "src/app/providers/router/router-paths";
import { IUser } from "src/app/providers/UserProvider/lib/types/types";
import { UserButton } from "./items/UserButton";

interface NavbarProps {
    currentPage: RouterPaths;
    user: IUser
}

export const Navbar = ({ currentPage, user }: NavbarProps) => {
    const [isLogin, setIsLogin] = useState<boolean>(false)
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
        setIsLogin(true)
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
                    ? <UserButton user={user} />
                    : <span
                        onClick={onLoginClick}
                        className={cls.login}
                    >Войти</span>
                }

            </div >
            {isLogin && <LoginModal setModal={setIsLogin} />}
        </>
    );
}
