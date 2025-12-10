import CloudSunSvg from "../../assets/cloudSunSvg";
import './index.css';


const WeatherComponent = () => {
    return (
        <div className="weatherCntnr">
            <div><p className="currentWeatherTxt">Current Weather</p></div>
            <div className="tempCntnr">
                <CloudSunSvg/>
                <div><p>190C</p></div>
            </div>

            <div className="tempRangeCntnr">
                <p>High:</p>
                <p>Low:</p>
            </div>

        </div>
    )
}

export default WeatherComponent
