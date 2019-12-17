import React from "react";
import styled from "@emotion/styled";


const ShortCutWrapper = styled.div`
	margin-left: 20px;
	width: 200px;
	position: relative;
	top: -100px;
`

const CityCardWrapper = styled.div`
	border: 1px solid ${({ theme }) => theme.textColor};
	color: ${({ theme }) => theme.textColor};
	padding: 10px;
	margin: 10px 0px;
	cursor: pointer;
`
const ListTitle = styled.div`
	color: ${({ theme }) => theme.textColor};
	padding: 10px;
	border-bottom: 1px solid ${({ theme }) => theme.textColor};
	font-weight: bold;
`

const ShortCutList = props => {
	const {setCurrentCity} = props;
	const cityList = ["臺北市", "臺中市", "花蓮縣"];

	return (
		<ShortCutWrapper>
			<ListTitle>常關注城市</ListTitle>
			{cityList.map(city => (
				<CityCardWrapper onClick={() => setCurrentCity(city)}>
				{city}
				</CityCardWrapper>
			))}
		</ShortCutWrapper>
	);
}


export default ShortCutList;