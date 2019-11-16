import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled from "@emotion/styled";
import { ThemeProvider } from "emotion-theming";
// import { ReactComponent as CloudyIcon } from "./images/day-cloudy.svg";
import { ReactComponent as WindIcon } from "./images/wind.svg";
import { ReactComponent as RainIcon } from "./images/rain.svg";
import { ReactComponent as HumidityIcon } from "./images/humidity.svg";
import { ReactComponent as RefreshIcon } from "./images/refresh.svg";
import { ReactComponent as LoadingIcon } from "./images/loading.svg";
import WeatherIcon from "./WeatherIcon.js";
import sunriseAndSunsetData from "./sunrise-sunset.json";

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
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
const ThemeSwitch = styled.div`
  width: 60px;
  text-align: center;
  line-height: 1;
  height: 10px;
  border: #ccc 1px solid;
  border-radius: 10px;
  position: absolute;
  top: 0.5rem;
  right: 20px;
  padding: 5px;
  font-size: 5px;
  background: ${({ theme }) => theme.switchBgColor};
  color: ${({ theme }) => theme.switchTextColor};
  cursor: pointer;
`;
const theme = {
  light: {
    backgroundColor: "#cecece",
    foregroundColor: "#f4f4f4",
    boxShadow: "0 1px 3px 0 #555",
    titleColor: "#222",
    temperatureColor: "#757575",
    textColor: "#828282",
    switchBgColor: "white",
    switchTextColor: "#828282"
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9f9",
    temperatureColor: "#dddddd",
    textColor: "#cccccc",
    switchBgColor: "#121416",
    switchTextColor: "#f9f9f9"
  }
};
const getMoment = locationName => {
  const location = sunriseAndSunsetData.find(data => {
    return (data.locationName = locationName);
  });
  if (!location) return null;

  const now = new Date();
  const nowDate = Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
    .format(now)
    .replace(/\//g, "-");
  const date = location.time.find(data => {
    return (data.dataTime = nowDate);
  });

  const sunriseTimestamp = new Date(
    `${date.dataTime} ${date.sunrise}`
  ).getTime();
  const sunsetTimestamp = new Date(`${date.dataTime} ${date.sunset}`).getTime();
  const nowTimeStamp = now.getTime();
  return nowTimeStamp < sunsetTimestamp && nowTimeStamp > sunriseTimestamp
    ? "day"
    : "night";
};

const WeatherApp = () => {
  console.log("--- invoke function component ---");
  const [chosenTheme, setChosenTheme] = useState("dark");
  const [weatherElement, setWeatherElement] = useState({
    location: "",
    description: "",
    observeTime: new Date(),
    temperature: 0,
    wind: 0,
    humidity: 0,
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: 0,
    isLoading: true
  });

  const fetchData = useCallback(() => {
    const fetchingData = async () => {
      const [baseData, extraData] = await Promise.all([
        fetchBasicData(),
        fetchExtraData()
      ]);
      setWeatherElement({
        ...baseData,
        ...extraData,
        isLoading: false
      });
    };
    setWeatherElement(prevState => ({
      ...prevState,
      isLoading: true
    }));
    fetchingData();
  }, []);

  const moment = useMemo(() => getMoment(weatherElement.location), [
    weatherElement.location
  ]);

  useEffect(() => {
    console.log("execute function in useEffect");
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setChosenTheme(moment === "day" ? "light" : "dark");
  }, [moment]);

  const switchTheme = () => {
    console.log("switch");
    setChosenTheme(chosenTheme === "dark" ? "light" : "dark");
  };

  const fetchBasicData = () => {
    return fetch(
      "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-8F311287-293C-4300-ADEB-092399F40CB8&limit=10&locationName=臺北&parameterName="
    )
      .then(response => response.json())
      .then(data => {
        let location = data.records.location[0];

        let currentData = location.weatherElement.reduce((currentData, el) => {
          if (["WDSD", "TEMP", "HUMD"].includes(el.elementName)) {
            currentData[el.elementName] = el.elementValue;
          }
          return currentData;
        }, {});
        return {
          location: location.locationName,
          temperature: currentData.TEMP,
          observeTime: location.time.obsTime,
          wind: currentData.WDSD,
          humidity: currentData.HUMD
        };
      });
  };
  const fetchExtraData = () => {
    return fetch(
      "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-8F311287-293C-4300-ADEB-092399F40CB8&locationName=臺北市"
    )
      .then(response => response.json())
      .then(data => {
        let location = data.records.location[0];
        let weatherData = location.weatherElement;
        let weatherElement = weatherData.reduce((needElements, el) => {
          if (["Wx", "PoP", "CI"].includes(el.elementName)) {
            needElements[el.elementName] = el.time[0].parameter;
          }
          return needElements;
        }, {});
        return {
          description: weatherElement.Wx.parameterName,
          weatherCode: weatherElement.Wx.parameterValue,
          rainPossibility: weatherElement.PoP.parameterName,
          comfortability: weatherElement.CI.parameterName
        };
      });
  };

  const {
    location,
    observeTime,
    temperature,
    wind,
    humidity,
    weatherCode,
    rainPossibility,
    comfortability,
    isLoading
  } = weatherElement;

  return (
    <ThemeProvider theme={theme[chosenTheme]}>
      <Container>
        <WeatherCard>
          <Location>{location}</Location>
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
            
          <Refresh onClick={fetchData}>
            最後更新時間:
            {new Intl.DateTimeFormat("zh-TW", {
              hour: "numeric",
              minute: "numeric"
            }).format(new Date(observeTime))}{" "}
            {isLoading ? <Loading /> : <RefreshBtn />}
          </Refresh>
        </WeatherCard>
      </Container>
    </ThemeProvider>
  );
};

export default WeatherApp;
