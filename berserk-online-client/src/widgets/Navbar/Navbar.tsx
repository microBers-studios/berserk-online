import { Link } from "react-router-dom";
import cls from "./Navbar.module.scss"
import { useState } from "react";
import { LoginModal } from "../LoginModal/LoginModal";

enum Paths {
    MAIN = '/',
    ROOMS = '/rooms',
    LOGIN = '/login'
}

export const Navbar = () => {
    const [current, setCurrent] = useState<Paths>(Paths.MAIN)
    const [isLogin, setIsLogin] = useState<boolean>(false)

    const changeCurrent = (event: React.MouseEvent<HTMLElement>) => {
        const target: HTMLElement = event.currentTarget as HTMLElement
        const id = target.id
        console.log(target)

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

                <span
                    onClick={onLoginClick}
                    className={cls.login}
                >Войти</span>

            </div >
            {isLogin && <LoginModal setModal={setIsLogin} />}
        </>
    );
}
