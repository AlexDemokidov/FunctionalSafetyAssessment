import TableData from "./TableData.jsx";
import Chart from "./Chart.jsx";
import { Breadcrumb, Divider, Table, Button, Popconfirm } from 'antd';
import { useState } from "react";

const columns = [
    {
        title: 'β1',
        dataIndex: 'beta1',
    },
    {
        title: 'η1',
        dataIndex: 'eta1',
    },
    {
        title: 'β2',
        dataIndex: 'beta2',
    },
    {
        title: 'η2',
        dataIndex: 'eta2',
    },
    {
        title: 'λ',
        dataIndex: 'lambda1',
    },
    {
        title: 'γ1',
        dataIndex: 'gamma1',
    },
    {
        title: 'γ2',
        dataIndex: 'gamma2',
    },
    {
        title: 'γ3',
        dataIndex: 'gamma3',
    }
];

function Measure(props) {

    let { project } = props;

    const [estimationData, setEstimationData] = useState(null);

    const measureSIL = () => {
        fetch(`http://localhost:8000/projects/${project.id}/measure`)
            .then(response => response.json())
            .then(
                (result) => {
                    setEstimationData([result]);
                },
                (error) => {
                    setError(error);
                }
            )
    }

    const deleteProject = () => {
        fetch(`http://localhost:8000/projects/${project.id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                window.location.reload()
            })
            .catch(error => {
                setError(error);
            });
    };

    return (
        <>
            <div className="flex">
                <div>
                    <p className="number">Номер: {project.id} </p>
                    <p className="number">Требуемый SIL: {project.sil}</p>
                    <p className="number">Вид анализа: {project.analysis}</p>
                    <div className="flex flex-row gap-5 mb-5">
                        <div>
                            <p class="mt-3 font-medium">Параметр 1</p>
                            <p className="number">Влияние: {project.parameter1DirectlyProportional == 'true' ? 'Прямое' : 'Обратное'}</p>
                            <p className="number">Минимальное значение: {project.parameter1Min}</p>
                            <p className="number">Максимальное значение: {project.parameter1Max}</p>
                        </div>
                        <div>
                            <p class="mt-3 font-medium">Параметр 2</p>
                            <p className="number">Влияние: {project.parameter2DirectlyProportional == 'true' ? 'Прямое' : 'Обратное'}</p>
                            <p className="number">Минимальное значение: {project.parameter2Min}</p>
                            <p className="number">Максимальное значение: {project.parameter2Max}</p>
                        </div>
                        <div>
                            <p class="mt-3 font-medium">Параметр 3</p>
                            <p className="number">Влияние: {project.parameter3DirectlyProportional == 'true' ? 'Прямое' : 'Обратное'}</p>
                            <p className="number">Минимальное значение: {project.parameter3Min}</p>
                            <p className="number">Максимальное значение: {project.parameter3Max}</p>
                        </div>
                    </div>
                    <TableData dataSource={project.project}></TableData>
                </div>
                <div className="w-200">
                    <div className="flex justify-end">
                        <Popconfirm
                            title="Вы уверены, что хотите удалить проект?"
                            onConfirm={deleteProject}
                            okText="Да"
                            cancelText="Нет"
                        >
                            <Button danger>Удалить проект</Button>
                        </Popconfirm>
                        {/* <Button onClick={deleteProject}>Удалить проект</Button> */}
                    </div>
                    <div className="flex flex-col items-center">
                        <img src="https://keenetic.ru/storage/uploads/2e607ea6-4459-4c6d-ac7f-b8ddc6bcb51d.png" ></img>
                        <p className="font-medium text-lg">Маршрутизатор</p>
                        <p className="font-medium text-lg">Keenetic Starter KN-1121</p>
                    </div>
                </div>
            </div >
            <Button onClick={measureSIL} className="mb-20">Расчет</Button>
            {/* <Button onClick={measureSIL}>Расчет</Button> */}
            {
                estimationData != null && <>
                    <Divider>Параметры модели PDF</Divider>
                    <Table columns={columns} dataSource={estimationData} size="small" />
                    <Divider>Результаты анализа</Divider>
                    <h3 className="number">Средняя наработка до отказа (MTTF): {estimationData[0].mttf} ч</h3>
                    <h3 className="number">Средняя частота опасных отказов (PFH): {estimationData[0].pfh} 1/ч</h3>
                    <h3 className="number">Уровень полноты безопасности (SIL): {estimationData[0].sil}</h3>
                    {estimationData[0].sil != project.sil ? <h3 className="text-red-500">Не соответствует требованиям функциональной безопасности</h3> : <h3 className="text-green-500">Cоответствует требованиям</h3>}

                    <Chart inputData={estimationData}></Chart>
                </>
            }
        </>
    )
}

export default Measure