// This is the main file for the frontend, where all the components are plumbed together.
// In React, there are two different ways of writing code - either as OOP via class 
// definitions, or as functional components. 
// This file uses the functional style, which can be recognized by the use of `useState`
// definitions in the code.

// Import basic definitions for React
import React, { useState } from "react";
import { render } from "react-dom";
// Import components and icons from Ant Design
import { Layout, Menu, Divider, Space } from "antd";
import {
  FormOutlined,
  EyeOutlined,
  PlaySquareOutlined,
  EditOutlined,
} from "@ant-design/icons";

// Import components
import SubmitText from "./components/submittext";
import FilterTable from "./components/filtertable";

// Import CSS definitions
import "antd/dist/antd.css";
import "./index.css";

const { Header, Content, Footer, Sider } = Layout;

// This function generates the HTML output that defines the frontend page
const App = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("Submit"); // `useState` defines
  // a new variable and a function for changing the variable. When this happens, any part of 
  // the frontend that uses this variable is automatically updated.
  // `useState` is used for functional code.

  // This function changes the main content of the page based on the menu selection.
  const componentsSwitch = (key) => {
    switch (key) {
      case "Submit":
        return (<div className="site-foreground"
          style={{ width: 600, margin: "20px auto" }} >
          <SubmitText api={"/api/v1/submittext"} />
        </div >
        );
      case "ViewSubmissions":
        return (
          <div
            className="site-foreground"
            style={{ width: 1000, margin: "20px auto" }}
          >
            <FilterTable api={"/api/v1/view"} />
          </div>
        );
      default:
        break;
    }
  };

  // The return value is the HTML code for the frontend page. One can "switch over" to 
  // Javascript code by putting it between {...} - see for example 
  // `{componentsSwitch(selectedMenuItem)}`.
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

// This line puts the component defined in the function `App` into the root node of the 
// webpage
render(<App />, document.getElementById("root"));
