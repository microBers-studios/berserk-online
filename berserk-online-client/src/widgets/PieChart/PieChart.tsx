import { Pie } from "react-chartjs-2";
import { Elements } from "src/API/utils/data";
import { Chart, ArcElement } from 'chart.js'
import { TooltipItem } from 'chart.js/auto';
Chart.register(ArcElement);

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
                text: 'My Awesome Pie Chart'
            },
            legend: {
                display: true,
                position: 'bottom' as const,
            },
            tooltip: {
                callbacks: {
                    label: function (context: TooltipItem<any>) {
                        let label = context.label || '';

                        if (context.parsed.y !== null) {
                            label += ': ' + context.parsed.y;
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
        />;
    </div>

};

export default PieChart;