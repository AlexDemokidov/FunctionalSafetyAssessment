import { useState } from "react";
import { Button, Form, Input, Select, Radio } from 'antd';
import TableData from "./TableData.jsx";
import axios from 'axios';
const { Option } = Select;


function Modal(props) {

    const [form] = Form.useForm(); // Хук формы Ant Design
    const [analisys, setAnalisys] = useState('Weibull');
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
        if (analisys == 'Weibull') {
            data = {
                "project": dataSource,
                "name": formValues.projectName,
                "analysis": analisys,
                "sil": formValues.sil
            }

        }
        else {
            data = {
                "name": formValues.projectName,
                "analysis": analisys,
                "sil": formValues.sil
            }
        }
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

    // function createProject() {
    //     const formValues = form.getFieldsValue();
    //     let data = {}
    //     if (analisys == 'Weibull') {
    //         let dataTest = [{
    //             name: 'gfgfg',
    //             time: '100',
    //             parameter1: '78',
    //             parameter2: '43',
    //             parameter3: '68'
    //         }]
    //         data = {
    //             project: dataTest
    //             // name: formValues.projectName,
    //             // analysis: analisys,
    //             // sil: formValues.sil
    //         }
    //         // data = JSON.stringify(data)
    //         // data = {
    //         //     // name: formValues.projectName,
    //         //     project: dataSource,
    //         //     // analysis: analisys,
    //         //     // sil: formValues.sil
    //         // }
    //     }
    //     else {
    //         data = {
    //             name: formValues.projectName,
    //             analysis: analisys,
    //             sil: formValues.sil
    //         }
    //     }
    //     console.log(data)

    //     // const response = fetch(`http://localhost:8000/projects`, {
    //     //     method: "POST",
    //     //     headers: { "Accept": "application/json", "Content-Type": "application/json" },
    //     //     body: JSON.stringify({
    //     //         data
    //     //     })
    //     // });
    //     const response = fetch(`http://localhost:8000/projects`, {
    //         method: "POST",
    //         headers: { "Accept": "application/json", "Content-Type": "application/json" },
    //         body: JSON.stringify({
    //             data
    //         })
    //     });
    //     if (response.ok) {
    //         window.location.reload()
    //         console.log(response);
    //     }
    //     else
    //         console.log(response);
    // }



    const fileReader = new FileReader();



    const onChangeAnalisys = e => {
        setAnalisys(e.target.value);
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

    const handleSubmit = () => {
        const formValues = form.getFieldsValue();
        console.log('Выбранный SIL:', formValues.sil); // Получаем значение поля "sil"
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
                            onChange={onChangeAnalisys}
                            value={analisys}
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
                    {analisys == 'Weibull' &&
                        <>
                            <Form.Item label="Данные по сроку службы и мониторингу" />
                            <TableData dataSource={dataSource} setDataSource={setDataSource}></TableData>
                        </>
                    }
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
