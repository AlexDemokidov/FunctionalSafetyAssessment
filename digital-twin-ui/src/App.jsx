import React, { useEffect, useRef, useState } from 'react';
// import axios from 'axios';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import Header from "./components/Header.jsx";
import Projects from "./components/Projects.jsx";
import Measure from "./components/Measure.jsx";
import Modal from "./components/Modal.jsx";

const App = () => {

  const [modalStyle, setModalStyle] = useState({ display: 'none' });
  const [fileText, setFileText] = useState()
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState(null)
  const [projectId, setProjectId] = useState("")
  const [projectData, setProjectData] = useState(null)
  const [projectFailureRate, setProjectFailureRate] = useState(null)

  const openModal = () => {
    setModalStyle({ display: 'block' });
  };

  const closeModal = () => {
    setModalStyle({ display: 'none' });
  };

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

  const createProject = (e) => {
    // event.preventDefault();
    console.log(fileText);

    let lines = fileText.split('\n');

    if (lines[0].includes('pdsprj')) {
      lines.shift(); // Remove file path
    } else {
      lines.shift(); // Remove file path
      lines.pop(); // Remove .end
      lines.pop(); // Remove .backanno
      lines.pop(); // Remove .op
      lines.pop(); // Remove .op
    }

    for (let i = 0; i < lines.length; i++) {
      lines[i] = lines[i].replace('BAT', 'V');
    }

    console.log(lines)

    const simpleComponents = ['R', 'V', 'I', 'C'];

    const netlist = [];
    let res_dict = {};

    for (const line of lines) {
      const parameters = line.split(' ');
      const type = parameters[0][0];
      console.log(type)
      if (simpleComponents.includes(type)) {
        res_dict = {
          name: parameters[0],
          type: "-",
          node1: parameters[1],
          node2: parameters[2],
          value: parameters[3],
          node3: "-",
          node4: "-",
          voltage: "-",
          current: "-",
          power: "-",
          failure_rate: "",
          mtbf: ""
        };
        console.log(res_dict)

        if (parameters[3].includes('K') || parameters[3].includes('k')) {
          res_dict.value = parseFloat(parameters[3].slice(0, -1));
          res_dict.value *= 1000;
          res_dict.value = res_dict.value.toString()
        } else if (parameters[3].includes('U') || parameters[3].includes('u')) {
          res_dict.value = parseFloat(parameters[3].slice(0, -1));
          res_dict.value /= 1000000;
          res_dict.value = res_dict.value.toString()
        } else if (parameters[3].includes('V')) {
          res_dict.value = parseFloat(parameters[3].slice(0, -1));
          res_dict.value = res_dict.value.toString()
        }
      } else if (type === 'Q') {
        res_dict = {
          name: parameters[0],
          node1: parameters[1],
          node2: parameters[2],
          node3: parameters[3],
          value: parameters[4],
          type: "-",
          node4: "-",
          voltage: "-",
          current: "-",
          power: "-",
          failure_rate: "",
          mtbf: ""
        };
      } else if (type === 'D') {
        res_dict = {
          name: parameters[0],
          node1: parameters[1],
          node2: parameters[2],
          value: parameters[3],
          type: "-",
          node3: "-",
          node4: "-",
          voltage: "-",
          current: "-",
          power: "-",
          failure_rate: "",
          mtbf: ""
        };
      }
      netlist.push(res_dict);
    }
    console.log('project: ', netlist);

    let project = netlist

    console.log(project)

    const response = fetch(`http://localhost:8000/projects`, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        project
      })
    });
    if (response.ok) {
      window.location.reload()
      console.log(response);
    }
    else
      console.log(response);
  };

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

  return projectId === "" ? (
    <div className='projects'>
      <Header openModal={openModal} />
      <Modal modalStyle={modalStyle} setFileText={setFileText} fileText={fileText} createProject={createProject} closeModal={closeModal} />
      {projects ? <Projects projects={projects} onClick={onClick} deleteProject={deleteProject} /> : <Spin size="large" />}
    </div>
  ) : (
    <div>
      <Header openModal={openModal} />
      <Modal modalStyle={modalStyle} setFileText={setFileText} fileText={fileText} createProject={createProject} closeModal={closeModal} />
      {projectData ? <Measure project={projectData} measure={measure} setProjectData={setProjectData} projectFailureRate={projectFailureRate} closeProject={closeProject} /> : <Spin size="large" />}
    </div >
  );

};
export default App;