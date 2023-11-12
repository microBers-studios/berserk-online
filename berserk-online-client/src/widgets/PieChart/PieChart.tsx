import { Pie } from "react-chartjs-2";
import { Elements } from "src/app/store/utils/enums";
import { Chart, ArcElement, Tooltip, Legend, Title } from 'chart.js'
import { TooltipItem } from 'chart.js/auto';
Chart.register(ArcElement, Tooltip, Legend, Title);

interface PieChartProps {
    data: {
        labels: Elements[],
        datasets: {
            data: number[],
            backgroundColor: string[]
        }[]
    };
}

const PieChart = ({ data }: PieChartProps) => {
    const options = {
        plugins: {
            title: {
                display: true,
                text: 'Стихии',
                color: '#ffffff',
                font: {
                    size: 25,
                },
            },
            legend: {
                display: true,
                position: 'bottom' as const,
                backgroundColor: '#ffffff',
                labels: {
                    color: '#ffffff'
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context: TooltipItem<any>) {
                        let label = context.label || '';

                        if (context.parsed.y !== null) {
                            label += ': ' + context.parsed;
                        }

                        return label;
                    },
                },
            },
        },
    };
    return <div>
        <Pie
            data={data}
            options={options}
        />
    </div>

};

export default PieChart;