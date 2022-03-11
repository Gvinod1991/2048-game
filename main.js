import Grid from "./Grid.js";
import Tile from "./Tile.js";
const gameBoard = document.querySelector('#game-board');

const game = new Grid(gameBoard);
game.randomEmptyCell().tile = new Tile(gameBoard);
game.randomEmptyCell().tile = new Tile(gameBoard);