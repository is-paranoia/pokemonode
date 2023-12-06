import {SearchPokemon} from "@components";
import { observer } from 'mobx-react-lite';
import authStore from '@stores/AuthStore';
import './Header.scss'
import { useNavigate } from "react-router";

const Header = () => {
    const navigate = useNavigate()
    return (
        <div className={'header'}>
            <h1 onClick={() => navigate('/')}>PokeBun</h1>
            <div className="searchArea">
                <SearchPokemon />
            </div>
            <div>{authStore.isAuthenticated && authStore.user.name}</div>
        </div>
    )
};

export default observer(Header);