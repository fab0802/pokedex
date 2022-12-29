"use strict";

const API_URL_POKEMONS = "https://pokeapi.co/api/v2/pokemon/";
const API_URL_SPECIES = "https://pokeapi.co/api/v2/pokemon-species/"; // to get german names
const API_URL_TYPES = "https://pokeapi.co/api/v2/type/"; //to get german type names

// const allPokemons = [];

const pokeCardContainer = document.querySelector(".poke-card-container");

let startPokemon = 1;
let endPokemon = 151;

async function renderPokemons() {
  pokeCardContainer.innerHTML = "";
  for (let i = startPokemon; i <= endPokemon; i++) {
    const pokemon = await loadPokemon(i);
    // const germanName = await loadGermanName(i);
    pokeCardContainer.innerHTML += createPokeCardHtml(pokemon, i);
    console.log(i);
  }
}

async function loadPokemon(id) {
  const response = await fetch(`${API_URL_POKEMONS}${id}`).catch(errorFunction);
  const pokemonJson = await response.json();
  //   allPokemons.push(pokemonJson);
  //   console.log(typeof allPokemons);
  return pokemonJson;
}

// async function loadGermanName(id) {
//   const response = await fetch(`${API_URL_SPECIES}${id}`).catch(errorFunction);
//   const speciesJson = await response.json();
//   console.log(speciesJson.names[5].name);
//   return speciesJson.names[5].name;
// }

function errorFunction() {
  console.log("Fehler aufgetreten");
}

function createPokeCardHtml(pokemon, i) {
  return `
        <div class="poke-card ${
          pokemon.types[0].type.name
        }" id="poke-card-${i}">
            <div class="name-id">
            <div class="name">${pokemon.name}</div>
            <div class="id">#${String(pokemon.id).padStart(3, "0")}</div>
            </div>
            <div class="types-image">
            <div class="types">
                ${createTypesHtml(pokemon)}
            </div>
            <div class="image">
                <img
                src="${pokemon.sprites.other.dream_world.front_default}"
                alt="Pokemon image"
                />
            </div>
            </div>
        </div>
    `;
}

function createTypesHtml(pokemon) {
  const types = pokemon.types;
  let typesHtml = "";
  for (let type of types) {
    typesHtml += `
        <div class="type ${type.type.name}">${type.type.name}</div>
    `;
  }
  return typesHtml;
}

renderPokemons();
