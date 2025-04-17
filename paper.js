<>
    <Routes>
        <Route path="/projects" element={projects ? <Projects projects={projects} onClick={onClick} deleteProject={deleteProject} /> : <Spin size="large" />} />
        <Route path={`/projects/${projectId}`} element={projectData ? <Measure project={projectData} measure={measure} setProjectData={setProjectData} projectFailureRate={projectFailureRate} closeProject={closeProject} /> : <Spin size="large" />} />
        <Route path="*" element={<NotFound />}></Route>
    </Routes>
</>













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


{
    "detail": [
        {
            "type": "missing",
            "loc": [
                "body",
                "project"
            ],
            "msg": "Field required",
            "input": {
                "data": {
                    "project": [
                        {
                            "key": "1",
                            "name": "Недостаточная емкость",
                            "time": "100",
                            "parameter1": "78",
                            "parameter2": "43",
                            "parameter3": "68"
                        },
                        {
                            "key": "2",
                            "name": "Перегрев",
                            "time": "56",
                            "parameter1": "30",
                            "parameter2": "89",
                            "parameter3": "25"
                        }
                    ],
                    "analysis": "Weibull"
                }
            }
        }
    ]
}

{
    "detail": [
        {
            "type": "list_type",
            "loc": [
                "body",
                "project"
            ],
            "msg": "Input should be a valid list",
            "input": {
                "project": [
                    {
                        "key": "1",
                        "name": "Недостаточная емкость",
                        "time": "100",
                        "parameter1": "78",
                        "parameter2": "43",
                        "parameter3": "68"
                    },
                    {
                        "key": "2",
                        "name": "Перегрев",
                        "time": "56",
                        "parameter1": "30",
                        "parameter2": "89",
                        "parameter3": "25"
                    }
                ]
            }
        }
    ]
}

{
    "project": [
        {
            "name": "string",
            "time": "string",
            "parameter1": "string",
            "parameter2": "string",
            "parameter3": "string"
        }
    ]
}