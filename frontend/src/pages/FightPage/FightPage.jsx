import { observer } from 'mobx-react-lite';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import './FightPage.css'
import { Button } from '@mui/material';
import {PokemonCard} from '@components';
import { useForm } from "react-hook-form"

const FightPage = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [leftPokemon, setLeftPokemon] = useState();
  const [rightPokemon, setRightPokemon] = useState();
  const [history, setHistory] = useState([])
  const [rounds, setRounds] = useState(0);
  const [leftHP, setLeftHP] = useState(30);
  const [rightHP, setRightHP] = useState(30);
  const [fightIsOver, setFightIsOver] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  
  useEffect(() => {
    setIsLoading(true);

    try {
        const rightPokemonId = 1
        fetch(`http://localhost:8080/fight?left=${params.pokemonId}&right=${rightPokemonId}`)
        .then((response) => response.json())
        .then((result) => {
          console.log('Fight!', result);
          setLeftPokemon(result.left)
          setRightPokemon(result.right)
          setIsLoading(false)
        })
    } catch {
      console.log('error fetch');
    }
  }, []);

  useEffect(() => {
    
  }, [leftHP]);

  const leftPokemonHit = (inputDamage) => {
    const damage = inputDamage || Math.floor(Math.random() * 11)
    console.log('damage', damage);
    setRightHP(rightHP - damage)
    setHistory((prev) => [...prev, {name: leftPokemon.name, damage: damage}])
  }

  const rightPokemonHit = () => {
    const damage = Math.floor(Math.random() * 11)
    console.log('damage', damage);
    setLeftHP(leftHP - damage)
    setHistory((prev) => [...prev, {name: rightPokemon.name, damage: damage}])
  }

  const onSubmit = (data) => {
    if (fightIsOver) {
        return
    }

    const {damage} = data
    console.log('data fight', data);
    leftPokemonHit(damage)
    rightPokemonHit()
    setRounds(rounds + 1)
  }

  const onAutofightClick = () => {
    setFightIsOver(true)
    try {
        fetch('http://localhost:8080/fight/result', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                leftPokemon: {id: leftPokemon.id, name: leftPokemon.name},
                rightPokemon: {id: rightPokemon.id, name: rightPokemon.name}
            })
        })
        .then((response) => response.json())
        .then((result) => {
            console.log('fight result', result);
            setHistory(result.history)
        })
    } catch {
      console.log('error fetch');
    }
  }

  return (
    <div className={'container'}>
      {isLoading ? 'Загрузка' : (
        <div className={'info'}>
            <div className={'fight'}>
                <PokemonCard pokemon={leftPokemon}/>
                <PokemonCard pokemon={rightPokemon}/>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input placeholder="Введите значение удара..." {...register("damage", { required: true })} />
                {errors.exampleRequired && <span>This field is required</span>}
                <input type="submit" />
            </form>
            <Button variant="outlined" onClick={onAutofightClick}>{'Autofight'}</Button>
            <div className={'history'}>
                <h2>{'История'}</h2>
                {history.map((item, index) => {
                    return (
                        <div key={index}>{item.name}{' ударил на '}{item.damage}</div>
                    )
                })}
            </div>
        </div>
      )}
    </div>
  )
}

export default observer(FightPage)