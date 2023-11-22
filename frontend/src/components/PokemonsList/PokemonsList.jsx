import { Card, Skeleton, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import "./PokemonsList.scss";
import {PokemonCard} from "@components";

const PokemonsList = (props) => {
    const {searchedPokemons} = props;

    const [isLoading, setIsLoading] = useState(true);
    const [pokemons, setPokemons] = useState([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);

    const handleChange = (event, value) => {
        setPage(value);
    };

    useEffect(() => {
        setIsLoading(true);

        try {
            fetch(`http://localhost:8080/pokemon/list?page=${page}`)
            .then((response) => response.json())
            .then((result) => {
                const {
                    count,
                    pokemons
                } = result
                setPokemons(pokemons)
                setCount(count)
                setIsLoading(false)
            })
        } catch {
            console.log('error fetch');
        }
    }, [page]);


    return (
        <div className={'pokemonsPaginated'}>
            <div className={'pokemonsList'}>
                {isLoading ? <Skeleton height={"200px"} width={"200px"} variant="rectangular"/> : 
                pokemons?.map((pokemon, index) => {
                    return (
                        <PokemonCard
                            key={index}
                            pokemon={pokemon}
                        />
                    )
                })}
            </div>
            <div className={'paginationBlock'}>
                <Pagination count={Math.ceil(count / 10)} page={page} shape="rounded" onChange={!isLoading && handleChange} color="primary"/>
            </div>
        </div>
    )
};

export default PokemonsList;