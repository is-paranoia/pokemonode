import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {Header, PokemonsList} from '@components';
import {LoginPage, RegisterPage, PokemonPage, FightPage} from '@pages';
import { Provider } from 'mobx-react';
import authStore from '@stores/AuthStore';
import './App.css';

const App = () => {

  return (
    <Provider authStore={authStore}>
       <BrowserRouter>
        <div className="app">
          <Header />
          <Routes>
            <Route path="/" element={<PokemonsList />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/pokemon/:id" element={<PokemonPage />} />
            <Route path="/fight/:pokemonId" element={<FightPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  )
}

export default App
