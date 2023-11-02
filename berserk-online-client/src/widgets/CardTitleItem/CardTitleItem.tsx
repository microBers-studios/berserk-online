import cls from "./CardTitleItem.module.scss"

interface CardTitleItemProps {
    cardSrc: string
}

export const CardTitleItem = ({ cardSrc }: CardTitleItemProps) => {
    return (
        <figure className={cls.CardTitleItem} >
            <div className={cls.CardImageWrapper}>
                <img
                    className={cls.CardImage}
                    src={cardSrc}
                />
            </div>

        </figure >
    );
}
