function Header(props) {

    return (
        <>
            <header>
                <nav className="nav-container">
                    <div className="nav-container__inner items-center">
                        <a href="http://localhost:5173/">
                            <img className="header__logo" src="/src/img/digital-twin.png" alt="Логотип Digital Twin" />
                        </a>
                        <ul className="top-nav">
                            <li className="menu__item menu__item_active">
                                <a href="http://localhost:5173/">ГЛАВНАЯ</a>
                            </li>
                            <li className="menu__item" id="open" onClick={props.openModal}><a>НОВЫЙ ПРОЕКТ</a></li>
                            <li className="menu__item">
                                <a href="https://cabinet.miem.hse.ru/#/project/1574/">О ПРОГРАММЕ</a>
                            </li>
                            <li className="menu__item">
                                <a href="https://vk.com/demokidov">КОНТАКТЫ</a>
                            </li>
                        </ul>
                        <a className="header__login" href="#" aria-label="Вход в личный кабинет">
                            <img src="/src/img/user.svg" alt="Иконка пользователя" />
                            <div>Вход</div>
                        </a>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default Header;