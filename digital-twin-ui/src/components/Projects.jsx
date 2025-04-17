import { Button, Form, Input, Select, Space } from 'antd';
import Header from "./Header.jsx";
function Projects(props) {

    let { projects } = props;

    return (
        <>
            <Header />
            <section className="projects__section">
                <div className="projects__form">
                    <h1>Проекты</h1>
                    <div className="projects__container">
                        {projects.projects.map(project => (
                            <div className="projects__field" key={project.id}>
                                <h3 className="number">Номер проекта: {project.id}</h3>
                                <h3 className="number">Дата создания: {project.created}</h3>
                                {/* <Button type="default" id={project.id} onClick={props.onClick} >Открыть </Button> */}
                                <a href={`/projects/${project.id}`}>
                                    <button className='text-white' id={project.id} onClick={props.onClick} >Открыть </button>
                                </a>


                                {/* <button id={project.id} className="projects__delete" onClick={props.deleteProject} >X </button> */}
                            </div>
                        ))}
                    </div>
                    <h1></h1>
                </div>
            </section >
        </>
    )
}

export default Projects