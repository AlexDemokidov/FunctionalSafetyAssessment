import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Divider } from 'antd';


const weibullPdf = (t, beta, eta) => {
    return (beta / eta) * Math.pow(t / eta, beta - 1) * Math.exp(-Math.pow(t / eta, beta));
};

function Chart(props) {

    let { inputData } = props;

    const beta1 = parseFloat(inputData[0].beta1);
    const eta1 = parseFloat(inputData[0].eta1);
    const beta2 = parseFloat(inputData[0].beta2);
    const eta2 = parseFloat(inputData[0].eta2);
    const lambda1 = parseFloat(inputData[0].lambda1);

    const generateData = () => {
        const data = [];
        const step = 200;
        const maxT = 5000;

        for (let t = 0; t <= maxT; t += step) {
            const point = { t };

            point[`Mode 1`] = weibullPdf(t, beta1, eta1);
            point[`Mode 2`] = weibullPdf(t, beta2, eta2);
            point[`Mixed Mode`] = lambda1 * weibullPdf(t, beta1, eta1) + (1 - lambda1) * weibullPdf(t, beta2, eta2);

            data.push(point);
        }

        return data;
    };

    const yAxisFormatter = (value) => {
        return value.toExponential(2);
    };

    const data = generateData();

    return (
        <div style={{ width: '100%', height: 500 }}>
            <Divider>Функция плотности распределения Вейбулла</Divider>
            <ResponsiveContainer>
                <LineChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 30,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="t"
                        label={{ value: 'Время (t)', position: 'insideBottomRight', offset: -10 }}
                    />
                    <YAxis
                        label={{ value: 'Плотность распределения', angle: -90, position: 'insideLeft', dx: -20, dy: 70 }}
                        tickFormatter={yAxisFormatter}
                    />
                    <Tooltip
                        formatter={(value) => Number(value).toExponential(4)}
                        labelFormatter={(t) => `Time: ${t}`}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey={`Mode 1`}
                        stroke="#ff8000"
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey={`Mode 2`}
                        stroke="#82ca9d"
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey={`Mixed Mode`}
                        stroke="#8884d8"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Chart;