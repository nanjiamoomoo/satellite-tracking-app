import React, {useRef} from "react";
import {Form, InputNumber, Button} from "antd";

export const SatSetting = React.forwardRef( (props, ref) => {

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 11},
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 13},
        },
    };

    return (
        <Form
            ref={ref}
            {...formItemLayout}
            className="sat-setting"
            onFinish={props.onShow}
        >
            <Form.Item label="Latitude(degrees)">
                <Form.Item
                    name="longitude"
                    noStyle
                    rules={[{required: true, message: 'Please input your Longitude!'}]}
                    initialValue={70}
                >
                    <InputNumber
                        min={-180} max={180}
                        style={{width: "100%"}}
                        placeholder="Please input Longitude"
                    />
                </Form.Item>
            </Form.Item>


            <Form.Item label="Latitude(degrees)">
                <Form.Item
                    name="latitude"
                    noStyle
                    rules={[{required: true, message: 'Please input your Latitude!'}]}
                    initialValue={-40}
                >
                    <InputNumber
                        min={-90} max={90}
                        style={{width: "100%"}}
                        placeholder="Please input Latitude"
                    />
                </Form.Item>
            </Form.Item>

            <Form.Item label="Elevation(meters)">
                <Form.Item
                    name="elevation"
                    noStyle
                    rules={[{required: true, message: 'Please input your elevation!'}]}
                    initialValue={100}
                >
                    <InputNumber
                        min={-413} max={8850}
                        style={{width: "100%"}}
                        placeholder="Please input Elevation"
                    />
                </Form.Item>
            </Form.Item>

            <Form.Item label="Altitude(degrees)">
                <Form.Item
                    name="altitude"
                    noStyle
                    rules={[{required: true, message: 'Please input your Altitude!'}]}
                    initialValue={90}
                >
                    <InputNumber
                        min={0} max={90}
                        style={{width: "100%"}}
                        placeholder="Please input Altitude"
                    />
                </Form.Item>
            </Form.Item>

            <Form.Item label="Duration(secs)">
                <Form.Item
                    name="duration"
                    noStyle
                    rules={[{required: true, message: 'Please input your Duration!'}]}
                    initialValue={10}
                >
                    <InputNumber
                        min={0} max={90}
                        style={{width: "100%"}}
                        placeholder="Please input Duration"
                    />
                </Form.Item>
            </Form.Item>

            <Form.Item
                className="show-nearby"
            >
                <Button
                    type="primary"
                    htmlType="submit"
                    style={{textAlign: "center"}}
                >
                    Find Nearby Satellite
                </Button>
            </Form.Item>
        </Form>
    )
});
