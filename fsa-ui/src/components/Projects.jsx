import { Button, Form, Input, Select, Space } from 'antd';
function Projects(props) {

    let { projects } = props;

    var options = {
        era: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };

    console.log(projects.projects[0].created.toLocaleString("ru", options));

    return (
        <div>
            <section className="projects__section">
                <div className="projects__form">
                    <h1>Проекты</h1>
                    <div className="projects__container">
                        {projects.projects.map(project => (
                            <div className="projects__field" key={project.id}>
                                <h3 className="number">Проект: {project.name}</h3>
                                <h3 className="number">Дата создания: {project.created}</h3>
                                {/* <Button type="default" id={project.id} onClick={props.onClick} >Открыть </Button> */}
                                <button className='text-white' id={project.id} onClick={props.onClick} >Открыть </button>
                                {/* <button id={project.id} className="projects__delete" onClick={props.deleteProject} >X </button> */}
                            </div>
                        ))}
                    </div>
                    <h1></h1>
                </div>
            </section >
        </div>
    )
}

export default Projects