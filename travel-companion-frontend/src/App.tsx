import {useState} from 'react'
import "./assets/colors.css";
import './App.css'
import SearchBar from './components/SeachBar'
import CustomButton from './components/CustomButton'
import DestinationCard from './components/DestinationCards/DestinationCard'

function App() {
    const [searchValue, setSearchValue] = useState("");
    return (
        <>
            <SearchBar placeHolder="Search for a place to visit ..." value={searchValue} onChangeText={(e) => {
                setSearchValue(e.target.value)
            }}/>
            <CustomButton buttonName="Example"/>
            <DestinationCard city="Paris" country="France"/>
        </>
    )
}

export default App
