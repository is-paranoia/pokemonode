import 'dotenv/config';
import express from "express";
import cors from "cors";
import redis from 'redis';

const REDIS = redis.createClient({
    socket: {
        host: 'redis',
        port: process.env.REDIS_PORT
    }
});
REDIS.on('error', (err) => console.log('Redis Client Error', err));
await REDIS.connect();

const app = express();
const port = process.env.MAIN_SERVER_PORT;

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
    const pokemonsCacheKey = `pokemons-${offset}-${limit}`

    try {
        console.log('req', req.query); // тут запилить по пользователю
        const cachedPokemons = JSON.parse(await REDIS.get(pokemonsCacheKey));
        await REDIS.expire(pokemonsCacheKey, 60)

        if (cachedPokemons) {
            console.log('USED FROM CACHE');
            res.send(cachedPokemons);
            return;
        }
    } catch {
        console.log('Redis cache error!');
    }

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

        //console.log('pokemonsFilled', pokemonsFilled[0]);

        if (pokemonsFilled) {
            console.log('CREATE cachedPokemons');
            await REDIS.set(
                pokemonsCacheKey, 
                JSON.stringify(pokemonsFilled),
                'EX', 60
            );
            await REDIS.expire(pokemonsCacheKey, 60)
        }
        res.send(pokemonsFilled)
    } catch {
        res.sendStatus(500);
    }
});

app.get("/last", async (req, res) => {
    try {
        console.log('chzh');
        const checkRedis = await REDIS.get('last');
        console.log(JSON.parse(checkRedis));
        res.send(JSON.parse(checkRedis))
    } catch {
        res.sendStatus(500);
    }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
  console.log(`Redis Port ${process.env.REDIS_PORT}!`);
});
