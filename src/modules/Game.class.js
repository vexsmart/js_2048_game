'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export default class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    // eslint-disable-next-line no-console
    this.startBtn = document.querySelector('.button.start');
    this.scoreEl = document.querySelector('.game-score');
    this.cells = Array.from(document.querySelectorAll('.field-cell'));

    this.msgStart = document.querySelector('.message-start');
    this.msgWin = document.querySelector('.message-win');
    this.msgLose = document.querySelector('.message-lose');

    this.size = 4;
    this.grid = initialState || this.createEmptyGrid();
    this.status = 'idle';
    this.isFirstMove = true;
    this.score = 0;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const gridBeforeMove = JSON.stringify(this.grid);

    this.grid = this.combineTiles(this.grid);

    if (gridBeforeMove !== JSON.stringify(this.grid)) {
      this.addRandomTile();
      this.render();
      this.updateStatus();
    }
  }
  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const gridBeforeMove = JSON.stringify(this.grid);
    let currentGrid = this.grid;

    currentGrid.forEach((row) => row.reverse());
    currentGrid = this.combineTiles(currentGrid);
    currentGrid.forEach((row) => row.reverse());
    this.grid = currentGrid;

    if (gridBeforeMove !== JSON.stringify(this.grid)) {
      this.addRandomTile();
      this.render();
      this.updateStatus();
    }
  }
  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const gridBeforeMove = JSON.stringify(this.grid);
    let currentGrid = this.grid;

    currentGrid = this.transpose(currentGrid);
    currentGrid = this.combineTiles(currentGrid);
    this.grid = this.transpose(currentGrid);

    if (gridBeforeMove !== JSON.stringify(this.grid)) {
      this.addRandomTile();
      this.render();
      this.updateStatus();
    }
  }
  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const gridBeforeMove = JSON.stringify(this.grid);
    let currentGrid = this.grid;

    currentGrid = this.transpose(currentGrid);
    currentGrid.forEach((row) => row.reverse());
    currentGrid = this.combineTiles(currentGrid);
    currentGrid.forEach((row) => row.reverse());
    this.grid = this.transpose(currentGrid);

    if (gridBeforeMove !== JSON.stringify(this.grid)) {
      this.addRandomTile();
      this.render();
      this.updateStatus();
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.grid;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.status;
  }

  updateStatus() {
    if (this.checkForWin()) {
      this.status = 'win';
    } else if (this.checkForLose()) {
      this.status = 'lose';
    }
    this.renderMessage();
  }
  checkForWin() {
    return this.grid.some((row) => row.some((cell) => cell === 2048));
  }

  checkForLose() {
    if (this.grid.some((row) => row.some((cell) => cell === 0))) {
      return false;
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (c < this.size - 1 && this.grid[r][c] === this.grid[r][c + 1]) {
          return false;
        }

        if (r < this.size - 1 && this.grid[r][c] === this.grid[r + 1][c]) {
          return false;
        }
      }
    }

    return true;
  }

  createEmptyGrid() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  transpose(matrix) {
    return matrix[0].map((col, colIndex) => matrix.map((row) => row[colIndex]));
  }

  addRandomTile() {
    const emptyTiles = [];

    this.grid.forEach((row, r) => {
      return row.forEach((tile, c) => {
        if (tile === 0) {
          emptyTiles.push({ r, c });
        }
      });
    });

    if (emptyTiles.length > 0) {
      const { r, c } =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

      this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  combineTiles(grid) {
    const newGrid = [];

    for (const row of grid) {
      const newRow = row.filter((tile) => tile !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow.splice(i + 1, 1);
        }
      }

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      newGrid.push(newRow);
    }

    return newGrid;
  }

  handleValidMove() {
    if (this.isFirstMove) {
      this.startBtn.textContent = 'Restart';
      this.startBtn.classList.remove('start');
      this.startBtn.classList.add('restart');
      this.isFirstMove = false;
    }
    this.addRandomTile();
    this.render();
    this.updateStatus();
  }

  /**
   * Starts the game.
   */
  start() {
    this.grid = this.createEmptyGrid();
    this.isFirstMove = true;
    this.startBtn.textContent = 'Restart';
    this.startBtn.classList.remove('start');
    this.startBtn.classList.add('restart');
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
    this.render();
  }

  render() {
    this.scoreEl.textContent = this.score;

    this.grid.flat().forEach((value, index) => {
      const cell = this.cells[index];

      cell.textContent = value === 0 ? '' : value;
    });

    this.renderMessage();
  }

  renderMessage() {
    this.msgStart.classList.add('hidden');
    this.msgLose.classList.add('hidden');
    this.msgWin.classList.add('hidden');

    if (this.status === 'idle') {
      return this.msgStart.classList.remove('hidden');
    }

    if (this.status === 'win') {
      return this.msgWin.classList.remove('hidden');
    }

    if (this.status === 'lose') {
      return this.msgLose.classList.remove('hidden');
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    return this.start();
  }

  // Add your own methods here
}

module.exports = Game;
