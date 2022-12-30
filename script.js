"use strict";

const API_URL_POKEMONS = "https://pokeapi.co/api/v2/pokemon/";
const API_URL_SPECIES = "https://pokeapi.co/api/v2/pokemon-species/"; // to get german names
const API_URL_TYPES = "https://pokeapi.co/api/v2/type/"; //to get german type names

// const allPokemons = [];

const pokeCardContainer = document.querySelector(".poke-card-container");

// 649 pokemons with images in the set dream-world
// 905 (all) pokemons with images in the set official-artwork
let startPokemon = 1;
let endPokemon = 151;
const loadMoreCount = endPokemon;
const loadingEnd = 151;
let loadingComplete = false;

async function renderPokemons() {
  for (let i = startPokemon; i <= endPokemon; i++) {
    if (loadingComplete) return;
    const pokemon = await loadPokemon(i);
    const germanName = await loadGermanName(i);
    pokeCardContainer.innerHTML += await createPokeCardHtml(
      pokemon,
      germanName,
      i
    );
    if (i === loadingEnd) loadingComplete = true;
  }
  startPokemon += loadMoreCount;
  endPokemon += loadMoreCount;
}

async function loadPokemon(id) {
  const response = await fetch(`${API_URL_POKEMONS}${id}`).catch(errorFunction);
  const pokemonJson = await response.json();
  return pokemonJson;
}

async function loadGermanName(id) {
  const response = await fetch(`${API_URL_SPECIES}${id}`).catch(errorFunction);
  const speciesJson = await response.json();
  return speciesJson.names[5].name;
}

async function loadGermanTypeName(id) {
  const response = await fetch(`${API_URL_TYPES}${id}`).catch(errorFunction);
  const typesJson = await response.json();
  return typesJson.names[4].name;
}

function errorFunction() {
  console.log("Fehler aufgetreten");
}

async function createPokeCardHtml(pokemon, germanName, i) {
  return `
        <div class="poke-card ${
          pokemon.types[0].type.name
        }" id="poke-card-${i}">
            <div class="name-id">
            <div class="name">${
              //pokemon.name
              germanName
            }</div>
            <div class="id">#${String(pokemon.id).padStart(3, "0")}</div>
            </div>
            <div class="types-image">
            <div class="types">
                ${await createTypesHtml(pokemon)}
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

async function createTypesHtml(pokemon) {
  const types = pokemon.types;
  let typesHtml = "";
  for (let type of types) {
    const typeId = String(type.type.url).split("/")[6];
    const germanTypeName = await loadGermanTypeName(typeId);
    typesHtml += `
        <div class="type ${type.type.name}-label">${germanTypeName}</div>
    `;
  }
  return typesHtml;
}

renderPokemons();

window.addEventListener("scroll", function () {
  // if (window.scrollY > 500) renderPokemons();
  // console.log("scrollY", window.scrollY);
  // console.log("innerHeigth", window.innerHeight);
  // console.log("offsetHeight", document.body.offsetHeight);
});

function loadContentOnScroll() {
  // Warten, bis der Benutzer den Bildlauf beendet hat
  window.onscroll = function (event) {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      // Laden Sie weiteren Inhalt
      // loadPokemon();

      console.log("innerHeight", window.innerHeight);
      console.log("scrollY", window.scrollY);
      console.log("offsetHeight", document.body.offsetHeight);
    }
  };
}

loadContentOnScroll();
