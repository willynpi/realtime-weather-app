import React from "react";
import ReactDOM from "react-dom";
import WeatherApp from "./WeatherApp.js";
import * as serviceWorker from './serviceWorker';
import "./styles.css";


const rootElement = document.getElementById("root");
ReactDOM.render(<WeatherApp />, rootElement);

serviceWorker.register();