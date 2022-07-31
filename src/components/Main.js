import { Row, Col } from 'antd';
import SatSetting from "./SatSetting";
import SatelliteList from "./SatelliteList";

function Main() {
    return (
        <Row className='main'>
            <Col span={8} className="left-side">
                <SatSetting />
                <SatelliteList />
            </Col>
            <Col span={16} className="right-side">
                right
            </Col>
        </Row>
    )
}

export default Main;