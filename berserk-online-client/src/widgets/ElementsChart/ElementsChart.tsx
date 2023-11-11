import { Pie } from "react-chartjs-2";
import { Elements } from "src/API/utils/data";
import { IDeck } from "src/API/utils/types";
import { useAppSelector } from "src/helpers/hooks/redux-hook";

interface IElementsItem {
    element: Elements;
    count: number
}

export const ElementsChart = () => {
    const deck = useAppSelector(state => state.decks.currentDeck) as IDeck

    const elements: IElementsItem[] = deck.elements.map(e => ({ element: e, count: 0 }))

    deck.main.concat(deck.sideboard).forEach(card => {
        card.elements.forEach(e => {
            const elementIndex = elements.findIndex(i => i.element === e)

            if (elementIndex === -1) {
                elements.push({ element: e, count: 1 })
            } else {
                elements[elementIndex].count++
            }
        })
    })

    const data = {
        labels: ["October", "November", "December"],
        datasets: [{
            data: [8137119, 9431691, 10266674],
            label: "Infected People",
            backgroundColor: ["#2FDE00", "#00A6B4", "#ff6600"],
            hoverBackgroundColor: ["#175000", "#003350", "#993d00"]
        }]
    }

    return (
        <Pie
            width={130}
            height={50}
            options={{

            }}
            data={data}
        />
    );
}
