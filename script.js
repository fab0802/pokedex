"use strict";

const API_URL_POKEMONS = "https://pokeapi.co/api/v2/pokemon/";
const API_URL_SPECIES = "https://pokeapi.co/api/v2/pokemon-species/"; // to get german names
const API_URL_TYPES = "https://pokeapi.co/api/v2/type/"; //to get german type names

// const pokemons = [];
// const germanNames = [];

const pokeCardContainer = document.querySelector(".poke-card-container");

let startPokemon = 1;
let endPokemon = 20;

async function renderPokemons() {
  pokeCardContainer.innerHTML = "";
  for (let i = startPokemon; i <= endPokemon; i++) {
    const pokemon = await loadPokemon(i);
    const germanName = await loadGermanName(i);
    pokeCardContainer.innerHTML += createPokeCardHtml(pokemon, germanName);
  }
}

async function loadPokemon(id) {
  const response = await fetch(`${API_URL_POKEMONS}${id}`).catch(errorFunction);
  const pokemonJson = await response.json();

  return pokemonJson;
}

async function loadGermanName(id) {
  const response = await fetch(`${API_URL_SPECIES}${id}`).catch(errorFunction);
  const speciesJson = await response.json();
  console.log(speciesJson.names[5].name);
  return speciesJson.names[5].name;
}

function errorFunction() {
  console.log("Fehler aufgetreten");
}

function createPokeCardHtml(pokemon, germanName) {
  return `
        <div class="poke-card grass">
            <div class="name-id">
            <div class="name">${germanName}</div>
            <div class="id">#${String(pokemon.id).padStart(3, "0")}</div>
            </div>
            <div class="types-image">
            <div class="types">
                <div class="type grass">grass</div>
                <div class="type poison">poison</div>
            </div>
            <div class="image">
                <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg"
                alt="Pokemon image"
                />
            </div>
            </div>
        </div>
    `;
}

renderPokemons();
