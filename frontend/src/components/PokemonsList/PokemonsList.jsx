import { Card, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import "./PokemonsList.scss";
import {PokemonCard} from "@components";

const PokemonsList = (props) => {
    const {searchedPokemons} = props;

    const [isLoading, setIsLoading] = useState(true);
    const [pokemons, setPokemons] = useState([]);

    useEffect(() => {
        setIsLoading(true);

        fetch('http://localhost:8080/pokemons')
        .then((response) => response.json())
        .then((result) => {
            setPokemons(result)
            setIsLoading(false)
        })
    }, []);


    return (
        <div className={'pokemonsList'}>
            {isLoading? <Skeleton height={"200px"} width={"200px"} variant="rectangular"/> : 
            pokemons?.map((pokemon, index) => {
                return (
                    <PokemonCard
                        key={index}
                        pokemon={pokemon}
                    />
                )
            })}
        </div>
    )
};

export default PokemonsList;