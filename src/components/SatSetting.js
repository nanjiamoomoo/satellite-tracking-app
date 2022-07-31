import React, {useRef} from "react";
import {Form, InputNumber, Button, Space, Input} from "antd";

function SatSetting() {
    const decoratedForm = useRef();

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 11 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 13 },
        },
    };

    const showSatellite = (e) => {
        console.log(decoratedForm.current);
        // e.preventDefault();
        //
        // decoratedForm.current.validateFields((err, values) => {
        //     if (!err) {
        //         // console.log('Received values of form: ', values);
        //     }
        // })
    }

    return (
        <Form
            ref={decoratedForm}
            {...formItemLayout}
            className="sat-setting"
            onSubmit={showSatellite}
        >
            <Form.Item label="Longitude(degrees)">
                <Form.Item
                    name="longitude"
                    noStyle
                    rules={[{required: true, message: 'Please input your Longitude!'}]}
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
                    name="longitude"
                    noStyle
                    rules={[{required: true, message: 'Please input your Longitude!'}]}
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
                    name="longitude"
                    noStyle
                    rules={[{required: true, message: 'Please input your Longitude!'}]}
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
                    name="longitude"
                    noStyle
                    rules={[{required: true, message: 'Please input your Duration!'}]}
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
}

export default SatSetting;