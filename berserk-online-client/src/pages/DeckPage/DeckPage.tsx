import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import cls from "./DeckPage.module.scss"
import { IDeck } from 'src/API/utils/types';
import { useAlert } from 'src/helpers/hooks/useAlert';
import ReactLoading from 'react-loading';
import APIController from 'src/API/Controller';
import { CardItem } from './CardItem/CardItem';

export const DeckPage = () => {
    const setAlert = useAlert()
    const navigate = useNavigate()

    const { id } = useParams()

    if (id === undefined) {
        setAlert('error')
    }

    const [deck, setDeck] = useState<IDeck | null>(null)

    const ordinaryCards = deck?.cards
        .filter(c => !c.elite)

    const eliteCards = deck?.cards
        .filter(c => c.elite)

    useEffect(() => {
        new Promise(async () => {
            const { code, obj } = await APIController.getDeck(Number(id))

            if (code === 200) {
                setDeck(obj as IDeck)
            }

            if (code === 404) {
                navigate('/error')
            }
        })
    }, [])

    return (<div className={cls.DeckPage} >
        {!deck
            ? <ReactLoading type={'bubbles'} color={'#ffffff'} height={100} width={90} />
            : <>
                <h1
                    className={cls.DeckPageHeader}
                >{deck.name}</h1>
                <div
                    className={cls.CardsContainer}
                >
                    <div
                        className={cls.OrdinaryCardsContainer}
                    >
                        <h2
                            className={cls.OrdinaryCardsHeader}
                        >Рядовые карты ({ordinaryCards?.reduce((acc, curr) => acc + curr.amount, 0)})</h2>

                        <ul
                            className={cls.CardsWrapper}
                        >
                            {ordinaryCards && ordinaryCards.map(card =>
                                <CardItem key={card.id} card={card} />)}
                        </ul>
                    </div>
                    <div
                        className={cls.EliteCardsContainer}
                    >
                        <h2
                            className={cls.EliteCardsHeader}
                        >Элитные карты ({eliteCards?.reduce((acc, curr) => acc + curr.amount, 0)})</h2>

                        <ul
                            className={cls.CardsWrapper}
                        >
                            {eliteCards && eliteCards.map(card =>
                                <CardItem key={card.id} card={card} />)}
                        </ul>
                    </div>

                </div>
            </>
        }
    </div >
    );
}
