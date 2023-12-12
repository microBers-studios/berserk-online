import { IDeck } from 'src/app/store/utils/types'

interface IPrice {
    price: number
    elite: number
    ordinary: number
}

export const getPricesChartData = (deck: IDeck) => {
    const prices: IPrice[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((p) => ({
        price: p,
        elite: 0,
        ordinary: 0,
    }))

    deck.main.forEach((card) => {
        const priceObj = prices.find((p) => p.price === card.price)
        if (!priceObj) {
            prices.push({
                price: card.price,
                elite: card.elite ? card.amount : 0,
                ordinary: card.elite ? 0 : card.amount,
            })
        } else {
            card.elite
                ? (priceObj.elite += card.amount)
                : (priceObj.ordinary += card.amount)
        }
    })

    const elitePricesData = {
        label: 'Элитные',
        data: prices.map((p) => p.elite),
        backgroundColor: 'gold',
        borderColor: 'rgba(0, 99, 132, 1)',
    }

    const ordinaryPricesData = {
        label: 'Рядовые',
        data: prices.map((p) => p.ordinary),
        backgroundColor: 'silver',
        borderColor: 'rgba(99, 132, 0, 1)',
    }
    const pricesData = {
        labels: prices.map((p) => p.price).sort((a, b) => a - b),
        datasets: [elitePricesData, ordinaryPricesData],
    }

    return pricesData
}
