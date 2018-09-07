import React from "react";
import * as d3 from "d3";
import styled from "styled-components";

import Axis from "./Axis";

const Heading = styled.text`
    font-weight: bold;
    font-size: 1.4em;
`;

class Scatterplot extends React.Component {
    constructor(props) {
        super(props);

        const data = Object.values(props.data).filter(
            d => d.weight && d.height
        );

        this.state = {
            xScale: d3
                .scaleLinear()
                .domain([0, d3.max(data, props.xData)])
                .range([0, props.width]),
            yScale: d3
                .scaleLinear()
                .domain([0, d3.max(data, props.yData)])
                .range([props.height, 0]),
            data
        };
    }

    static getDerivedStateFromProps(props, state) {
        let { data, filter } = props,
            { xScale, yScale } = state;

        data = Object.values(props.data).filter(d => d.weight && d.height);

        yScale.domain([0, d3.max(data, props.yData)]).range([props.height, 0]);
        xScale.domain([0, d3.max(data, props.xData)]).range([0, props.width]);

        return {
            ...state,
            xScale,
            yScale,
            data
        };
    }

    render() {
        const {
                x,
                y,
                xData,
                yData,
                entry,
                width,
                height,
                xLabel,
                yLabel,
                title
            } = this.props,
            { data, xScale, yScale } = this.state;

        return (
            <g transform={`translate(${x}, ${y})`}>
                {data.map(d =>
                    entry({
                        x: xScale(xData(d)),
                        y: yScale(yData(d)),
                        breed: d.breed
                    })
                )}
                <Heading x={0} y={-10}>
                    {title}
                </Heading>
                <Axis x={0} y={0} scale={yScale} type="Left" label={yLabel} />
                <Axis
                    x={0}
                    y={height}
                    scale={xScale}
                    type="Bottom"
                    label={xLabel}
                />
            </g>
        );
    }
}

export default Scatterplot;
