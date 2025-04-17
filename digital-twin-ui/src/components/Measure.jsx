import TableData from "./TableData";
import { Button, Form, Input, Select } from 'antd';

function Measure(props) {

    let { project } = props;

    let failure_rate = 0;
    let mtbf = 0;

    let filteredComponents = [];

    console.log(project)

    // Object.assign(filteredComponents, project.project);
    // console.log("filteredComponents", filteredComponents);

    // for (var i = 0; i < filteredComponents.length; i++) {
    //     console.log(filteredComponents[i])
    //     if (filteredComponents[i].name == "V1" || filteredComponents[i].name == "I1" || filteredComponents[i].name == "V2") {
    //         console.log("Нашел")
    //         filteredComponents.splice(i, 1);

    //     }
    // }

    // for (var i = 0; i < filteredComponents.length; i++) {
    //     console.log(filteredComponents[i])
    //     if (parseFloat(filteredComponents[i].failure_rate) != "") {
    //         failure_rate += parseFloat(filteredComponents[i].failure_rate)
    //     }
    // }


    // if (failure_rate != 0 && failure_rate != "")
    //     mtbf = 1 / failure_rate;


    // console.log("filteredComponents", filteredComponents);
    // console.log("project", project)

    // const handleOnChangeSelectGroup = event => {
    //     event.preventDefault();
    //     for (var i = 0; i < project.project.length; i++) {
    //         if (project.project[i].name == event.target.className)
    //             project.project[i].type = event.target.value;
    //     }
    //     console.log(project);
    // }

    // const handleOnChangeSelectPower = event => {
    //     event.preventDefault();
    //     for (var i = 0; i < project.project.length; i++) {
    //         if (project.project[i].name == event.target.className)
    //             project.project[i].power = event.target.value;
    //     }
    //     console.log(project);
    // }

    // const updateParameters = event => {
    //     event.preventDefault();
    //     props.setProjectData(project);
    //     props.measure();
    //     window.location.reload();
    // }

    function measureSIL() {

    }

    return (
        <div>
            <div>

            </div>
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

        </div>
    )
}

export default Measure