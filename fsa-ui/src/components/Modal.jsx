import { useState } from "react";
import { Button, Form, Input, Select, Radio } from 'antd';
import TableData from "./TableData.jsx";
import axios from 'axios';
const { Option } = Select;


function Modal(props) {

    const [form] = Form.useForm(); // Хук формы Ant Design
    const [analysis, setAnalysis] = useState('Weibull');
    const [dataSource, setDataSource] = useState([
        {
            key: '1',
            name: 'Недостаточная емкость',
            time: '100',
            parameter1: '78',
            parameter2: '43',
            parameter3: '68'
        },
        {
            key: '2',
            name: 'Перегрев',
            time: '56',
            parameter1: '30',
            parameter2: '89',
            parameter3: '25',
        },
    ]);

    const createProject = async () => {
        const formValues = form.getFieldsValue();
        let data = {}
        if (analysis == 'Weibull') {
            data = {
                "project": dataSource,
                "name": formValues.projectName,
                "analysis": analysis,
                "sil": formValues.sil,
                "parameter1DirectlyProportional": formValues.parameter1DirectlyProportional,
                "parameter1Min": formValues.parameter1Min,
                "parameter1Max": formValues.parameter1Max,
                "parameter2DirectlyProportional": formValues.parameter2DirectlyProportional,
                "parameter2Min": formValues.parameter2Min,
                "parameter2Max": formValues.parameter2Max,
                "parameter3DirectlyProportional": formValues.parameter2DirectlyProportional,
                "parameter3Min": formValues.parameter3Min,
                "parameter3Max": formValues.parameter3Max,
            }

        }
        else {
            data = {
                "name": formValues.projectName,
                "analysis": analysis,
                "sil": formValues.sil
            }
        }
        console.log(data);
        try {
            const response = await axios.post(
                'http://localhost:8000/projects', data, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            }
            );
            console.log('Ответ сервера:', response.data);
            window.location.reload()
        } catch (error) {
            console.error('Ошибка запроса:', error.response?.data || error.message);
        }
    };

    const onChangeAnalysis = e => {
        setAnalysis(e.target.value);
    };

    return (
        <div className="modal" id="modal" style={props.modalStyle}>
            <div className="modal-backdrop"></div>
            <div className="modal-body">
                <button className="modal-close" id="close" onClick={props.closeModal}>
                    <span className="sr-only">close</span>
                </button>
                <h1 className="text-2xl m-5 justify-self-center">Создание нового проекта</h1>
                <Form className="flex flex-col" form={form}>
                    <Form.Item name="projectName" label="Название проекта" rules={[{ required: true }]}>
                        <Input placeholder="Введите название проекта" />
                    </Form.Item>
                    <Form.Item name="sil" label="Уровень полноты безопасности" rules={[{ required: true }]}>
                        <Select placeholder="Выберите SIL">
                            <Option value="1">1</Option>
                            <Option value="2">2</Option>
                            <Option value="3">3</Option>
                            <Option value="4">4</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item rules={[{ required: true }]}>
                        <Radio.Group
                            onChange={onChangeAnalysis}
                            value={analysis}
                            options={[
                                {
                                    value: 'Weibull',
                                    label: (
                                        <h1>Анализ Вейбулла</h1>
                                    ),
                                },
                                {
                                    value: 'Weibayes',
                                    label: (
                                        <h1>Анализ Вейбайеса</h1>
                                    ),
                                },
                            ]}
                        />
                    </Form.Item>
                    {analysis == 'Weibull' &&
                        <>
                            <Form.Item label="Данные по сроку службы и мониторингу" />
                            <TableData dataSource={dataSource} setDataSource={setDataSource}></TableData>
                        </>
                    }
                    <h3>Параметр 1</h3>
                    <Form.Item name="parameter1DirectlyProportional" rules={[{ required: true }]}>
                        <Select placeholder="Выберите влияние">
                            <Option value="true">Прямое</Option>
                            <Option value="false">Обратное</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="parameter1Min" label="Минимум" rules={[{ required: true }]}>
                        <Input placeholder="Введите минимальное значение" />
                    </Form.Item>
                    <Form.Item name="parameter1Max" label="Максимум" rules={[{ required: true }]}>
                        <Input placeholder="Введите максимальное значение" />
                    </Form.Item>
                    <h3>Параметр 2</h3>
                    <Form.Item name="parameter2DirectlyProportional" rules={[{ required: true }]}>
                        <Select placeholder="Выберите влияние">
                            <Option value="true">Прямое</Option>
                            <Option value="false">Обратное</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="parameter2Min" label="Минимум" rules={[{ required: true }]}>
                        <Input placeholder="Введите минимальное значение" />
                    </Form.Item>
                    <Form.Item name="parameter2Max" label="Минимум" rules={[{ required: true }]}>
                        <Input placeholder="Введите максимальное значение" />
                    </Form.Item>
                    <h3>Параметр 3</h3>
                    <Form.Item name="parameter3DirectlyProportional" rules={[{ required: true }]}>
                        <Select placeholder="Выберите влияние">
                            <Option value="true">Прямое</Option>
                            <Option value="false">Обратное</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="parameter3Min" label="Минимум" rules={[{ required: true }]}>
                        <Input placeholder="Введите минимальное значение" />
                    </Form.Item>
                    <Form.Item name="parameter3Max" label="Минимум" rules={[{ required: true }]}>
                        <Input placeholder="Введите максимальное значение" />
                    </Form.Item>
                    <Form.Item>
                        {/* <Button type="primary" onClick={props.createProject}>Создать проект</Button> */}
                        <Button type="primary" onClick={createProject}>Создать проект</Button>
                    </Form.Item>
                </Form>
            </div>
        </div >
    )
}

export default Modal;
