
import { useState, useCallback } from "react";

const fetchBasicData = locationName => {
	console.log(locationName)
	return fetch(
	  "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-8F311287-293C-4300-ADEB-092399F40CB8&limit=10&locationName="+locationName+"&parameterName="
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

const fetchExtraData = cityName => {
	return fetch(
		"https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-8F311287-293C-4300-ADEB-092399F40CB8&locationName="+cityName
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


const useWeatherAPI = () => {
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

	const fetchData = useCallback(currentLocation => {
		const fetchingData = async currentLocation => {
			const [baseData, extraData] = await Promise.all([
				fetchBasicData(currentLocation.locationName),
				fetchExtraData(currentLocation.cityName)
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
		fetchingData(currentLocation);
	}, []);

  return [weatherElement, fetchData];
}

export default useWeatherAPI;