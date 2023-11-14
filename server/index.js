import express from "express";
import cors from "cors";

const app = express();
//const cors = require("cors")
const port = 8080;

app.use(express.json());
app.use(cors())

app.post("/blog", (req, res) => {
//create new blog post
});

app.get("/", (req, res) => {
    res.send("Api running");
});

app.get("/pokemons", async (req, res) => {
    const {offset, limit} = req.query

    let pokemonsWithNames = [];

    try {
        const pokemonsRaw = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
        const pokemonsJson = await pokemonsRaw.json()

        const pokemons = pokemonsJson.results ?? []

        const pokemonsFilled = await Promise.all(pokemons.map(async (pokemon) => {
            const pokemonDetailsRaw = await fetch(pokemon.url)
            const pokemonsDetailsJson = await pokemonDetailsRaw.json()
            const pokemonDetails = pokemonsDetailsJson ?? {}

            const {id, height, abilities} = pokemonDetails
            const image = pokemonDetails.sprites?.front_default ?? ''

            return {...pokemon, id, height, abilities, image}
        }))

        console.log('pokemonsFilled', pokemonsFilled[0]);
        res.send(pokemonsFilled)
    } catch {
        res.sendStatus(500);
    }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
