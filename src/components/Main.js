import {Row, Col, Button, Spin, List, Checkbox, Avatar} from 'antd';
import {SatSetting} from "./SatSetting";
import SatelliteList from "./SatelliteList";
import {useRef, useState} from "react";
import axios from "axios";
import {BASE_URL, STARLINK_CATEGORY, NEARBY_SATELLITE, SAT_API_KEY} from "../constants";

//1. get setting information from SatSetting component
//2. acquire satellite data from n2yo.com
//3. send the satellite data to SatelliteList component to display on the dashboard
function Main() {
    const SatSettingForm = useRef();

    const [satList, setSatList] = useState([]);
    const [settings, setSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const showNearbySatellite = () => {
        //get setting info from SatSetting component
        SatSettingForm.current
            .validateFields()
            .then((setting) => {
                setSettings(setting);
                fetchSatellite(setting);
            })
    }

    const fetchSatellite = (setting) => {
        //get setting info
        const { latitude, longitude, elevation, altitude } = setting;
        console.log()
        const url = `${BASE_URL}/${NEARBY_SATELLITE}/${latitude}/${longitude}/${elevation}/${altitude}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;
        setIsLoading(true);
        //send request to the server and analyze the response
        //case 1: success -> send sat data to SatelliteList component
        //case 2: fail -> inform users
        axios.get(url)
            .then( res => {
                console.log('print received satellites data ->', res.data.above)
                setSatList(res.data.above);
            })
            .catch( error => {
                console.log("error in fetch satellite ->", error);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    const showMap = () => {
        console.log('show on the map');
    }

    const onChange = () => {

    }

    return (
        <Row className='main'>
            <Col span={8} className="left-side">
                <SatSetting
                    ref={SatSettingForm}
                    onShow={showNearbySatellite}
                />
                <SatelliteList
                    satList={satList}
                    isLoading={isLoading}
                />
            </Col>
            <Col span={16} className="right-side">
                right
            </Col>
        </Row>
    )
}

export default Main;