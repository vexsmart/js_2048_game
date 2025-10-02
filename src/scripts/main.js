'use strict';

import Game from '../modules/Game.class';
// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');

const game = new Game();

game.startBtn.addEventListener('click', () => game.start());

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      game.moveLeft();
      break;
    case 'ArrowUp':
      e.preventDefault();
      game.moveUp();
      break;
    case 'ArrowRight':
      e.preventDefault();
      game.moveRight();
      break;
    case 'ArrowDown':
      e.preventDefault();
      game.moveDown();
      break;
  }
});
