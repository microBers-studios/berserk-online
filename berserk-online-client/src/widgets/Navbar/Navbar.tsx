import { useState } from "react";
import { Link } from "react-router-dom";
import { LoginModal } from "src/widgets/LoginModal/LoginModal";
import cls from "./Navbar.module.scss"
import { Burger } from "./Burger";
import { RouterPaths } from "src/app/providers/router/router-paths";

interface NavbarProps {
    currentPage: RouterPaths;
}

export const Navbar = ({ currentPage }: NavbarProps) => {
    const [isLogin, setIsLogin] = useState<boolean>(false)
    const [isBurgerClicked, setIsBurgerClicked] = useState<boolean>(false)

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

                <span
                    onClick={onLoginClick}
                    className={cls.login}
                >Войти</span>

            </div >
            {isLogin && <LoginModal setModal={setIsLogin} />}
        </>
    );
}
