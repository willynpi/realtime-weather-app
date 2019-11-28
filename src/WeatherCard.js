import React from "react";
import styled from "@emotion/styled";
import { ReactComponent as WindIcon } from "./images/wind.svg";
import { ReactComponent as RainIcon } from "./images/rain.svg";
import { ReactComponent as HumidityIcon } from "./images/humidity.svg";
import { ReactComponent as RefreshIcon } from "./images/refresh.svg";
import { ReactComponent as LoadingIcon } from "./images/loading.svg";
import { ReactComponent as SettingIcon } from "./images/edit.svg";
import WeatherIcon from "./WeatherIcon.js";

const WeatherWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Setting = styled(SettingIcon)`
  fill: ${({ theme }) => theme.textColor};
  position: absolute;
  top: 50px;
  left: 110px;
  width: 15px;
  height: 15px;
  cursor: pointer;
`;

const ThemeSwitch = styled.div`
  width: 60px;
  text-align: center;
  line-height: 1;
  height: 10px;
  border: #ccc 1px solid;
  border-radius: 10px;
  position: absolute;
  top: 10px;
  right: 20px;
  padding: 5px;
  font-size: 5px;
  background: ${({ theme }) => theme.switchBgColor};
  color: ${({ theme }) => theme.switchTextColor};
  cursor: pointer;
`;

const Location = styled.div`
  width: 100%;
  font-size: 1.8rem;
  margin: 0.5rem 0;
  color: ${({ theme }) => theme.titleColor};
`;

const Description = styled.div`
  width: 100%;
  font-weight: 350;
  font-size: 0.9rem;
  margin: 0.5rem 0;
  color: ${({ theme }) => theme.textColor};
`;

const CurrentWeather = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  margin: 0.5rem 0;
`;

const Temperature = styled.span`
  display: block;
  font-size: 5rem;
  font-weight: 320;
  color: ${({ theme }) => theme.temperatureColor};
`;

const Celcius = styled.span`
  font-size: 1.6rem;
  font-weight: 350;
  position: absolute;
`;

const Detail = styled.div`
  display: table-cell;
  vertical-align: middle;
`;

const Wind = styled.div`
  font-size: 0.8rem;
  display: table;
  font-weight: 300;
  margin: 0.5rem 0;
  color: ${({ theme }) => theme.textColor};
  svg {
    width: 25px;
    height: auto;
    margin-right: 20px;
  }
`;

const Rain = styled.div`
  font-size: 0.8rem;
  display: table;
  font-weight: 300;
  margin: 0.5rem 0;
  color: ${({ theme }) => theme.textColor};
  svg {
    width: 25px;
    height: auto;
    margin-right: 20px;
  }
`;

const Humidity = styled.div`
  font-size: 0.8rem;
  display: table;
  margin: 0.5rem 0;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  svg {
    width: 25px;
    height: 25px;
    margin-right: 20px;
  }
`;

const Refresh = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textColor};
`;
const Loading = styled(LoadingIcon)`
  width: 15px;
  height: 15px;
  margin: 0 5px;
  animation: rotate infinite 1.5s linear;
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;
const RefreshBtn = styled(RefreshIcon)`
  width: 15px;
  height: 15px;
  margin: 0 5px;
  cursor: pointer;
`;

const WeatherCard = props => {
    const { 
        weatherElement, 
        moment, 
        chosenTheme, 
        switchTheme, 
        fetchData, 
        setCurrentPage,
        currentLocation 
    } = props;

    const { 
        temperature,
        weatherCode,
        wind,
        comfortability,
        rainPossibility,
        humidity,
        observeTime,
        isLoading
    } = weatherElement;

    return (
        <WeatherWrapper>
            <Location>{currentLocation.cityName}</Location>
            <Setting onClick={()=>setCurrentPage('WeatherSetting')}/>
            <Description>{comfortability}</Description>
            <ThemeSwitch onClick={switchTheme}>
                {chosenTheme === "dark" ? "夜間模式" : "日間模式"}
            </ThemeSwitch>
            <CurrentWeather>
                <Temperature>
                    {Math.round(temperature)}
                    <Celcius>°C</Celcius>
                </Temperature>
                <WeatherIcon
                    currentWeatherCode={weatherCode}
                    moment={moment || "day"}
                />
            </CurrentWeather>
            <Wind>
                <WindIcon />
                <Detail>
                    {wind * 10} m/h
                </Detail>
            </Wind>
            <Rain>
                <RainIcon />
                <Detail>
                    {rainPossibility}%
                </Detail>
            </Rain>
            <Humidity>
                <HumidityIcon />
                <Detail>
                    {humidity * 100}%
                </Detail>
            </Humidity>

            <Refresh onClick={() => fetchData(currentLocation)}>
                最後更新時間:
                {new Intl.DateTimeFormat("zh-TW", {
                    hour: "numeric",
                    minute: "numeric"
                }).format(new Date(observeTime))}
                {" "}
                {isLoading ? <Loading /> : <RefreshBtn />}
            </Refresh>
        </WeatherWrapper>
    );
}

export default WeatherCard;