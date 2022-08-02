import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {WORLD_MAP_URL} from "../constants";
import {feature} from "topojson-client";
import { geoKavrayskiy7 } from 'd3-geo-projection';
import { geoGraticule, geoPath } from 'd3-geo';
import { select as d3Select } from 'd3-selection';

const width = 960;
const height = 600;

//WorldMap component used D3 library to show world map on the dashboard
function WorldMap() {
    const refMap = useRef();
    const [map, setMap] = useState(null);

    //similar to class component componentDidMount, only calls once right after component renders
    useEffect(() => {
        axios.get(WORLD_MAP_URL)
            .then((res) => {
                const {data} = res;
                //converting TopoJSON back to GeoJSON for rendering with d3.geoPath
                //"feature" returns the GeoJSON Feature or FeatureCollection for the specified object in the given topology.
                    const land = feature(data, data.objects.countries).features;
                generateMap(land);
            })
    }, [])

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

        let context = canvas.node().getContext("2d");

        //Creates a new geographic path generator with the default settings.
        //Used to create lines, curves, arcs, and more and render to canvas
        let path = geoPath()
            //If projection is specified, sets the current projection.
            .projection(projection)
            // If context is specified, sets the current context.
            .context(context)

        land.forEach( ele => {
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
        })
    }

    return (
        <div className="map.box">
            <canvas className="map" ref={refMap} />
        </div>
    )
}

export default WorldMap;
