import { Elements } from "src/API/utils/data";
import { IDeck } from "src/API/utils/types";

interface IElementsItem {
    element: Elements;
    count: number
}

const colors: Record<Elements, string> = {
    [Elements.PLAINS]: '#ffaf4f',
    [Elements.FORESTS]: '#02a724',
    [Elements.MOUNTAINS]: '#6ba7cc',
    [Elements.SWAMPS]: '#748500',
    [Elements.DARKNESS]: '#710193',
    [Elements.NEUTRAL]: '#d30000'
}

export const getElementsChartData = (deck: IDeck) => {
    const elements: IElementsItem[] = deck.elements.map(e => ({ element: e, count: 0 }))

    deck.main.forEach(card => {
        card.elements.forEach(e => {
            const elementIndex = elements.findIndex(i => i.element === e)

            if (elementIndex === -1) {
                elements.push({ element: e, count: card.amount })
            } else {
                elements[elementIndex].count += card.amount
            }
        })
    })

    const labels = elements.map(i => i.element)
    const counts = elements.map(i => i.count)
    const colorsArr = labels.map(e => colors[e])

    return {
        labels,
        datasets: [
            {
                data: counts,
                backgroundColor: colorsArr,
            }
        ]
    }
}

interface IPrice {
    price: number;
    elite: number;
    ordinary: number;
}

export const getPricesChartData = (deck: IDeck) => {
    const prices: IPrice[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(p => ({
        price: p,
        elite: 0,
        ordinary: 0
    }))

    deck.main.forEach((card) => {
        const priceObj = prices.find(p => p.price === card.price)
        if (!priceObj) {
            prices.push({
                price: card.price,
                elite: card.elite ? card.amount : 0,
                ordinary: card.elite ? 0 : card.amount
            })
        } else {
            card.elite
                ? priceObj.elite += card.amount
                : priceObj.ordinary += card.amount
        }
    })

    const elitePricesData = {
        label: 'Элитные',
        data: prices.map(p => p.elite),
        backgroundColor: 'gold',
        borderColor: 'rgba(0, 99, 132, 1)',
    };

    const ordinaryPricesData = {
        label: 'Рядовые',
        data: prices.map(p => p.ordinary),
        backgroundColor: 'silver',
        borderColor: 'rgba(99, 132, 0, 1)',
    };
    const pricesData = {
        labels: prices.map(p => p.price).sort((a, b) => a - b),
        datasets: [elitePricesData, ordinaryPricesData]
    };

    return pricesData
}