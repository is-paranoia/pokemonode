import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {Header, PokemonsList} from '@components';
import {LoginPage, RegisterPage, PokemonPage} from '@pages';
import { Provider } from 'mobx-react';
import authStore from '@stores/AuthStore';
import './App.css';

const App = () => {

  return (
    <Provider authStore={authStore}>
      <div className="app">
        <Header />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PokemonsList />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/pokemon/:id" element={<PokemonPage />} />
            {authStore.isAuthenticated && <Route path="/fight" element={<PokemonPage />} />}
          </Routes>
        </BrowserRouter>
      </div>
    </Provider>
  )
}

export default App
