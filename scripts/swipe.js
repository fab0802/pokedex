"use strict";

let xDown = null;
let yDown = null;

pokeDetailCardOverlay.addEventListener("touchstart", handleTouchStart);
pokeDetailCardOverlay.addEventListener("touchmove", handleTouchMove);

function handleTouchStart(e) {
  xDown = e.touches[0].clientX;
  yDown = e.touches[0].clientY;
}

function handleTouchMove(e) {
  if (!xDown || !yDown) return;
  const xUp = e.touches[0].clientX;
  const yUp = e.touches[0].clientY;
  const xDiff = xDown - xUp;
  const yDiff = yDown - yUp;
  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    const pokemonId = Number(getPokemonId());
    xDiff > 0 ? nextPokemon(pokemonId + 1) : previousPokemon(pokemonId - 1);
  }
  xDown = null;
  yDown = null;
}
