import 'dotenv/config';
import express from "express";
import cors from "cors";
import redis from 'redis';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// const REDIS = redis.createClient({
//     socket: {
//         host: 'redis',
//         port: process.env.REDIS_PORT
//     }
// });
// REDIS.on('error', (err) => console.log('Redis Client Error', err));

// const connectRedis = async () => {
//     await REDIS.connect();
// }

// connectRedis()


import knex from 'knex';
import configs from './knexfile.js';
export const db = knex(configs);

const app = express();
const port = process.env.MAIN_SERVER_PORT;

app.use(express.json());
app.use(cors())

app.get("/", (req, res) => {
    res.send("Api running");
});

app.get("/pokemon/list", async (req, res) => {
    const {page} = req.query
    const offset = 10 * (page-1)
    const limit = 10
    const pokemonsCacheKey = `pokemons-${offset}-${limit}`
    console.log(pokemonsCacheKey);

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
                JSON.stringify({count: pokemonsJson.count, pokemons: pokemonsFilled}),
                'EX', 60
            );
            await REDIS.expire(pokemonsCacheKey, 60)
        }
        res.status(200).json({count: pokemonsJson.count, pokemons: pokemonsFilled})
    } catch {
        res.sendStatus(500);
    }
});

app.get("/fight", async (req, res) => {
    const {left, right} = req.query
    console.log('left right', left, right);

    try {
        const pokemonLeft = async () => {
            const pokemonLeftRaw = await fetch(`https://pokeapi.co/api/v2/pokemon/${left}`)
            const pokemonLeftJson = await pokemonLeftRaw.json()
            const {id, height, abilities} = pokemonLeftJson
            const image = pokemonLeftJson.sprites?.front_default ?? ''

            return {...pokemonLeftJson, id, height, abilities, image}
        }

        const pokemonRight = async () => {
            const pokemonRightRaw = await fetch(`https://pokeapi.co/api/v2/pokemon/${right}`)
            const pokemonRightJson = await pokemonRightRaw.json()
            const {id, height, abilities} = pokemonRightJson
            const image = pokemonRightJson.sprites?.front_default ?? ''
    
            return {...pokemonRightJson, id, height, abilities, image}
        }

        const leftInfo = await pokemonLeft()
        const rightInfo = await pokemonRight()
        
        res.status(200).json({left: leftInfo, right: rightInfo})
    } catch {
        res.sendStatus(500);
    }
});

app.post("/fight/result", async (req, res) => {
    const data = req.body

    const {
        leftPokemon,
        rightPokemon
    } = data

    let rightHP = 30
    let leftHP = 30
    let fightIsOver = false
    let history = []

    const leftPokemonHit = () => {
        const damage = Math.floor(Math.random() * 11)
        console.log('damage', damage);
        rightHP = rightHP - damage
        history = [...history, {name: leftPokemon.name, damage: damage}]
    }
    
    const rightPokemonHit = () => {
        const damage = Math.floor(Math.random() * 11)
        console.log('damage', damage);
        leftHP = leftHP - damage
        history = [...history, {name: rightPokemon.name, damage: damage}]
    }

    let rounds = 0
    while (!fightIsOver) {
        leftPokemonHit()
        rightPokemonHit()
        rounds++

        if (leftHP <= 0 || rightHP <= 0) {
            fightIsOver = true
        }
    }

    let winner_pokemon_id
    if (leftHP >= rightHP) {
        winner_pokemon_id = leftPokemon.id
    } else {
        winner_pokemon_id = rightPokemon.id
    }

    try {
        await db('fights').insert({
            first_pokemon_id: leftPokemon.id,
            second_pokemon_id: rightPokemon.id,
            winner_pokemon_id,
            rounds
        });
        res.status(200).json({message: 'Fight complete!', history: history});
    } catch {
        res.status(500).json({message: 'Fight failed', history: history});
    }
});

app.get("/search", async (req, res) => {
    const {id, name} = req.query

    try {
        const pokemonRaw = await fetch(`https://pokeapi.co/api/v2/pokemon/${id || name}`)
        const pokemonJson = await pokemonRaw.json()

        //const pokemons = pokemonsJson.results ?? []

        // const pokemonsFilled = await Promise.all(pokemons.map(async (pokemon) => {
        //     const pokemonDetailsRaw = await fetch(pokemon.url)
        //     const pokemonsDetailsJson = await pokemonDetailsRaw.json()
        //     const pokemonDetails = pokemonsDetailsJson ?? {}

        //     const {id, height, abilities} = pokemonDetails
        //     const image = pokemonDetails.sprites?.front_default ?? ''

        //     return {...pokemon, id, height, abilities, image}
        // }))

        //console.log('pokemonsFilled', pokemonsFilled[0]);

        res.status(200).json(pokemonJson)
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

app.post("/register", async (req, res) => {
    const data = req.body

    const {
        name,
        email,
        password
    } = data

    try {
        if (name && email && password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const token = jwt.sign({name, hashedPassword}, process.env.SECRET);
            
            console.log('data', data);
            console.log('hashedPassword', hashedPassword);
            console.log('jwt', token);

            // Insert user into the database
            await db('users').insert({
                name,
                email,
                password: hashedPassword
            });
            res.status(201).json({message: 'Registered', registered: true});
        }
    } catch {
        res.status(500).json({message: 'Registration failed', registered: false});
    }
});

app.post("/login", async (req, res) => {
    const data = req.body
    const {
        name,
        password
    } = data

    try {
      // Retrieve the user from the database
      const user = await db('users').where({name}).first();
  
      // Check if the user exists
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      // Check if the passwords match
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      // Passwords match, user is authenticated
      const {id} = user;
      const token = jwt.sign({id, name}, process.env.SECRET, {expiresIn: '1h'});
      res.header('Authorization', `Bearer ${token}`);
      res.status(200).json({message: 'Login successful', id, name, token});
    } catch (error) {
      res.status(500).json({message: 'Internal Server Error'});
    }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
  console.log(`Redis Port ${process.env.REDIS_PORT}!`);
});

export default app;