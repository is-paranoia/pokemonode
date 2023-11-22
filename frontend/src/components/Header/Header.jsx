import {SearchPokemon} from "@components";
import { observer } from 'mobx-react-lite';
import authStore from '@stores/AuthStore';
import './Header.scss'

const Header = () => {
    return (
        <div className={'header'}>
            <h1>PokeBun</h1>
            <div className="searchArea">
                <SearchPokemon />
            </div>
            <div>{authStore.isAuthenticated && authStore.user.name}</div>
        </div>
    )
};

export default observer(Header);