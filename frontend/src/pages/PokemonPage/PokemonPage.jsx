import { observer } from 'mobx-react-lite';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import './PokemonPage.css'
import { Button } from '@mui/material';
import { useNavigate } from "react-router-dom";

const PokemonPage = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [pokemon, setPokemon] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    setIsLoading(true);

    try {
      fetch(`http://localhost:8080/search?id=${params.id}`)
      .then((response) => response.json())
      .then((result) => {
        setPokemon(result);
        setIsLoading(false)
      })
    } catch {
      console.log('error fetch');
    }
  }, [params.id]);

  const onButtonClick = () => {
    navigate(`/fight`);
  }

  return (
    <div className={'container'}>
      {isLoading ? 'Загрузка' : (
        <div className={'info'}>
          <div>{'ID: '}{pokemon.id}</div>
          <div>{'Name: '}{pokemon.name}</div>
          <div>{'Height: '}{pokemon.height}</div>
          <div>{'Weight: '}{pokemon.weight}</div>
          <div>{'Exp: '}{pokemon.base_experience}</div>
          <Button variant="outlined" onClick={onButtonClick}>{'Fight'}</Button>
        </div>
      )}
    </div>
  )
}

export default observer(PokemonPage)