export interface Pokemon {
  id: string;
  name: string;
  sprite?: string;
}

export interface Generation {
  name: string;
  id: number;
  pokemon: Pokemon[];
}

export interface Ratings {
  [pokemonId: string]: number;
}

export interface Score {
  name: string;
  score: number;
  generation: string;
}
