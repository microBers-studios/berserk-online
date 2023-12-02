import cls from './DeckStatistics.module.scss'
import { ElementsPieChart, PricesBarChart } from 'src/shared/ui'
import { getElementsChartData, getPricesChartData } from 'src/shared/lib'

interface DeckStatisticsProps {
    deck: DeckType
}

export const DeckStatistics = ({ deck }: DeckStatisticsProps) => {
    return (
        <div className={cls.DeckStatistics}>
            <h2 className={cls.DeckStatisticsHeader}>Статистика</h2>
            <div className={cls.ChartsWrapper}>
                <ElementsPieChart
                    data={getElementsChartData(deck as DeckType)}
                />
                <PricesBarChart data={getPricesChartData(deck as DeckType)} />
            </div>
        </div>
    )
}
