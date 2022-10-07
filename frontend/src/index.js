import React, { useState } from "react";
import { render } from "react-dom";
import { Layout, Menu, Divider, Space } from "antd";
import {
  FormOutlined,
  EyeOutlined,
  PlaySquareOutlined,
  EditOutlined,
} from "@ant-design/icons";

import "antd/dist/antd.css";
import "./index.css";

const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("Submit");
  const componentsSwitch = (key) => {
    switch (key) {
      case "Submit":
        return (<div className="site-foreground"
          style={{ width: 800, margin: "20px auto" }} >
          <>Component 1</>
        </div >
        );
      case "ViewSubmissions":
        return (
          <div
            className="site-foreground"
            style={{ width: 800, margin: "20px auto" }}
          >
            <>Component 2</>
          </div>
        );
      default:
        break;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["Register"]}
          selectedKeys={selectedMenuItem}
          onSelect={(e) => setSelectedMenuItem(e.key)}
        >
          <Divider orientation="left" style={{ color: "white" }}>
            <FormOutlined /> Submit
          </Divider>
          <Menu.Item key="Submit" icon={<EditOutlined />}>
            Submit Text
          </Menu.Item>
          <Divider orientation="left" style={{ color: "white" }}>
            <EyeOutlined /> View
          </Divider>
          <Menu.Item key="ViewSubmissions" icon={<PlaySquareOutlined />}>
            View Submissions
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          className="site-layout-sub-header-background"
          style={{ textAlign: "center", color: "white", fontSize: "24px" }}
        >
          <Space>
            <b>Meetup Genie Demo</b>
          </Space>
        </Header>
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            {componentsSwitch(selectedMenuItem)}
            <div style={{ marginTop: 16 }}></div>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Julia Meetup Copenhagen
        </Footer>
      </Layout>
    </Layout>
  );
};

render(<App />, document.getElementById("root"));
