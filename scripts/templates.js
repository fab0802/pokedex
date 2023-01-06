"use strict";

function createPokeCardHtml(id) {
  const pokemon = allPokemons[id - 1];
  return `
        <div class="poke-card ${pokemon.types[0].type.name}" id="poke-card-${id}" onclick="openPokeDetailCard(${id})">
          <div class="name-id">
            <div class="name">${pokemon.name}</div>
            <div class="id">#${String(id).padStart(3, "0")}</div>
          </div>
          <div class="types-image">
            <div class="types">
                ${createTypesHtml(pokemon.types)}
            </div>
            <div class="image">
                <img src="${pokemon.sprites.other.dream_world.front_default}" alt="Pokemon image" />
            </div>
          </div>
        </div>
      `;
}

function createTypesHtml(types) {
  let typesHtml = "";
  for (let type of types) {
    typesHtml += `<div class="type ${type.type.name}-label">${type.type.name}</div>`;
  }
  return typesHtml;
}

async function createPokeDetailCardHtml(id) {
  const pokemon = allPokemons[id - 1];
  return `
        <div class="poke-detail-card pokemon-id-${id}" id="poke-detail-card">
            <div class="poke-detail-card-name-image ${pokemon.types[0].type.name}-bg-poke-detail-card">
                ${await createPokeDetailCardHeader(id)}
            </div>
            <div class="poke-detail-card-infos">
                ${await createPokeDetailCardNav(id)}
                <div id="poke-detail-card-infos">
                    ${await createPokeDetailCardContent(id)}
                </div>
            </div>
        </div>
    `;
}

async function createPokeDetailCardHeader(id) {
  return `
        <div class="poke-detail-card-close-button" onclick="closePokeDetailCard()">
            <img src="./img/x-lg.svg" />
        </div>
        ${await createPokeDetailCardHeaderNameIdTypes(id)}
        ${await createPokeDetailCardHeaderImageNav(id)}
    `;
}

async function createPokeDetailCardHeaderNameIdTypes(id) {
  const pokemon = allPokemons[id - 1];
  return `
        <div class="poke-detail-card-name-types-id">
          <div class="poke-detail-card-name-types">
            <div class="poke-detail-card-name">
              ${pokemon.name}
            </div>
            <div class="poke-detail-card-types">
                ${createTypesHtml(pokemon.types)}
            </div>
          </div>
          <div class="poke-detail-card-id">#
            ${String(id).padStart(3, "0")}
          </div>
        </div>
  `;
}

async function createPokeDetailCardHeaderImageNav(id) {
  const pokemon = allPokemons[id - 1];
  return `
        <div class="poke-detail-card-image-nav">
          <div class="poke-detail-card-nav left" id="nav-left" onclick="previousPokemon(${
            id - 1
          })">
              <img src="./img/caret-left.svg" />
          </div>
          <div class="poke-detail-card-image">
              <img src="${pokemon.sprites.other.dream_world.front_default}" />
          </div>
          <div class="poke-detail-card-nav right" id="nav-right" onclick="nextPokemon(${id + 1})">
              <img src="./img/caret-right.svg" />
          </div>
        </div>
  `;
}

async function createPokeDetailCardNav(id) {
  return `
        <nav>
            <span class="poke-detail-card-menu active" id="about" onclick="selectPokeDetailCardMenu('about', ${id})">About</span>
            <span class="poke-detail-card-menu" id="base-stats" onclick="selectPokeDetailCardMenu('base-stats', ${id})">Base Stats</span>
            <span class="poke-detail-card-menu" id="evolution" onclick="selectPokeDetailCardMenu('evolution', ${id})">Evolution</span>
            <span class="poke-detail-card-menu" id="moves" onclick="selectPokeDetailCardMenu('moves', ${id})">Moves</span>
        </nav>
    `;
}

async function createPokeDetailCardContent(id) {
  return `
        <div class="poke-detail-card-infos-container poke-detail-card-infos-about">
            ${await createPokeDetailCardAbout(id)}
        </div>
        <div class="poke-detail-card-infos-container poke-detail-card-infos-base-stats">
            ${await createPokeDetailCardBaseStats(id)}
        </div>
        <div class="poke-detail-card-infos-container poke-detail-card-infos-evolution">
            ${await createPokeDetailCardEvolution(id)}
        </div>
        <div class="poke-detail-card-infos-container poke-detail-card-infos-moves">
            ${await createPokeDetailCardMoves(id)}
        </div>
    `;
}

async function createPokeDetailCardAbout(id) {
  const height = allPokemons[id - 1].height / 10;
  const weight = allPokemons[id - 1].weight / 10;
  const abilities = allPokemons[id - 1].abilities
    .map((ability) => ability.ability.name)
    .toString()
    .replaceAll(",", ", ");
  return `
        <div class="height">
            <div class="name">height</div>
            <div class="content">${height} m</div>
        </div>
        <div class="weight">
            <div class="name">weight</div>
            <div class="content">${weight} kg</div>
        </div>
        <div class="abilities">
            <div class="name">abilities</div>
            <div class="content">${abilities}</div>
        </div>
    `;
}

async function createPokeDetailCardBaseStats(id) {
  const stats = allPokemons[id - 1].stats;
  let totalBaseStats = 0;
  let baseStatHtml = "";
  for (let stat of stats) {
    const statName = stat.stat.name;
    const baseStat = stat.base_stat;
    let statColor = "red";
    if (baseStat >= 80) statColor = "green";
    if (baseStat >= 160) statColor = "blue";
    totalBaseStats += baseStat;
    baseStatHtml += `
        <div class="${statName}">
            <div class="name">${statName}</div>
            <div class="value">${baseStat}</div>
            <div class="range">
                <div class="range-value ${statColor}" style="width: ${(100 * baseStat) / 250}%"></div>
                <div class="range-fill"></div>
            </div>
        </div>
    `;
  }
  baseStatHtml += await getTotalOfBaseStatHtml(totalBaseStats);
  return baseStatHtml;
}

async function getTotalOfBaseStatHtml(total) {
  let statColor = "red";
    if (total >= 480) statColor = "green";
    if (total >= 960) statColor = "blue";
  return `
        <div class="total">
            <div class="name">total</div>
            <div class="value">${total}</div>
            <div class="range">
                <div class="range-value ${statColor}" style="width: ${(100 * total) / 1500}%"></div>
                <div class="range-fill"></div>
            </div>
        </div>
    `;
}

async function createPokeDetailCardEvolution(id) {
  const evolutionChain = allPokemons[id - 1].evolutionChain;
  let pokeDetailCardEvolutionHtml = "";
  for (let evolution of evolutionChain) {
    const pokemonName = evolution.name;
    const pokemonId = evolution.id;
    if(!allPokemons[pokemonId - 1]) continue;
    const pokemonImage = allPokemons[pokemonId - 1].sprites.other['official-artwork'].front_default;
    pokeDetailCardEvolutionHtml += `
      <figure onclick="openPokeDetailCard(${pokemonId})">
        <img src="${pokemonImage}" />
        <figcaption>${pokemonName}</figcaption>
      </figure> 
    `
  }
  return pokeDetailCardEvolutionHtml;
}

async function createPokeDetailCardMoves(id) {
  const moves = allPokemons[id - 1].moves;
  let movesHtml = "";
  for (let move of moves)
    movesHtml += `<div class="move">${move.move.name}</div>`;
  return movesHtml;
}
