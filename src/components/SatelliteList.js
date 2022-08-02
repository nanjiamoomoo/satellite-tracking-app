import {Avatar, Button, Checkbox, List, Spin} from "antd";
import satellite from "../assets/images/satellite.svg";
import {useState} from "react";

//Display Satellites
function SatelliteList(props) {
    const {isLoading} = props;
    const [selected, setSelected] = useState([]);


    const onChange = (e) => {
        const {satelliteDataInfo, checked} = e.target;
        const satelliteList = addOrRemove(satelliteDataInfo, checked, selected);
        setSelected(satelliteList);

    }

    const addOrRemove = (item, status, list) => {
        const found = list.some(entry => entry.satid === item.satid);
        if (status && !found) {
            list = [...list, item];
        }
        if (!status && found) {
            list = list.filter(entry => entry.satid !== item.satid)
        }
        return list;
    }

    const onShowSatMap = () => {
        props.onShowMap(selected);
    }

    return (
        <div className="sat-list-box">
            <div className="btn-container">
                <Button
                    className="sat-list-btn"
                    type="primary"
                    disabled={selected.length === 0}
                    onClick={onShowSatMap}
                >Track on the map</Button>
            </div>
            <hr/>
            {
                isLoading ?
                    <div className="spin-box">
                        <Spin tip="Loading..." size="large"/>
                    </div>
                    :
                    <List className="sat-list"
                          itemLayout="horizontal"
                          size="small"
                          dataSource={props.satList}
                          renderItem={item => {
                              return (
                                  <List.Item
                                      actions={[<Checkbox onChange={onChange} satelliteDataInfo={item}/>]}
                                  >
                                      <List.Item.Meta
                                          avatar={<Avatar size={50} src={satellite}/>}
                                          title={<p>{item.satname}</p>}
                                          description={`Launch Date: ${item.launchDate}`}
                                      />

                                  </List.Item>
                              )
                          }
                          }
                    />
            }
        </div>
    )
}

export default SatelliteList;