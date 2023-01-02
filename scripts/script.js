"use strict";

const API_URL_POKEMONS = "https://pokeapi.co/api/v2/pokemon/";
const API_URL_SPECIES = "https://pokeapi.co/api/v2/pokemon-species/"; // to get german names and evolution chains
const API_URL_TYPES = "https://pokeapi.co/api/v2/type/"; //to get german type names

const allPokemons = [];

const body = document.querySelector("body");
const pokeCardContainer = document.querySelector(".poke-card-container");
const pokeDetailCardOverlay = document.querySelector(
  ".poke-detail-card-overlay"
);

// 649 pokemons with images in the set dream-world
// 905 (all) pokemons with images in the set official-artwork
let startPokemon = 1;
let endPokemon = 20;
const loadMorePokemonsCount = endPokemon;
const lastPokemonIndex = 151;
let loadedAllPokemons = false;

let pokemonsAreLoading = false;

let selectedPokeDetailCardMenu = "about";

async function renderPokemons() {
  if (pokemonsAreLoading) return;
  pokemonsAreLoading = true;
  await getPokemons();
  startPokemon += loadMorePokemonsCount;
  endPokemon += loadMorePokemonsCount;
  pokemonsAreLoading = false;
}

async function getPokemons() {
  for (let id = startPokemon; id <= endPokemon; id++) {
    if (loadedAllPokemons) return;
    let pokemon = await loadPokemon(id);
    const species = await loadSpecies(id);
    const evolutionChain = await getEvolutionChainPokemons(
      species.evolution_chain.url
    );
    pokemon.evolutionChain = evolutionChain;
    allPokemons.push(pokemon);
    pokeCardContainer.innerHTML += await createPokeCardHtml(id);
    if (id === lastPokemonIndex) {
      loadedAllPokemons = true;
      endPokemon = lastPokemonIndex;
    }
  }
}

async function loadPokemon(id) {
  const response = await fetch(`${API_URL_POKEMONS}${id}`).catch(errorFunction);
  const pokemonJson = await response.json();
  return pokemonJson;
}

async function loadSpecies(id) {
  const response = await fetch(`${API_URL_SPECIES}${id}`).catch(errorFunction);
  const speciesJson = await response.json();
  return speciesJson;
}

async function loadEvolutionChain(evolutionChainApiUrl) {
  const response = await fetch(`${evolutionChainApiUrl}`).catch(errorFunction);
  const evolutionChainJson = await response.json();
  return evolutionChainJson;
}

async function loadGermanTypeName(id) {
  const response = await fetch(`${API_URL_TYPES}${id}`).catch(errorFunction);
  const typesJson = await response.json();
  return typesJson.names[4].name;
}

function errorFunction() {
  console.log("Fehler aufgetreten");
}

async function getEvolutionChainPokemons(evolutionChainUrl) {
  const evolutionChainResponse = await fetch(evolutionChainUrl);
  const evolutionChain = await evolutionChainResponse.json();
  const pokemonNamesAndIds = [];
  let currentPokemon = evolutionChain.chain;
  while (currentPokemon) {
    const pokemonResponse = await fetch(currentPokemon.species.url);
    const pokemon = await pokemonResponse.json();
    pokemonNamesAndIds.push({
      name: pokemon.name,
      id: pokemon.id,
    });
    currentPokemon = currentPokemon.evolves_to[0];
  }
  return pokemonNamesAndIds;
}

async function openPokeDetailCard(id) {
  pokeDetailCardOverlay.classList.remove("display-none");
  body.classList.add("overflow-hidden");
  pokeDetailCardOverlay.innerHTML = await createPokeDetailCardHtml(id);
  await selectPokeDetailCardMenu(selectedPokeDetailCardMenu, id);
}

// prettier-ignore
async function closePokeDetailCard() {
  const pokeDetailCardOverlay = document.querySelector(".poke-detail-card-overlay");
  pokeDetailCardOverlay.classList.add("display-none");
  body.classList.remove("overflow-hidden");
  pokeDetailCardOverlay.innerHTML = "";
}

async function selectPokeDetailCardMenu(menu, id) {
  const menuItems = document.querySelectorAll(".poke-detail-card-menu");
  for (let menuItem of menuItems) menuItem.classList.remove("active");
  document.querySelector(`#${menu}`).classList.add("active");
  selectedPokeDetailCardMenu = menu;
  const pokeDetailCardInfos = document.querySelector("#poke-detail-card-infos");
  pokeDetailCardInfos.innerHTML = await createPokeDetailCardContent(id);
  showHideMenuContent(menu);
}

// prettier-ignore
async function showHideMenuContent(menu) {
  const pokeDetailCardInfosContainer = document.querySelectorAll(".poke-detail-card-infos-container");
  for (let pokeDetailCardInfo of pokeDetailCardInfosContainer) {
    pokeDetailCardInfo.classList.remove("display-none");
    pokeDetailCardInfo.classList.add("display-none");
  }
  document.querySelector(`.poke-detail-card-infos-${menu}`).classList.remove("display-none");
}

async function previousPokemon(id) {
  if (id === 0) id = endPokemon - loadMorePokemonsCount;
  await openPokeDetailCard(id);
}

async function nextPokemon(id) {
  if (id > lastPokemonIndex) {
    id = 1;
  } else if (id > allPokemons.length) {
    await renderPokemons();
  }
  await openPokeDetailCard(id);
}

renderPokemons();

pokeDetailCardOverlay.addEventListener("click", function (e) {
  if (e.target !== this) {
    return;
  }
  closePokeDetailCard();
});

// prettier-ignore
document.addEventListener("keydown", function (e) {
  if (!pokeDetailCardOverlay.classList.contains("display-none") && e.key === "Escape")
    closePokeDetailCard();
  if (!pokeDetailCardOverlay.classList.contains("display-none") && e.key === "ArrowLeft")
    previousPokemon(getPokemonId() - 1);
  if (!pokeDetailCardOverlay.classList.contains("display-none") && e.key === "ArrowRight")
    nextPokemon(getPokemonId() + 1);
});

function getPokemonId() {
  return Number(
    document.querySelector("#poke-detail-card").classList[1].split("-")[2]
  );
}
