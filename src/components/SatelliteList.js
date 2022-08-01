import {Avatar, Button, Checkbox, List, Spin} from "antd";
import satellite from "../assets/images/satellite.svg";
import {useEffect} from "react";

//Display Satellites
function SatelliteList(props) {
    const {isLoading} = props;

    const onChange = () => {

    }

    return (
        <div className="sat-list-box">
            <div className="btn-container">
                <Button
                    className="sat-list-btn"
                    size="large"
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
                          dataSource={props.satList}
                          renderItem={item => {
                              return (
                                  <List.Item
                                      actions={[<Checkbox onChange={onChange} dataInfo={item}/>]}
                                  >
                                      <List.Item.Meta
                                          avatar={<Avatar src={satellite}/>}
                                          title={<p>{item.satname}</p>}
                                          description={`Launch Date: ${item.launchDate}`}
                                      />

                                  </List.Item>
                              )}
                          }
                    />
            }
        </div>
    )
}

export default SatelliteList;