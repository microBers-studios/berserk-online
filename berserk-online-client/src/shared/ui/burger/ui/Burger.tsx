import cls from './Burger.module.scss'

interface BurgerProps {
    isBurgerClicked: boolean
    setIsBurgerClicked: (bool: boolean) => void
}

export const Burger = ({
    isBurgerClicked,
    setIsBurgerClicked,
}: BurgerProps) => {
    return (
        <>
            <div
                className={`${cls.burger} ${
                    isBurgerClicked && cls.burgerTapped
                }`}
                onClick={() => setIsBurgerClicked(!isBurgerClicked)}
            >
                <span className={cls.burgerLine}></span>
                <span className={cls.burgerLine}></span>
                <span className={cls.burgerLine}></span>
            </div>
            {isBurgerClicked && (
                <div
                    className={cls.layout}
                    onClick={() => setIsBurgerClicked(false)}
                ></div>
            )}
        </>
    )
}
