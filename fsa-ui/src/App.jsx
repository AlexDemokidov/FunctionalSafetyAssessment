import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import Main from './components/Main.jsx';

const App = () => {

  const [projects, setProjects] = useState(null)
  const [projectId, setProjectId] = useState("")
  const [projectData, setProjectData] = useState(null)

  useEffect(() => {
    fetchProjects()
  }, []);

  useEffect(() => {
    if (projectId != "") {
      console.log(projectId);
      fetchProjectData();
    }
  }, [projectId]);

  const fetchProjects = () => {
    fetch('http://localhost:8000/projects')
      .then(response => response.json())
      .then(
        (result) => {
          setProjects(result);
          console.log(result);
        },
        (error) => {
          setError(error);
        }
      )
  }

  const fetchProjectData = () => {
    console.log(projectId);
    fetch(`http://localhost:8000/projects/${projectId}`)
      .then(response => response.json())
      .then(
        (result) => {
          setProjectData(result);
        },
        (error) => {
          setError(error);
        }
      )
  }

  const measure = (e) => {
    let project = projectData.project;
    console.log(project);
    console.log(projectId);


    const response = fetch(`http://localhost:8000/projects/${projectId}`, {
      method: "PUT",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        project
      })
    });
    if (response.ok) {
      console.log("Обновлен");
    }
    else
      console.log(response);

  };

  return (
    <>
      {projects ? <Main projects={projects} project={projectData} setProjectId={setProjectId} measure={measure} setProjectData={setProjectData} /> : <Spin size="large" />}
    </>
  );

};
export default App;