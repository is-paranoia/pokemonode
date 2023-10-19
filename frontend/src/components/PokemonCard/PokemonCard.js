'use client';
import { Card, CardActionArea, CardContent, CardHeader, CardMedia } from "@mui/material";
import { useEffect, useState } from "react";

const PokemonCard = (props) => {
    const {pokemon} = props
    const {
        id,
        name,
        height,
        abilities,
        image
    } = pokemon

    console.log(image);
    //const [pokemons, setPokemons] = useState([]);

    return (
        <Card key={id} sx={{width: '200px', height: '350px'}}>
            <CardHeader title={name} />
            <CardMedia
                component={"img"}
                height={"180"}
                //image={image}
                src={image}
                sx={{border: '1px solid black'}}
            />
            <CardContent sx={{fontSize: '12px'}}>
                <div>Height: {height}</div>
                <div>Abilities:</div>
                {abilities.map((item) => {
                    const {ability, slot} = item
                    const {name} = ability

                    return (
                        <div style={{marginLeft: '12px'}}>{name} {`(${slot})`}</div>
                    )
                })}
            </CardContent>
        </Card>
    )
}

export default PokemonCard;