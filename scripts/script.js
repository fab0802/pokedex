"use strict";

const API_URL_POKEMONS = "https://pokeapi.co/api/v2/pokemon/";
const API_URL_SPECIES = "https://pokeapi.co/api/v2/pokemon-species/"; // to get evolution chains
const allPokemons = [];
let filteredPokemons = [];
const lastPokemon = 151;
const loadMorePokemonsCount = 24;
let selectedPokeDetailCardMenu = "about";
let pokemonsAreLoading = false;
let pokemonsAreFiltered = false;
const body = document.querySelector("body");
const search = document.querySelector("#search");
const pokeCardContainer = document.querySelector(".poke-card-container");
const pokeDetailCardOverlay = document.querySelector(".poke-detail-card-overlay");
const loadMoreButton = document.querySelector(".load-more-button");

async function init() {
  await loadPokemonsFromApi(1);
  checkIfLoadMoreButtonShouldBeDisplayed();
}

async function loadPokemonsFromApi(startId) {
  if (pokemonsAreLoading) return;
  showLoadingAnimation();
  for (let id = startId; id <= startId + loadMorePokemonsCount - 1; id++) {
    if (id > lastPokemon) {
      renderPokemons(startId);
      hideLoadingAnimation();
      return;
    }
    const apiPokemonJson = await getDataFromApis(id);
    allPokemons.push(apiPokemonJson);
  }
  renderPokemons(startId);
  hideLoadingAnimation();
}

function checkIfLoadMoreButtonShouldBeDisplayed() {
  if (!(document.body.scrollHeight > document.body.clientHeight) && loadMoreButton.classList.contains("display-none")) {
    loadMoreButton.classList.remove("display-none");
  } else if (!loadMoreButton.classList.contains("display-none")) {
    loadMoreButton.classList.add("display-none");
  }
}

async function getDataFromApis(id) {
  const response = await fetch(`${API_URL_POKEMONS}${id}`).catch(errorFunction);
  const apiPokemonJson = await response.json();
  apiPokemonJson.evolutionChain = await getEvolutionChain(apiPokemonJson.id);
  return apiPokemonJson;
}

function showLoadingAnimation() {
  pokemonsAreLoading = true;
  document.querySelector(".loading-animation").classList.remove("display-none");
  document.querySelector("body").classList.add("overflow-hidden");
}

function hideLoadingAnimation() {
  pokemonsAreLoading = false;
  document.querySelector(".loading-animation").classList.add("display-none");
  document.querySelector("body").classList.remove("overflow-hidden");
}

async function getEvolutionChain(id) {
  const evolutionChain = getEvolutionChainJson(id);
  const pokemonNamesAndIds = [];
  let currentPokemon = evolutionChain.chain;
  while (currentPokemon) {
    const pokemonResponse = await fetch(currentPokemon.species.url).catch(errorFunction);
    const pokemon = await pokemonResponse.json();
    pokemonNamesAndIds.push({ name: pokemon.name, id: pokemon.id });
    currentPokemon = currentPokemon.evolves_to[0];
  }
  return pokemonNamesAndIds;
}

async function getEvolutionChainJson(id) {
  const evolutionChainUrl = await loadSpecies(id);
  const evolutionChainResponse = await fetch(evolutionChainUrl);
  const evolutionChain = await evolutionChainResponse.json();
  return evolutionChain;
}

async function loadSpecies(id) {
  const response = await fetch(`${API_URL_SPECIES}${id}`).catch(errorFunction);
  const speciesJson = await response.json();
  const evolutionChain = speciesJson.evolution_chain.url;
  return evolutionChain;
}

function errorFunction() {
  console.log("Fehler aufgetreten");
}

function renderPokemons(startId) {
  for (let id = startId; id <= allPokemons.length; id++) {
    pokeCardContainer.innerHTML += createPokeCardHtml(id);
  }
}

async function loadMorePokemons() {
  if (pokemonsAreFiltered) return;
  const startId = allPokemons.length + 1;
  await loadPokemonsFromApi(startId);
  checkIfLoadMoreButtonShouldBeDisplayed();
}

async function openPokeDetailCard(pokemonId) {
  body.classList.add("overflow-hidden");
  pokeDetailCardOverlay.classList.remove("display-none");
  pokeDetailCardOverlay.innerHTML = await createPokeDetailCardHtml(pokemonId);
}

async function openPokeDetailCard(id) {
  pokeDetailCardOverlay.classList.remove("display-none");
  body.classList.add("overflow-hidden");
  pokeDetailCardOverlay.innerHTML = await createPokeDetailCardHtml(id);
  await selectPokeDetailCardMenu(selectedPokeDetailCardMenu, id);
}

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

async function showHideMenuContent(menu) {
  const pokeDetailCardInfosContainer = document.querySelectorAll(".poke-detail-card-infos-container");
  for (let pokeDetailCardInfo of pokeDetailCardInfosContainer) {
    pokeDetailCardInfo.classList.remove("display-none");
    pokeDetailCardInfo.classList.add("display-none");
  }
  document.querySelector(`.poke-detail-card-infos-${menu}`).classList.remove("display-none");
}

async function previousPokemon(id) {
  if (pokemonsAreLoading) return;
  if (id === 0) id = allPokemons.length;
  await openPokeDetailCard(id);
}

async function nextPokemon(id) {
  if (pokemonsAreLoading) return;
  if (id > lastPokemon) {
    id = 1;
  } else if (id > allPokemons.length) {
    await loadMorePokemons();
    renderPokemons(id);
  }
  await openPokeDetailCard(id);
}

// eventlisteners

pokeDetailCardOverlay.addEventListener("click", function (e) {
  if (e.target !== this) return;
  closePokeDetailCard();
});

document.addEventListener("keydown", keydownEventlistener);

function keydownEventlistener(e) {
  if (!pokeDetailCardOverlay.classList.contains("display-none") && e.key === "Escape") closePokeDetailCard();
  if (!pokeDetailCardOverlay.classList.contains("display-none") && e.key === "ArrowLeft") previousPokemon(getPokemonId() - 1);
  if (!pokeDetailCardOverlay.classList.contains("display-none") && e.key === "ArrowRight") nextPokemon(getPokemonId() + 1);
}

function getPokemonId() {
  return Number(document.querySelector("#poke-detail-card").classList[1].split("-")[2]);
}

window.addEventListener("scroll", scrollEventlistener);

function scrollEventlistener() {
  const currentScrollPosition = window.scrollY + document.body.offsetHeight;
  const totalPageHeight = document.body.scrollHeight;
  if (totalPageHeight - currentScrollPosition <= 50) loadMorePokemons();
}

init();
