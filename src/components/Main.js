import {Row, Col, Button, Spin, List, Checkbox, Avatar} from 'antd';
import {SatSetting} from "./SatSetting";
import SatelliteList from "./SatelliteList";
import {useRef, useState} from "react";
import axios from "axios";
import {BASE_URL, STARLINK_CATEGORY, NEARBY_SATELLITE, SAT_API_KEY} from "../constants";
import WorldMap from "./WorldMap";

//1. get setting information from SatSetting component
//2. acquire satellite data from n2yo.com
//3. send the satellite data to SatelliteList component to display on the dashboard
//4. select satellites displayed on the dashboard and track them in the world map
function Main() {
    const SatSettingForm = useRef();

    //satellites list to display on the dashboard
    const [satList, setSatList] = useState([]);
    //settings acquired from SatSetting component based on user input
    const [settings, setSettings] = useState(null);
    //loading the nearby satellites based on settings
    const [isLoading, setIsLoading] = useState(false);
    //selected satellites to show on the world map
    const [selectedList, setSelectedList] = useState([]);

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

    const showMap = (selected) => {
        setSelectedList([...selectedList, selected]);
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
                    onShowMap={showMap}
                />
            </Col>
            <Col span={16} className="right-side">
                <WorldMap
                    satData={selectedList}
                    observerData={settings}
                />
            </Col>
        </Row>
    )
}

export default Main;