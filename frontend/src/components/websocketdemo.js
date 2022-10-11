import React, { useEffect, useState } from "react";
import {
    Input,
    message,
    Typography,
    Divider
} from "antd";

const WebsocketDemo = (props) => {
    // Configure websockets connection - see the comments in index.js for an explanation
    const endpoint = props.endpoint

    const parseJSON = (str) => {
        try {
            return JSON.parse(str);
        } catch {
            return { message: str };
        }
    }

    const parseMessage = (dict) => {
        Object.keys(dict).map((key) => {
            switch (key) {
                case "message":
                    displayMessage(dict.message);
                    setLastmessage(dict.message)
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

    useEffect(() => {
        props.ws.onmessage = (ev) => {
            if (ev.data === "true") { return }
            const message = parseJSON(ev.data);
            parseMessage(message);
        };
        return () => {
            props.ws.onmessage = () => { }  // avoid memory leak when component unmounts
        };
    }, [props.ws]);

    const send = (message, payload) => {
        props.ws.send(JSON.stringify({
            'channel': endpoint,   // base URL
            'message': message, // second part after /
            'payload': payload // exposed as payload in Genie
        }));
    };

    const { Search } = Input;
    const [lastmessage, setLastmessage] = useState("");

    const submitMessage = (msg) => {
        send("submitmessage", msg)
    }

    return (<>
        <Typography.Title level={5}>Message All Clients</Typography.Title>
        <Search
            placeholder="Input your message"
            allowClear
            enterButton="Submit"
            size="large"
            onSearch={submitMessage}
        />
        <Divider />
        <Typography.Title level={5}>Last Message</Typography.Title>
        <Typography.Text>{lastmessage}</Typography.Text>
    </>
    )
}


export default WebsocketDemo