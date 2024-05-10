import React, { useState } from "react";
import {
  HomeOutlined,
  CalendarOutlined,
  TeamOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Col, Layout, Menu, Row } from "antd";
import { Outlet, Link } from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;
import SubMenu from "antd/es/menu/SubMenu";

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem(<Link to="/">Профиль</Link>, "1", <HomeOutlined />),
  getItem(<Link to="/Shedules">Расписание</Link>, "2", <CalendarOutlined />),
  getItem(<Link to="/TimeTables">Расписание</Link>, "3", <CalendarOutlined />),
  getItem("Клуб", "sub1", <TeamOutlined />, [
    getItem(<Link to="/">Залы</Link>, "4"),
    getItem(<Link to="/">Группы</Link>, "5"),
  ]),
  getItem(<Link to="/Abonements">Абонементы</Link>, "6", <ShoppingOutlined />),
];

const App = ({ user }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/*Header страницы*/}
      <Header style={{ position: "sticky", top: 0, zIndex: 1, width: "100%" }}>
        <Row>
          <Col
            flex="1 1 200px"
            style={{
              float: "right",
              color: "rgba(255, 255, 255, 0.65)",
              fontSize: "20px",
            }}
          >
            АТЛАНТ - Фитнес клуб
          </Col>
          <Col flex="2 1 400px"></Col>
          <Col flex="1 1 300px">
            <div
              style={{
                float: "right",
                color: "rgba(255, 255, 255, 0.65)",
              }}
            >
              {user.isAuthenticated ? (
                <>
                  <strong>
                    {user.userRole === "client"
                      ? `Баланс: ${user.clientBalance} рублей, ${user.userName}`
                      : user.userName}
                  </strong>
                </>
              ) : (
                <>
                  <strong>Гость</strong>
                </>
              )}
            </div>
          </Col>
          <Col
            flex="0 1 100px"
            style={{
              float: "right",
              color: "rgba(255, 255, 255, 0.65)",
            }}
          >
            <Menu theme="dark" mode="horizontal" className="menu">
              <SubMenu
                key="4"
                icon={<UserOutlined style={{ fontSize: "30px" }} />}
              >
                {user.isAuthenticated ? (
                  <Menu.Item key="5">
                    <Link to={"/logoff"}>Выход</Link>
                  </Menu.Item>
                ) : (
                  <>
                    <Menu.Item key="6">
                      <Link to={"/register"}>Регистрация</Link>
                    </Menu.Item>
                    <Menu.Item key="7">
                      <Link to={"/login"}>Вход</Link>
                    </Menu.Item>
                  </>
                )}
              </SubMenu>
            </Menu>
          </Col>
        </Row>
      </Header>

      {/*Content, где Sider, menu сайдера и Content  */}
      <Content style={{ padding: "0 0px" }}>
        <Layout
          style={{
            minHeight: "100vh",
          }}
        >
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            width={200}
          >
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["1"]}
              style={{ height: "100%" }}
              items={items}
            />
          </Sider>

          <Content className="site-layout" style={{ padding: "0 50px" }}>
            <Outlet />
          </Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: "center" }}>FitnesClubAtlant ©2024</Footer>
    </Layout>
  );
};

export default App;
