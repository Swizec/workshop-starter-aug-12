import React from "react";
import styled from "styled-components";
import chroma from "chroma-js";

import DashboardContext from "./DashboardContext";

const Circle = styled.circle`
    fill: steelblue;
    fill-opacity: 0.7;
    stroke: steelblue;
    stroke-width: 1.5px;
`;

class Datapoint extends React.Component {
    state = {
        r: 3
    };

    highlight = () => {
        this.setState({ r: 10 });
    };

    unhighlight = () => {
        this.setState({ r: 3 });
    };

    render() {
        const { x, y, breed } = this.props;

        return (
            <DashboardContext.Consumer>
                {({ highlightedBreed, highlightBreed }) => (
                    <Circle
                        cx={x}
                        cy={y}
                        r={highlightedBreed === breed ? 10 : 3}
                        onMouseOver={() => highlightBreed(breed)}
                        onMouseOut={() => highlightBreed(null)}
                    />
                )}
            </DashboardContext.Consumer>
        );
    }
}

export default Datapoint;
