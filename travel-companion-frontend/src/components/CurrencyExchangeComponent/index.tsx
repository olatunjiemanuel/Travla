import './index.css'
import ExchangeLogo from "../../assets/exchangeLogo";

const CurrencyExchangeComponent = () => {
    return (
        <div>
            <div><p>Currency Exchange</p></div>
            <div>
                <p>5</p>
                <ExchangeLogo/>
                <p>10</p>
            </div>

            <div><p>Rate as of today</p></div>
        </div>

    )
}

export default CurrencyExchangeComponent
