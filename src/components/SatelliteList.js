import {Button} from "antd";

function SatelliteList() {
    return (
        <div className="sat-list-box">
            <div className="btn-container">
                <Button
                    className="sat-list-btn"
                    size="large"
                >Track on the map</Button>
            </div>
            <hr/>
            <div>data</div>
        </div>

    )
}

export default SatelliteList;