import * as React from "react";
import './index.css'
import SearchLogoSvg from "../../assets/searchLogo.tsx"


interface SearchBarProps {
    placeHolder: string,
    onChangeText: (e: React.ChangeEvent<HTMLInputElement>) => void,
    value: string
}

const SearchBar = ({placeHolder, onChangeText, value}: SearchBarProps) => {
    return (
        <div className="searchBarCntnr">
            <div className="searchLogoCntnr"><SearchLogoSvg/></div>
            <div><input className="input" placeholder={placeHolder} value={value} onChange={onChangeText}/></div>

        </div>


    )
}

export default SearchBar
