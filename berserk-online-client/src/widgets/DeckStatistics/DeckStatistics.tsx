import { IDeck } from "src/API/utils/types";
import cls from "./DeckStatistics.module.scss"
import PieChart from "../PieChart/PieChart";
import BarChart from "../BarChart/BarChart";
import { getElementsChartData, getPricesChartData } from "src/helpers/getChartData";

interface DeckStatisticsProps {
    deck: IDeck;
}

export const DeckStatistics = ({ deck }: DeckStatisticsProps) => {
    return (
        <div className={cls.DeckStatistics}>
            <h2
                className={cls.DeckStatisticsHeader}
            >Статистика</h2>
            <div className={cls.ChartsWrapper}>
                <PieChart data={getElementsChartData(deck as IDeck)} />
                <BarChart data={getPricesChartData(deck as IDeck)} />
            </div>
        </div>
    );
}
