import React, { useEffect, useRef, useState } from 'react';
// import axios from 'axios';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import Header from "./components/Header.jsx";
import Projects from "./components/Projects.jsx";
import Measure from "./components/Measure.jsx";
import Modal from "./components/Modal.jsx";
import Main from './components/Main.jsx';

const App = () => {

  const [modalStyle, setModalStyle] = useState({ display: 'none' });
  const [fileText, setFileText] = useState()
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState(null)
  const [projectId, setProjectId] = useState("")
  const [projectData, setProjectData] = useState(null)
  const [projectFailureRate, setProjectFailureRate] = useState(null)

  const closeProject = () => {
    setProjectId("");
  };

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


  const onClick = (e) => {
    setProjectId(e.target.id);
    console.log(e);
    console.log('click ', e.target.id);
  };

  const deleteProject = (e) => {
    let id = e.target.id;

    const response = fetch(`http://localhost:8000/projects/${id}`, {
      method: "DELETE",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        id
      })
    });
    if (response.ok) {
      window.location.reload()
    }
    else {
      console.log(response);
    }
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
      // window.location.reload()
      console.log("Обновлен");
    }
    else
      console.log(response);

  };

  // return projectId === "" ? (
  //   <div className='projects'>
  //     <Header openModal={openModal} />
  //     <Modal modalStyle={modalStyle} setFileText={setFileText} fileText={fileText} createProject={createProject} closeModal={closeModal} />
  //     {projects ? <Projects projects={projects} onClick={onClick} deleteProject={deleteProject} /> : <Spin size="large" />}
  //   </div>
  // ) : (
  //   <div>
  //     <Header openModal={openModal} />
  //     <Modal modalStyle={modalStyle} setFileText={setFileText} fileText={fileText} createProject={createProject} closeModal={closeModal} />
  //     {projectData ? <Measure project={projectData} measure={measure} setProjectData={setProjectData} projectFailureRate={projectFailureRate} closeProject={closeProject} /> : <Spin size="large" />}
  //   </div >
  // );

  return (
    <>
      {projects ? <Main projects={projects} setProjectId={setProjectId} measure={measure} setProjectData={setProjectData} /> : <Spin size="large" />}
    </>
  );

};
export default App;