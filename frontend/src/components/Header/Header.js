'use client';
import {SearchPokemon} from "@components";
import './Header.scss'

const Header = (props) => {
    return (
        <div className={'header'}>
            <h1>PokeBun</h1>
            <div className="searchArea">
                <SearchPokemon />
            </div>
            <div></div>
        </div>
    )
};

export default Header;