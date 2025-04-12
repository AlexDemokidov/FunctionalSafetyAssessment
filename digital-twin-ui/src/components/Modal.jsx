import { useState } from "react";

function Modal(props) {

    const fileReader = new FileReader();

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
                <h2>Создание нового проекта</h2>
                <p>Для создания нового проекта загрузите файл</p>
                <form>
                    <div className="modal-netlist">
                        <p>Netlist</p>
                        <input type="file" id="fileUpload" name="fileUpload" onChange={handleOnChange} />
                    </div>
                    <button onClick={props.createProject}>Создать проект</button>
                </form>
            </div>
        </div >
    )
}

export default Modal;
