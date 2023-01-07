"use strict";

search.addEventListener("input", filterPokemons);

async function filterPokemons() {
  const searchInput = search.value.toLowerCase();
  filteredPokemons = [];
  pokemonsAreFiltered = true;
  if (!searchInput) {
    pokemonsAreFiltered = false;
    filteredPokemons = [];
    renderAllPokemons(1);
    return;
  }
  for (let pokemon of allPokemons)
    if (pokemon.name.includes(searchInput)) filteredPokemons.push(pokemon);

  renderFilteredPokemons();
}

function renderFilteredPokemons() {
  pokeCardContainer.innerHTML = "";
  for (let pokemon of filteredPokemons)
    pokeCardContainer.innerHTML += createPokeCardHtml(pokemon.id);
}
