import {PokemonsList, Header} from '@components'

export default function Home() {
  return (
    <main className={'main'}>
      <Header />
      <PokemonsList />
    </main>
  )
}
