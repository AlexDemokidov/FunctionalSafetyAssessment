import TableData from "./TableData";
import { Button } from 'antd';
import { Divider, Table } from 'antd';
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
const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
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
        console.log(estimationData)
    }

    return (
        <>
            <div className="flex flex-row justify-between m-5">
                <div className="container">
                    <div className="title">
                        <h1 className="number">Номер: {project.id} </h1>
                    </div>
                    <div className="title">
                        <h1 className="number">Проект: {project.name} </h1>
                    </div>
                    <div className="title">
                        <h3 className="number">Требуемый SIL: {project.sil}</h3>
                    </div>
                    <div className="title">
                        <h3>Вид анализа: </h3>
                        <h3 className="number">{project.analysis}</h3>
                    </div>
                </div>
                <TableData dataSource={project.project}></TableData>

            </div>
            <button className="close__button" onClick={props.closeProject}>
                <span className="sr">close</span>
            </button>
            <Button onClick={measureSIL}>Расчет</Button>
            {estimationData != null && <>
                <Divider>Параметры модели PDF</Divider>
                <Table columns={columns} dataSource={estimationData} size="small" />
            </>
            }
        </>
    )
}

export default Measure