import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import * as d3 from "d3";
import styled from "styled-components";

import Scatterplot from "./Scatterplot";
import Datapoint from "./Datapoint";
import DashboardContext from "./DashboardContext";
import Descriptor from "./Descriptor";

const Svg = styled.svg`
    width: 100%;
    min-height: 1024px;
    position: absolute;
    left: 0px;
    top: 250px;
`;

const Dataviz = ({ data, width, height }) => (
    <Svg>
        <Scatterplot
            x={80}
            y={40}
            data={data}
            xData={d => d.weight[0]}
            yData={d => d.height[0]}
            entry={({ x, y, breed }) => <Datapoint x={x} y={y} breed={breed} />}
            width={width / 2}
            height={height / 2}
            xLabel="Weight (lbs)"
            yLabel="Height (in)"
            title="Breed weight vs. height"
        />
        <Scatterplot
            x={80}
            y={450}
            data={data}
            xData={d => d.obey}
            yData={d => d.sales}
            entry={({ x, y, breed }) => <Datapoint x={x} y={y} breed={breed} />}
            width={width / 2}
            height={height / 2}
            xLabel="Obey %"
            yLabel="Sales"
            title="Sales v Intelligence"
        />
    </Svg>
);

class App extends Component {
    state = {
        data: null,
        highlightedBreed: null,
        highlightBreed: breed => this.setState({ highlightedBreed: breed }),
        windowWidth: document.body.clientWidth,
        windowHeight: 600
    };

    componentDidMount() {
        Promise.all([
            d3.csv("/data/breed_info.csv", d => ({
                breed: d["Breed"].toLowerCase(),
                height: [
                    Number(d["height_low_inches"]),
                    Number(d["height_high_inches"])
                ],
                weight: [
                    Number(d["weight_low_lbs"]),
                    Number(d["weight_high_lbs"])
                ]
            })),
            d3.csv("/data/dog_intelligence.csv", d => ({
                breed: d["Breed"].toLowerCase(),
                reps: [Number(d["reps_lower"]), Number(d["reps_higher"])],
                obey: Number(d["obey"].replace("%", ""))
            })),
            d3.csv("/data/dog_sales.csv", d => ({
                breed: d["Primary Breed"].toLocaleLowerCase(),
                sales: Number(d["Num2015"])
            }))
        ]).then(([breeds, intelligence, sales]) => {
            const data = d3
                .nest()
                .key(d => d.breed)
                .entries([...breeds, ...intelligence, ...sales])
                .filter(({ values }) => values.length > 1)
                .reduce(
                    (data, { key, values }) => ({
                        ...data,
                        [key]: values.reduce(
                            (obj, entry) => ({ ...obj, ...entry }),
                            {}
                        )
                    }),
                    {}
                );
            this.setState({ data });
        });

        window.onresize = () => {
            this.setState({
                windowWidth: document.body.clientWidth,
                windowHeight: 600
            });
        };
    }

    render() {
        const {
            data,
            highlightedBreed,
            windowWidth,
            windowHeight
        } = this.state;

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro" ref="">
                    <DashboardContext.Provider value={this.state}>
                        {data === null ? (
                            "Loading CSV files ..."
                        ) : (
                            <Dataviz
                                data={data}
                                width={windowWidth}
                                height={windowHeight}
                            />
                        )}
                    </DashboardContext.Provider>
                </p>
            </div>
        );
    }
}

export default App;
