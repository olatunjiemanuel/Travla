import CustomButton from "../CustomButton";
import './index.css'

interface DestinationCardProps {
    city: string,
    country: string
}

const DestinationCard = ({city, country}: DestinationCardProps) => {
    return (
        <div className="destinationCardCntnr">
            <div className="imgCntnr"></div>
            <div className="destinationCntnr">
                <p className="cityText">{city}</p>
                <p>{country}</p>
            </div>
            <div className="btnCntnr">
                <CustomButton buttonName="View"/>
            </div>
        </div>
    )
}

export default DestinationCard
