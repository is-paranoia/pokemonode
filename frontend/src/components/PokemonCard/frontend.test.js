import React from 'react';
import renderer from 'react-test-renderer';
import {describe, expect, test, it, jest} from '@jest/globals';
import PokemonCard from './PokemonCard';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <PokemonCard
        pokemon={
          {
            id: 1,
            name: 'Aboba',
            height: 123,
            abilities: [{ability: {name: 'lolkek'}, slot: 3}],
            image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/14.png'
          }
        }
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

const mockUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
}));