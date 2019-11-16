import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { ReactComponent as DayCloudyIcon } from "./images/day-cloudy.svg";
import { ReactComponent as DayClearIcon } from "./images/day-clear.svg";
import { ReactComponent as DayCloudyFogIcon } from "./images/day-cloudy-fog.svg";
import { ReactComponent as DayPartiallyClearWithRainIcon } from "./images/day-partially-clear-with-rain.svg";
import { ReactComponent as DaySnowingIcon } from "./images/day-snowing.svg";
import { ReactComponent as DayThunderStormIcon } from "./images/day-thunderstorm.svg";
import { ReactComponent as NightClearIcon } from "./images/night-clear.svg";
import { ReactComponent as NightCloudyIcon } from "./images/night-cloudy.svg";
import { ReactComponent as NightCloudyFogIcon } from "./images/night-cloudy-fog.svg";
import { ReactComponent as NightPartiallyClearWithRainIcon } from "./images/night-partially-clear-with-rain.svg";
import { ReactComponent as NightSnowingIcon } from "./images/night-snowing.svg";
import { ReactComponent as NightThunderStormIcon } from "./images/night-thunderstorm.svg";

const IconContainer = styled.div`
  flex-basis: 30%;
  svg {
    max-height: 110px;
  }
`;

const weatherTypes = {
  isThunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
  isClear: [1],
  isCloudyFog: [25, 26, 27, 28],
  isCloudy: [2, 3, 4, 5, 6, 7],
  isFog: [24],
  isPartiallyClearWithRain: [
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    19,
    20,
    29,
    30,
    31,
    32,
    38,
    39
  ],
  isSnowing: [23, 37, 42]
};

const weatherIcons = {
  day: {
    isThunderstorm: <DayThunderStormIcon />,
    isClear: <DayClearIcon />,
    isCloudyFog: <DayCloudyFogIcon />,
    isCloudy: <DayCloudyIcon />,
    isFog: <DayCloudyFogIcon />,
    isPartiallyClearWithRain: <DayPartiallyClearWithRainIcon />,
    isSnowing: <DaySnowingIcon />
  },
  night: {
    isThunderstorm: <NightThunderStormIcon />,
    isClear: <NightClearIcon />,
    isCloudyFog: <NightCloudyFogIcon />,
    isCloudy: <NightCloudyIcon />,
    isFog: <NightCloudyFogIcon />,
    isPartiallyClearWithRain: <NightPartiallyClearWithRainIcon />,
    isSnowing: <NightSnowingIcon />
  }
};

const WeatherIcon = ({ currentWeatherCode, moment }) => {
  let [currentWeatherStr, setCurrentWeatherStr] = useState("isClear");

  useEffect(() => {
    const weatherCode2Type = code =>
      Object.entries(weatherTypes).reduce(
        (currentWeatherType, [weatherType, weatherCodes]) =>
          weatherCodes.includes(Number(code))
            ? weatherType
            : currentWeatherType,
        ""
      );
    const weatherTypeStr = weatherCode2Type(currentWeatherCode);
    setCurrentWeatherStr(weatherTypeStr);
  }, [currentWeatherCode]);

  return (
    <IconContainer>{weatherIcons[moment][currentWeatherStr]}</IconContainer>
  );
};

export default WeatherIcon;
