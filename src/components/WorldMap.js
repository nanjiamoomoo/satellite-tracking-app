import {useEffect, useRef, useState} from "react";
import {Spin} from "antd";
import axios from "axios";
import {feature} from "topojson-client";
import {geoKavrayskiy7} from 'd3-geo-projection';
import {geoGraticule, geoPath} from 'd3-geo';
import {select as d3Select} from 'd3-selection';
import {timeFormat as d3TimeFormat} from "d3-time-format";
import * as d3Scale from "d3-scale";
import {schemeCategory10} from "d3-scale-chromatic";
import {BASE_URL, SAT_API_KEY, SATELLITE_POSITION_URL, WORLD_MAP_URL} from "../constants";

const width = 960;
const height = 600;
const color = d3Scale.scaleOrdinal(schemeCategory10);

//WorldMap component used D3 library to show world map on the dashboard and display the satellites track on the world map using the satellites positions acquired from the server
function WorldMap(props) {
    const refMap = useRef();
    const refTrack = useRef();
    // const preSatData = useRef();

    const [map, setMap] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);

    //similar to class component componentDidMount, only calls once right after component renders
    //get WorldMap data and converts to GeoJSON to render with d3.geoPath
    useEffect(() => {
        axios.get(WORLD_MAP_URL)
            .then((res) => {
                const {data} = res;
                //converting TopoJSON back to GeoJSON for rendering with d3.geoPath
                //"feature" returns the GeoJSON Feature or FeatureCollection for the specified object in the given topology.
                const land = feature(data, data.objects.countries).features;
                generateMap(land);
            })
            .catch((e) => {
                console.log("err in fetch map data ", e.message)
            })
    }, [])

    //acquire each selected satellite positions and track them on the world map
    //this triggers everytime when click on "Track on the map" with different selections
    useEffect(() => {
        const lastIndex = props.satData.length - 1;
        // if (preSatData.current !== props.satData[lastIndex]) {
        if (props.satData.length !== 0) {
            const {latitude, longitude, elevation, duration} = props.observerData;
            const endTime = duration * 60;
            console.log(endTime)
            setIsLoading(true);

            //urls are all promises
            //props.satData[lastIndex] is the latest selected satellite list
            const urls = props.satData[lastIndex].map((sat) => {
                const {satid} = sat;
                const url = `${BASE_URL}/${SATELLITE_POSITION_URL}/${satid}/${latitude}/${longitude}/${elevation}/${endTime}/&apiKey=${SAT_API_KEY}`;
                return axios.get(url);//return promise
            })

            Promise.all(urls)
                .then((res) => {
                    // console.log(res);

                    //get satellite data (including its info and positions) and put them in the arr array
                    const arr = res.map(sat => sat.data);
                    // console.log(arr);
                    if (!isDrawing) {
                        setIsDrawing(true);
                        track(arr);
                    } else {
                        const oHint = document.getElementsByClassName("hint")[0];
                        oHint.innerHTML =
                            "Please wait for these satellite animation to finish before selection new ones!";
                    }
                })
                .catch((e) => {
                    console.log("err in fetch satellite position -> ", e.message);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
        // preSatData.current = props.satData[lastIndex];//preSatData.current stores previous props
    }, [props.satData]);

    const track = (data) => {
        if (data.length === 0 || !data[0].hasOwnProperty("positions")) {
            throw new Error("no position data");
        }

        const len = data[0].positions.length;
        const {context2} = map;

        let now = new Date();
        console.log("now->" + now);
        let i = 0;

        //repeatedly calls the function with a 1000 milliseconds delay
        let timer = setInterval(() => {
            let ct = new Date();
            console.log(ct)

            let timePassed = i === 0 ? 0 : ct - now;
            console.log("time passed ->" + timePassed)
            let time = new Date(now.getTime() + 60 * timePassed);

            //clear context
            context2.clearRect(0, 0, width, height);
            context2.font = "bold 14px sans-serif";
            context2.fillStyle = "#333";
            context2.textAlign = "center";
            context2.fillText(d3TimeFormat(time), width / 2, 10);

            //after track all satellite positions or timePassed the input duration, stop tracking
            if (i >= len) {
                clearInterval(timer);
                setIsDrawing(false);
                const oHint = document.getElementsByClassName("hint")[0];
                oHint.innerHTML = "";
                return;
            }

            // every second and for each position, draw a dot on the map
            data.forEach((sat) => {
                const {info, positions} = sat;
                drawSat(info, positions[i]);
            })

            i += 60;
        }, 1000);
    };

    //draw satellite positions on the world mpa
    const drawSat = (sat, pos) => {
        const {satlongitude, satlatitude} = pos;
        //if there is longitude and latitude info, return
        if (!satlongitude || !satlatitude) return;

        const {satname} = sat;
        const nameWithNumber = satname.match(/\d+/g).join("");

        const {projection, context2} = map;

        //projects the satellite longitude and altitude to the [x, y] coordinates on the canvas
        const xy = projection([satlongitude, satlatitude]);

        context2.fillStyle = color(nameWithNumber);
        context2.beginPath();
        context2.arc(xy[0], xy[1], 4, 0, 2 * Math.PI);
        context2.fill();

        context2.font = "bold 11px sans-serif";
        context2.textAlign = "center";
        context2.fillText(nameWithNumber, xy[0], xy[1] + 14);
    };

    //generate world map on the dashboard
    const generateMap = (land) => {
        //convert a latitude and longitude pair to a pair of X,Y coordinates on our canvas
        const projection = geoKavrayskiy7()
            .scale(170)
            .translate([width / 2, height / 2])
            .precision(.1);

        const graticule = geoGraticule();

        //set up canvas
        const canvas = d3Select(refMap.current)
            .attr("width", width)
            .attr("height", height);

        const canvas2 = d3Select(refTrack.current)
            .attr("width", width)
            .attr("height", height);


        let context = canvas.node().getContext("2d");
        let context2 = canvas2.node().getContext("2d");

        //Creates a new geographic path generator with the default settings.
        //Used to create lines, curves, arcs, and more and render to canvas
        let path = geoPath()
            //If projection is specified, sets the current projection.
            .projection(projection)
            // If context is specified, sets the current context.
            .context(context);

        land.forEach(ele => {
            context.fillStyle = '#B3DDEF';
            context.strokeStyle = '#000';
            context.globalAlpha = 0.7;
            context.beginPath();
            path(ele);
            context.fill();
            context.stroke();

            context.strokeStyle = 'rgba(220, 220, 220, 0.1)';
            context.beginPath();
            path(graticule());
            context.lineWidth = 0.1;
            context.stroke();

            context.beginPath();
            context.lineWidth = 0.5;
            path(graticule.outline());
            context.stroke();
        });
        setMap({
            projection: projection,
            graticule: graticule,
            context: context,
            context2: context2
        });
    };

    return (
        <div className="map-box">
            {
                isLoading ?
                    (
                        <div className="spinner">
                            <Spin tip="Loading..." size="large"/>
                        </div>
                    )
                    :
                    null
            }
            <canvas className="map" ref={refMap}/>
            <canvas className="track" ref={refTrack}/>
            <div className="hint"/>
        </div>
    )
}

export default WorldMap;
