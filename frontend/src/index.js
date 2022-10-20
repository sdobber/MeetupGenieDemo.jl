// This is the main file for the frontend, where all the components are plumbed together.
// In React, there are two different ways of writing code - either as OOP via class 
// definitions, or as functional components. 
// This file uses the functional style, which can be recognized by the use of `useState`
// definitions in the code.

// Import basic definitions for React
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from 'react-dom/client';
// Import components and icons from Ant Design
import { Layout, Menu, Divider, Space, message } from "antd";
import {
  FormOutlined,
  EyeOutlined,
  PlaySquareOutlined,
  EditOutlined,
  GiftOutlined,
  AlertOutlined
} from "@ant-design/icons";

// Import components
import SubmitText from "./components/submittext";
import FilterTable from "./components/filtertable";
import WebsocketDemo from "./components/websocketdemo";

// Import CSS definitions
import "antd/dist/antd.css";
import "./index.css";

const { Header, Content, Footer, Sider } = Layout;

// This function generates the HTML output that defines the frontend page
const App = () => {
  // The following part of the code sets up the websockets connection
  const endpoint = "ws_meetup"
  const ws = useRef();
  // Variable to store the websocket connection parameters
  const [genieSettings, setGenieSettings] = useState({
    server_host: "1.1.1.1",
    server_port: 8000
  });
  // Once a connection is established, the value is `true`:
  const [wsOpen, setWSOpen] = useState(false);
  const getSettings = async () => {
    const data = await fetch("/api/v1/getwssettings");
    const response = await data.json();
    setGenieSettings(response);
  };
  // Parse incoming messages as JSON - unless it is just a string, then just show it as message.
  const parseJSON = (str) => {
    try {
      return JSON.parse(str);
    } catch {
      return { message: str };
    }
  };
  // Main function that handles what to do based on the incoming dictionary. Use the keys to
  // cause certain actions, and use the values to carry out the actions.
  const parseMessage = (dict) => {
    // console.log(dict);
    Object.keys(dict).map((key) => {
      switch (key) {
        case "message":
          displayMessage(dict.message);
          break;
        case "error":
          displayError(dict.error);
          break;
        default:
          break;
      };
      return undefined
    }
    )
  };
  const displayMessage = (msg) => {
    message.info(msg, 5);
  };
  const displayError = (msg) => {
    message.error(msg, 5);
  };
  // Function to send messages over the websocket in a simple way later.
  const send = (message, payload) => {
    ws.current.send(JSON.stringify({
      'channel': endpoint,   // base URL
      'message': message, // second part after /
      'payload': payload // exposed as payload in Genie
    }));
  };
  // Close the websocket connection in a proper way to avoid memory leaks.
  const setupBeforeUnloadListener = () => {
    window.addEventListener('beforeunload', (event) => {
      console.log("Preparing to unload");
      send("unsubscribe", "");
      console.log('Cleaning up! 🧼');
      ws.current.close();
    });
  };

  // Update genieSettings one time when the component appears
  useEffect(() => {
    getSettings();
  }, [])

  // Rerun this every time genieSettings changes
  useEffect(() => {
    ws.current = new WebSocket("ws://" + genieSettings.server_host + ":" + genieSettings.server_port);

    ws.current.onopen = () => {
      send("subscribe", "")
      console.log('Connection opened!');
      setWSOpen(true);
    };

    ws.current.onmessage = (ev) => {
      const message = parseJSON(ev.data);
      parseMessage(message);
    };

    ws.current.onclose = () => {
      // code for reconnecting
    };

    return () => { };
  }, [genieSettings]
  );

  setupBeforeUnloadListener();

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
      case "Websockets":
        if (wsOpen) {
          return (<div className="site-foreground"
            style={{ width: 600, margin: "20px auto" }} >
            <WebsocketDemo
              ws={ws.current}
              endpoint={endpoint} />
          </div>
          )
        } else {
          return (<></>)
        };
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
          <Divider orientation="left" style={{ color: "white" }}>
            <GiftOutlined /> Extra
          </Divider>
          <Menu.Item key="Websockets" icon={<AlertOutlined />}>
            Websocket Demo
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
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
