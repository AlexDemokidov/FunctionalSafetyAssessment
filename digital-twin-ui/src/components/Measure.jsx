function Measure(props) {

    let { project } = props;

    let failure_rate = 0;
    let mtbf = 0;

    let filteredComponents = [];

    Object.assign(filteredComponents, project.project);
    console.log("filteredComponents", filteredComponents);

    for (var i = 0; i < filteredComponents.length; i++) {
        console.log(filteredComponents[i])
        if (filteredComponents[i].name == "V1" || filteredComponents[i].name == "I1" || filteredComponents[i].name == "V2") {
            console.log("Нашел")
            filteredComponents.splice(i, 1);

        }
    }

    for (var i = 0; i < filteredComponents.length; i++) {
        console.log(filteredComponents[i])
        if (parseFloat(filteredComponents[i].failure_rate) != "") {
            failure_rate += parseFloat(filteredComponents[i].failure_rate)
        }
    }


    if (failure_rate != 0 && failure_rate != "")
        mtbf = 1 / failure_rate;


    console.log("filteredComponents", filteredComponents);
    console.log("project", project)

    const handleOnChangeSelectGroup = event => {
        event.preventDefault();
        for (var i = 0; i < project.project.length; i++) {
            if (project.project[i].name == event.target.className)
                project.project[i].type = event.target.value;
        }
        console.log(project);
    }

    const handleOnChangeSelectPower = event => {
        event.preventDefault();
        for (var i = 0; i < project.project.length; i++) {
            if (project.project[i].name == event.target.className)
                project.project[i].power = event.target.value;
        }
        console.log(project);
    }

    const updateParameters = event => {
        event.preventDefault();
        props.setProjectData(project);
        props.measure();
        window.location.reload();
    }

    return (


        <div>

            <div>
                <button className="close__button" onClick={props.closeProject}>
                    <span className="sr">close</span>
                </button>
            </div>

            <section className="parameters__section">
                <div className="container">
                    <div className="title">
                        <h1>Проект:</h1>
                        <h1 className="number">{project.id}</h1>
                    </div>
                    <div className="title">
                        <h3>Эксплуатационная интенсивность отказов: λэ =</h3>
                        <h3 className="number">{failure_rate}</h3>
                        <h3>1/ч</h3>
                    </div>
                    <div className="title">
                        <h3>Наработка на отказ: MTBF =</h3>
                        <h3 className="number">{mtbf}</h3>
                        <h3>ч</h3>
                    </div>


                </div>

                <div>
                    <h2>Параметры моделирования</h2>
                    <div className="parameters">
                        <div className="parameters__form">
                            <p>Температура T = +22°C</p>
                            <select className="custom-select" defaultValue="Operating Point">
                                <option value="value1">Operating Point</option>
                                <option value="value2">DC анализ</option>
                                <option value="value3">Transient</option>
                            </select>
                            <button onClick={updateParameters}>Расчет</button>
                        </div>
                        <div className="defects__form">
                            <div className="container">
                                <p>Неисправность №1</p>
                                <label htmlFor="defect1" className="toggle-switchy" data-style="rounded" data-label="left" data-size="sm">
                                    <input type="checkbox" id="defect1" />
                                    <span className="toggle">
                                        <span className="switch"></span>
                                    </span>
                                </label>
                            </div>
                            <div className="container">
                                <p>Неисправность №2</p>
                                <label htmlFor="defect2" className="toggle-switchy" data-style="rounded" data-label="left" data-size="sm">
                                    <input type="checkbox" id="defect2" />
                                    <span className="toggle">
                                        <span className="switch"></span>
                                    </span>
                                </label>
                            </div>
                            <div className="container">
                                <p>Неисправность №3</p>
                                <label htmlFor="defect3" className="toggle-switchy" data-style="rounded" data-label="left" data-size="sm">
                                    <input type="checkbox" id="defect3" />
                                    <span className="toggle">
                                        <span className="switch"></span>
                                    </span>
                                </label>
                            </div>
                            <div className="container">
                                <p>Неисправность №4</p>
                                <label htmlFor="defect4" className="toggle-switchy" data-style="rounded" data-label="left" data-size="sm">
                                    <input type="checkbox" id="defect4" />
                                    <span className="toggle">
                                        <span className="switch"></span>
                                    </span>
                                </label>
                            </div>
                            <div className="container">
                                <p>Неисправность №5</p>
                                <label htmlFor="defect5" className="toggle-switchy" data-style="rounded" data-label="left" data-size="sm">
                                    <input type="checkbox" id="defect5" />
                                    <span className="toggle">
                                        <span className="switch"></span>
                                    </span>
                                </label>
                            </div>
                            <div className="container">
                                <p>Неисправность №6</p>
                                <label htmlFor="defect6" className="toggle-switchy" data-style="rounded" data-label="left" data-size="sm">
                                    <input type="checkbox" id="defect6" />
                                    <span className="toggle">
                                        <span className="switch"></span>
                                    </span>
                                </label>
                            </div>
                        </div>

                    </div>

                </div>
            </section>

            <section className="components__section">
                <h2>Расчет параметров</h2>
                <table>
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Обозначение</th>
                            {/* <th>Класс</th> */}
                            <th>Группа</th>
                            <th>Номинал</th>
                            <th>V, В</th>
                            <th>I, А</th>
                            <th>P, Вт</th>
                            <th>Pmax, Вт</th>
                            <th>S</th>
                            <th>λэ, 1/ч</th>
                            <th>MTBF, ч</th>
                        </tr>
                    </thead>
                    <tbody>


                        {filteredComponents.map((component, index) => (
                            <tr key={index} >
                                <td>{index + 1}</td>
                                <td>{component.name}</td>
                                {/* <td>
                                    <select id="classSelect" defaultValue={"value0"}>
                                        <option value="value0" >{component.type}</option>
                                        <option value="value1">Интегральные микросхемы</option>
                                        <option value="value2">Полупроводниковые приборы</option>
                                        <option value="value3">Оптоэлектронные полупроводниковые приборы</option>
                                        <option value="value4">Резисторы</option>
                                        <option value="value5">Конденсаторы</option>
                                        <option value="value6">Трансформаторы</option>
                                        <option value="value7">Катушки индуктивности</option>
                                        <option value="value8">Реле</option>
                                    </select>
                                </td> */}
                                <td>
                                    <select name={component.name} defaultValue={"value0"} className={component.name} onChange={handleOnChangeSelectGroup}>
                                        <option value="value0">{component.type}</option>
                                        <option value="-" >-</option>
                                        <option value="Микросхемы цифровые">Микросхемы цифровые</option>
                                        <option value="Микросхемы аналоговые">Микросхемы аналоговые</option>
                                        <option value="Микросхемы памяти">Микросхемы памяти</option>
                                        <option value="Программируемые логические интегральные схемы">Программируемые логические интегральные схемы</option>
                                        <option value="Микропроцессоры">Микропроцессоры</option>
                                        <option value="Микросхемы GaAs СВЧ">Микросхемы GaAs СВЧ</option>
                                        <option value="Микросхемы ПАВ">Микросхемы ПАВ</option>
                                        <option value="Диоды низкочастотные">Диоды низкочастотные</option>
                                        <option value="Диоды высокочастотные">Диоды высокочастотные</option>
                                        <option value="Транзисторы биполярные низкочастотные">Транзисторы биполярные низкочастотные</option>
                                        <option value="Транзисторы полевые низкочастотные">Транзисторы полевые низкочастотные</option>
                                        <option value="Транзисторы однопереходные">Транзисторы однопереходные</option>
                                        <option value="Транзисторы биполярные высокочастотные малой и средней мощности">Транзисторы биполярные высокочастотные малой и средней мощности</option>
                                        <option value="Транзисторы биполярные высокочастотные большой мощности">Транзисторы биполярные высокочастотные большой мощности</option>
                                        <option value="Транзисторы полевые высокочастотные арсенидогаллиевые малой и средней мощности">Транзисторы полевые высокочастотные арсенидогаллиевые малой и средней мощности</option>
                                        <option value="Транзисторы полевые высокочастотные арсенидогаллиевые большой мощности">Транзисторы полевые высокочастотные арсенидогаллиевые большой мощности</option>
                                        <option value="Транзисторы полевые высокочастотные кремниевые">Транзисторы полевые высокочастотные кремниевые</option>
                                        <option value="Тиристоры">Тиристоры</option>
                                        <option value="Фотоприемники, оптопары, излучатели полупроводниковые, буквенно-цифровые дисплеи">Фотоприемники, оптопары, излучатели полупроводниковые, буквенно-цифровые дисплеи</option>
                                        <option value="Лазерные диоды">Лазерные диоды</option>
                                        <option value="Резисторы постоянные пленочные, в т.ч поверхностного монтажа">Резисторы постоянные пленочные, в т.ч поверхностного монтажа</option>
                                        <option value="Резисторы постоянные проволочные, кроме мощных">Резисторы постоянные проволочные, кроме мощных</option>
                                        <option value="Резисторы постоянные проволочные мощные">Резисторы постоянные проволочные мощные</option>
                                        <option value="Сборки резисторные, в т.ч. поверхностного монтажа">Сборки резисторные, в т.ч. поверхностного монтажа</option>
                                        <option value="Резисторы переменные проволочные, кроме мощных и полупрецизионных">Резисторы переменные проволочные, кроме мощных и полупрецизионных</option>
                                        <option value="Резисторы переменные проволочные мощные">Резисторы переменные проволочные мощные</option>
                                        <option value="Резисторы переменные прововолочные полупрецизионные">Резисторы переменные прововолочные полупрецизионные</option>
                                        <option value="Резисторы переменные непроволочные, кроме прецизионных">Резисторы переменные непроволочные, кроме прецизионных</option>
                                        <option value="Резисторы переменные непроволочные прецизионные">Резисторы переменные непроволочные прецизионные</option>
                                        <option value="Терморезисторы">Терморезисторы</option>
                                        <option value="Конденсаторы бумажные / с органическим синтетическим диэлектриком">Конденсаторы бумажные / с органическим синтетическим диэлектриком</option>
                                        <option value="Конденсаторы слюдяные">Конденсаторы слюдяные</option>
                                        <option value="Конденсаторы стеклянные">Конденсаторы стеклянные</option>
                                        <option value="Конденсаторы керамические постоянной ёмкости термокомпенсационные">Конденсаторы керамические постоянной ёмкости термокомпенсационные</option>
                                        <option value="Конденсаторы керамические постоянной ёмкости">Конденсаторы керамические постоянной ёмкости</option>
                                        <option value="Конденсаторы керамические постоянной ёмкости поверхностного монтажа">Конденсаторы керамические постоянной ёмкости поверхностного монтажа</option>
                                        <option value="Конденсаторы керамические переменной ёмкости (триммеры)">Конденсаторы керамические переменной ёмкости (триммеры)</option>
                                        <option value="Конденсаторы оксидно-полупроводниковые">Конденсаторы оксидно-полупроводниковые</option>
                                        <option value="Конденсаторы оксидно-полупроводниковые поверхностного монтажа">Конденсаторы оксидно-полупроводниковые поверхностного монтажа</option>
                                        <option value="Конденсаторы объёмно-пористые">Конденсаторы объёмно-пористые</option>
                                        <option value="Конденсаторы оксидно-электролитические алюминиевые">Конденсаторы оксидно-электролитические алюминиевые</option>
                                        <option value="Конденсаторы переменные поршневого типа трубчатые подстроечные">Конденсаторы переменные поршневого типа трубчатые подстроечные</option>
                                        <option value="Трансформаторы строчные">Трансформаторы строчные</option>
                                        <option value="Трансформаторы звуковой частоты">Трансформаторы звуковой частоты</option>
                                        <option value="Трансформаторы малой мощности">Трансформаторы малой мощности</option>
                                        <option value="Трансформаторы импульсные мощные">Трансформаторы импульсные мощные</option>
                                        <option value="Трансформаторы радиочастотные">Трансформаторы радиочастотные</option>
                                        <option value="Катушки индуктивности постоянные, в т.ч. для поверхностного монтажа">Катушки индуктивности постоянные, в т.ч. для поверхностного монтажа</option>
                                        <option value="Катушки индуктивности переменные, в т.ч. для поверхностного монтажа">Катушки индуктивности переменные, в т.ч. для поверхностного монтажа</option>
                                        <option value="Механическое реле">Механическое реле</option>
                                        <option value="Реле твердотельные, реле с временной задержкой и гибридные">Реле твердотельные, реле с временной задержкой и гибридные</option>
                                    </select>
                                </td>
                                <td>{component.value}</td>
                                <td>{(component.voltage * 1).toFixed(3)}</td>
                                <td>{(component.current * 1).toFixed(3)}</td>
                                <td>{(component.voltage * component.current).toFixed(3)}</td>
                                <td>
                                    <select name={component.power} defaultValue={"value0"} className={component.name} onChange={handleOnChangeSelectPower}>
                                        <option value="value0">{component.power}</option>
                                        <option value="-" >-</option>
                                        <option value="0.25">0.25</option>
                                        <option value="0.5">0.5</option>
                                        <option value="0.75">0.75</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="5">5</option>
                                    </select>
                                </td>
                                <td>{((component.voltage * component.current).toFixed(5) / component.power).toFixed(3)}</td>
                                <td>{component.failure_rate}</td>
                                <td>{(1 / component.failure_rate).toFixed(0)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </section>

        </div>

    )
}

export default Measure