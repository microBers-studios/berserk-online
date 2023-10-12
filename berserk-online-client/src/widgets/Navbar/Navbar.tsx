import { useState } from "react";
import { Link } from "react-router-dom";
import { LoginModal } from "src/widgets/LoginModal/LoginModal";
import cls from "./Navbar.module.scss"
import { Burger } from "./Burger";

enum Paths {
    MAIN = '/',
    ROOMS = '/rooms',
    LOGIN = '/login'
}

export const Navbar = () => {
    const [current, setCurrent] = useState<Paths>(Paths.MAIN)
    const [isLogin, setIsLogin] = useState<boolean>(false)
    const [isBurgerClicked, setIsBurgerClicked] = useState<boolean>(false)

    const changeCurrent = (event: React.MouseEvent<HTMLElement>) => {
        const target: HTMLElement = event.currentTarget as HTMLElement
        const id = target.id
        setIsBurgerClicked(false)

        if (id !== current) {
            setCurrent(id === Paths.MAIN ? Paths.MAIN : Paths.ROOMS)
        }
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
                        to={Paths.MAIN}
                        id={Paths.MAIN}
                        onClick={changeCurrent}
                        className={`${cls.NavbarLink}`}
                    >
                        <span className={`${current === Paths.MAIN ? cls.active : ''}`}>Главная</span>
                    </Link>
                    <Link
                        to={Paths.ROOMS}
                        id={Paths.ROOMS}
                        onClick={changeCurrent}
                        className={`${cls.NavbarLink}`}
                    >
                        <span className={`${current === Paths.ROOMS ? cls.active : ''}`}>Комнаты</span>
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
