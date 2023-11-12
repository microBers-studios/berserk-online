import { IDeck } from "src/app/store/utils/types";
import cls from "./DeckConstructor.module.scss"
import { CardItem } from "src/pages/DeckPage/CardItem/CardItem";

interface DeckConstructorProps {
    deck: IDeck | null;
    isSaveDisabled: boolean;
    setIsSaveDisabled: (b: boolean) => void;
}

export const DeckConstructor = ({ deck, isSaveDisabled, setIsSaveDisabled }: DeckConstructorProps) => {
    const ordinaryCards = deck?.main
        .filter(c => !c.elite)

    const eliteCards = deck?.main
        .filter(c => c.elite)


    return (
        <div className={cls.DeckConstructor}>
            <div
                className={cls.CardsContainer}
            >
                <div
                    className={cls.EliteCardsContainer}
                >
                    <h2
                        className={cls.EliteCardsHeader}
                    >Элитные карты ({eliteCards?.reduce((acc, curr) => acc + curr.amount, 0)})</h2>

                    <ul
                        className={cls.CardsWrapper}
                    >
                        {eliteCards && eliteCards.length
                            ? eliteCards.map(card =>
                                <CardItem
                                    key={card.id}
                                    card={card}
                                    isSaveDisabled={isSaveDisabled}
                                    setIsSaveDisabled={setIsSaveDisabled}
                                />)
                            : <span
                                className={cls.NoCardsText}>Карт нет</span>}
                    </ul>
                </div>
                <div
                    className={cls.OrdinaryCardsContainer}
                >
                    <h2
                        className={cls.OrdinaryCardsHeader}
                    >Рядовые карты ({ordinaryCards?.reduce((acc, curr) => acc + curr.amount, 0)})</h2>

                    <ul
                        className={cls.CardsWrapper}
                    >
                        {ordinaryCards && ordinaryCards.length
                            ? ordinaryCards.map(card =>
                                <CardItem
                                    key={card.id}
                                    card={card}
                                    isSaveDisabled={isSaveDisabled}
                                    setIsSaveDisabled={setIsSaveDisabled}
                                />)
                            : <span
                                className={cls.NoCardsText}>Карт нет</span>}
                    </ul>
                </div>
            </div>
        </div>
    );
}
