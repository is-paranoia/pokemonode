import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchPokemon = (props) => {
    const navigate = useNavigate()
    const {searchedPokemons} = props;

    const [isLoading, setIsLoading] = useState(true);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
      setIsLoading(true);

      console.log('searchText', searchText);
      try {
        fetch(`http://localhost:8080/search?name=${searchText}`)
        .then((response) => response.json())
        .then((result) => {
          if (result.id) {
            console.log('SEARCH', result);
            navigate(`./pokemon/${result.id}`)
            setIsLoading(false)
          }
        })
      } catch {
        console.log('error fetch');
      }
    }, [searchText]);


    return (
        <div className={'searchPokemon'}>
            <TextField
              //onChange={(event) => setSearchText(event.target.value ?? '')}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  setSearchText(event.target.value ?? '')
                }
              }}
              fullWidth={true}
              size="small"
              placeholder="Введите имя покемона..."
            />
        </div>
    )
};

export default SearchPokemon;