// This file creates a component that contains two dropdown menus and a comment textbox.
// It uses the OOP style, which can be recognized by the `class` keyword and the use of
// `this.state`.

import React, { Component } from "react";
import { Form, Input, Select, Button, message } from "antd";
import { Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";

class SubmitText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            needsupdate: true,
            datastore: {
                Projects: [{ id: 1, value: "Project" }],
                Users: [{ id: 1, value: "Users" }],
            },
            Files: [{ id: 1 }],
            Wordcount: 0,
            Submissiontext: "",
            buttondisabled: false
        };
    }

    formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 5 }
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 12 }
        }
    };

    commentsLayout = {
        labelCol: {
            xs: { span: 48 },
            sm: { span: 5 }
        },
        wrapperCol: {
            xs: { span: 48 },
            sm: { span: 12 }
        }
    };

    // When the component is displayed on screen, this function queries the entries for the
    // dropdown menus from the server.
    async getData() {
        const data = await fetch(this.props.api + "/getdata");
        const response = await data.json();
        this.setState({
            needsupdate: false,
            datastore: {
                Projects: response.Projects,
                Users: response.Users,
            }
        });
        // `this.setstate` is used for updating data stored in `this.state`. When this 
        //happens, any part of  the frontend that uses this data is automatically updated.
    }

    // When pressing the "Submit" button, this function collects the form entries and sends
    // them to the server.
    // Both this function and `getData` are asynchronous, and show different styles.
    onFinish = (values) => {
        fetch(this.props.api + "/formsubmit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...values.TS,
                Wordcount: this.state.Wordcount,
                Submissiontext: this.state.Submissiontext
            })
        }).then((res) => {
            if (!res.ok) {
                this.declined();
            } else {
                this.success();
                this.setState({ buttondisabled: true });
            }
        });
    };

    // Stick to this general style of function definitions via `name = (var) => {}`.
    // Javascript allows to define functions in many different ways, however every variant
    // might have different scoping rules, not necessarily giving access to state variables
    // in `this.state`.
    onFileUpload = (info) => {
        const { status } = info.file;
        if (status !== "uploading") {
            this.setState({ Files: info.fileList });
        }
        if (status === "done") {
            message.success(`${info.file.name} file analysed successfully.`);
            this.setState({
                Wordcount: info.file.response.Wordcount,
                Submissiontext: info.file.response.Submissiontext
            });
        } else if (status === "error") {
            message.error(`${info.file.name} file analysis failed.`);
        }
    };

    success = () => {
        message.success("Form Submitted", 5);
    };

    declined = () => {
        message.error("Something went wrong!", 5);
    };

    TextArea = Input;

    propsUpload = {
        name: ["ST", "file"],
        multiple: false,
        action: this.props.api + "/filesubmit",
        method: "POST",
        onChange: this.onFileUpload,
        labelCol: {
            xs: { span: 24 },
            sm: { span: 5 }
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 12 }
        }
    };

    render() {
        // Make sure to only fetch the data once, instead of in an infinite loop.
        if (this.state.needsupdate) {
            this.getData();
        }
        return (
            <Form
                id="TextSubmit"
                onFinish={this.onFinish}
            >
                <Form.Item
                    {...this.formItemLayout}
                    label="User"
                    name={["TS", "User"]}
                >
                    <Select {...this.formItemLayout}>
                        {this.state.datastore.Users.map((dict) => (
                            <Select.Option key={dict.id} value={dict.id}>
                                {dict.value}
                            </Select.Option>
                        ))}
                        ;
                    </Select>
                </Form.Item>

                <Form.Item
                    {...this.formItemLayout}
                    label="Project"
                    name={["TS", "Project"]}
                >
                    <Select {...this.formItemLayout}>
                        {this.state.datastore.Projects.map((dict) => (
                            <Select.Option key={dict.id} value={dict.id}>
                                {dict.value}
                            </Select.Option>
                        ))}
                        ;
                    </Select>
                </Form.Item>

                <Form.Item
                    {...this.commentsLayout}
                    label="Comment"
                    name={["TS", "Comment"]}
                >
                    <this.TextArea
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        placeholder="Comment"
                        id="comment"
                    />
                </Form.Item>

                <Form.Item {...this.formItemLayout} label="Upload File">
                    <Upload
                        {...this.propsUpload}
                        bodyStyle={{ backgroundColor: "#e6f7ff" }}
                    >
                        <p
                            className="ant-upload-drag-icon"
                            style={{
                                fontSize: 30,
                                color: "#40a9ff",
                                textAlign: "center",
                                backgroundColor: "#e6f7ff"
                            }}
                        >
                            <InboxOutlined />
                        </p>
                        <p
                            className="ant-upload-text"
                            style={{
                                color: "#40a9ff",
                                textAlign: "center",
                                backgroundColor: "#e6f7ff"
                            }}
                        >
                            Click or drag files to this area to upload a text file.
                        </p>
                        <p className="ant-upload-hint"> </p>
                    </Upload>
                </Form.Item>

                <Form.Item
                    {...this.formItemLayout}
                    label="Word Count"
                    name={["TS", "WordCount"]}
                >
                    {this.state.Wordcount}
                </Form.Item>

                <Form.Item>
                    <Button
                        form="TextSubmit"
                        key="submit"
                        type="primary"
                        htmlType="submit"
                        disabled={this.state.buttondisabled}
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export default SubmitText;
