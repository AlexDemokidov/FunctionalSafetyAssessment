import React, { useState } from 'react';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import ProjectCreation from './ProjectCreation';
import About from './About';
import Measure from './Measure';
import { Spin } from 'antd';

const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}


function Main(props) {

    let { projects, project } = props;

    const [selectedMenuItem, setSelectedMenuItem] = useState(1);

    const handleMenuClick = (e) => {
        console.log('Clicked item:', e.key);

        // Можно сохранить выбранный ключ в состоянии
        setSelectedMenuItem(e.key);

        // Если keyPath содержит больше одного элемента — это вложенный пункт
        if (e.keyPath[1] == "projects") {
            setSelectedMenuItem(3);

            // console.log(e.key)
            props.setProjectId(e.key)
            console.log('Это вложенный пункт, родитель:', e.keyPath[1]);
        }
    };

    console.log(projects)
    console.log(project)

    const items = [
        getItem('Главная', '1', <HomeOutlined />),
        getItem('Создать проект', '2', <PieChartOutlined />),
        getItem('Проекты', 'projects', <DesktopOutlined />, projects.projects.map(project => (
            getItem(project.name, project.id))
        )),
        getItem('Контакты', '4', <TeamOutlined />),
    ];

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
                <div className="demo-logo-vertical m-5 grid justify-items-center">
                    <img className='w-15' src="./src/img/fsa-logo-1.png" alt="" />
                </div>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={handleMenuClick} />
            </Sider>
            <Layout>
                {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
                <Content style={{ margin: '0 16px' }}>
                    {selectedMenuItem == 1 &&
                        <>
                            <Breadcrumb style={{ margin: '16px 0' }}>
                                <Breadcrumb.Item>Главная</Breadcrumb.Item>
                            </Breadcrumb>
                            <div
                                style={{
                                    padding: 24,
                                    minHeight: 360,
                                    background: colorBgContainer,
                                    borderRadius: borderRadiusLG,
                                }}
                            >
                                <About />
                            </div>
                        </>
                    }
                    {selectedMenuItem == 2 &&
                        <>
                            <Breadcrumb style={{ margin: '16px 0' }}>
                                <Breadcrumb.Item>Создать проект</Breadcrumb.Item>
                            </Breadcrumb>
                            <div
                                style={{
                                    padding: 24,
                                    minHeight: 360,
                                    background: colorBgContainer,
                                    borderRadius: borderRadiusLG,
                                }}
                            >
                                <ProjectCreation />
                            </div>
                        </>
                    }
                    {selectedMenuItem == 3 &&
                        <>
                            <Breadcrumb style={{ margin: '16px 0' }}>
                                <Breadcrumb.Item>Проект</Breadcrumb.Item>
                            </Breadcrumb>
                            <div
                                style={{
                                    padding: 24,
                                    minHeight: 360,
                                    background: colorBgContainer,
                                    borderRadius: borderRadiusLG,
                                }}
                            >
                                {project ? <Measure project={project} /> : <Spin size="large" />}
                            </div>

                        </>
                    }
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Alex Demokidov Design ©{new Date().getFullYear()} Created by Alex Demokidov
                </Footer>
            </Layout>
        </Layout>
    );
};
export default Main;