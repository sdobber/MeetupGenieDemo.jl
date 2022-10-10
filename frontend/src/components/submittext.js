import React, { Component } from "react";
import { Form, Input, Select, Button, message } from "antd";


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
    }

    onFinish = (values) => {
        fetch(this.props.api + "/formsubmit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...values.TS,
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

    success = () => {
        message.success("Form Submitted", 5);
    };

    declined = () => {
        message.error("Something went wrong!", 5);
    };

    TextArea = Input;

    propsUpload = {
        name: ["TS", "file"],
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
