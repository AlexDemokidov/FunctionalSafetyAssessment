import { useState } from "react";
import { Button, Form, Input, Select, Radio } from 'antd';
import TableData from "./TableData.jsx";
const { Option } = Select;


function Modal(props) {

    function test() {
        console.log(dataSource)
    }

    const [dataSource, setDataSource] = useState([
        {
            key: '1',
            name: 'Недостаточная емкость',
            age: '100',
            parameter1: '78',
            parameter2: '43'
        },
        {
            key: '2',
            name: 'Перегрев',
            age: '56',
            parameter1: '30',
            parameter2: '89'
        },
    ]);

    const fileReader = new FileReader();

    const [value, setValue] = useState('Weibull');
    const onChange = e => {
        setValue(e.target.value);
    };

    fileReader.onloadend = () => {
        props.setFileText(fileReader.result)
    }

    const handleOnChange = event => {
        event.preventDefault();
        console.log("change", event.target.files);
        let newProject = event.target.files[0];
        fileReader.readAsText(newProject);
    }

    return (
        <div className="modal" id="modal" style={props.modalStyle}>
            <div className="modal-backdrop"></div>
            <div className="modal-body">
                <button className="modal-close" id="close" onClick={props.closeModal}>
                    <span className="sr-only">close</span>
                </button>
                <h1 className="text-2xl m-5 justify-self-center">Создание нового проекта</h1>
                <Form className="flex flex-col">
                    <Form.Item name="projectName" label="Название проекта" rules={[{ required: true }]}>
                        <Input placeholder="Введите название проекта" />
                    </Form.Item>
                    <Form.Item name="sil" label="Уровень полноты безопасности" rules={[{ required: true }]}>
                        <Select
                            placeholder="Выберите SIL"
                        >
                            <Option value="1">1</Option>
                            <Option value="2">2</Option>
                            <Option value="3">3</Option>
                            <Option value="4">4</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item rules={[{ required: true }]}>
                        <Radio.Group
                            onChange={onChange}
                            value={value}
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
                    {value == 'Weibull' &&
                        <>
                            <Form.Item label="Данные по сроку службы и мониторингу" />
                            <TableData dataSource={dataSource} setDataSource={setDataSource}></TableData>
                        </>
                    }
                    <Form.Item>
                        {/* <Button type="primary" onClick={props.createProject}>Создать проект</Button> */}
                        <Button type="primary" onClick={test}>Создать проект</Button>
                    </Form.Item>
                </Form>
            </div>
        </div >
    )
}

export default Modal;
