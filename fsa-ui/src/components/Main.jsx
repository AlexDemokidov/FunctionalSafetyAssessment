import React, { useState } from 'react';
import {
    DesktopOutlined,
    PieChartOutlined,
    TeamOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Spin } from 'antd';
import ProjectCreation from './ProjectCreation';
import About from './About';
import Measure from './Measure';

const { Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
    return { key, icon, children, label };
}

function Main(props) {
    const { projects, project } = props;
    const [selectedMenuItem, setSelectedMenuItem] = useState('1');
    const [collapsed, setCollapsed] = useState(false);

    const handleMenuClick = (e) => {
        if (e.keyPath[1] === 'projects') {
            props.setProjectId(e.key);
            setSelectedMenuItem('3');
        } else {
            setSelectedMenuItem(e.key);
        }
    };

    const items = [
        getItem('Главная', '1', <HomeOutlined />),
        getItem('Создать проект', '2', <PieChartOutlined />),
        getItem(
            'Проекты',
            'projects',
            <DesktopOutlined />,
            projects.projects.map((proj) => getItem(proj.name, proj.id))
        ),
        getItem('Контакты', '4', <TeamOutlined />),
    ];

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const siderWidth = collapsed ? 80 : 200;

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                width={200}
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
            >
                <div className="demo-logo-vertical m-5 grid justify-items-center">
                    <img className="w-15" src="./src/img/fsa-logo-1.png" alt="Logo" />
                </div>
                <Menu
                    theme="dark"
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    items={items}
                    onClick={handleMenuClick}
                />
            </Sider>
            <Layout style={{ marginLeft: siderWidth }}>
                <Content style={{ margin: '0 16px' }}>
                    {selectedMenuItem === '1' && (
                        <>
                            <Breadcrumb style={{ margin: '16px 0' }}>
                                <Breadcrumb.Item>Главная</Breadcrumb.Item>
                            </Breadcrumb>
                            <div
                                style={{
                                    padding: 24,
                                    height: '100%',
                                    background: colorBgContainer,
                                    borderRadius: borderRadiusLG,
                                }}
                            >
                                <About />
                            </div>
                        </>
                    )}
                    {selectedMenuItem === '2' && (
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
                    )}
                    {selectedMenuItem === '3' && (
                        <>
                            <Breadcrumb style={{ margin: '16px 0' }}>
                                <Breadcrumb.Item>Проект</Breadcrumb.Item>
                                <Breadcrumb.Item>{project.name}</Breadcrumb.Item>
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
                    )}
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Alex Demokidov Design ©{new Date().getFullYear()} Created by Alex Demokidov
                </Footer>
            </Layout>
        </Layout>
    );
}

export default Main;
