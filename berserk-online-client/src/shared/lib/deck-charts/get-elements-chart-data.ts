import { Elements } from 'src/shared/lib/cards'
import { IDeck } from 'src/app/store/utils/types'

interface IElementsItem {
    element: Elements
    count: number
}

const colors: Record<Elements, string> = {
    [Elements.PLAINS]: '#ffaf4f',
    [Elements.FORESTS]: '#02a724',
    [Elements.MOUNTAINS]: '#6ba7cc',
    [Elements.SWAMPS]: '#748500',
    [Elements.DARKNESS]: '#710193',
    [Elements.NEUTRAL]: '#d30000',
}

export const getElementsChartData = (deck: IDeck) => {
    const elements: IElementsItem[] = deck.elements.map((e) => ({
        element: e,
        count: 0,
    }))

    deck.main.forEach((card) => {
        card.elements.forEach((e) => {
            const elementIndex = elements.findIndex((i) => i.element === e)

            if (elementIndex === -1) {
                elements.push({
                    element: e,
                    count: card.amount,
                })
            } else {
                elements[elementIndex].count += card.amount
            }
        })
    })

    const labels = elements.map((i) => i.element)
    const counts = elements.map((i) => i.count)
    const colorsArr = labels.map((e) => colors[e])

    return {
        labels,
        datasets: [
            {
                data: counts,
                backgroundColor: colorsArr,
            },
        ],
    }
}
