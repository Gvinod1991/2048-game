import Grid from "./Grid.js";
import Tile from "./Tile.js";
const gameBoard = document.querySelector('#game-board');

const game = new Grid(gameBoard);
game.randomEmptyCell().tile = new Tile(gameBoard);
game.randomEmptyCell().tile = new Tile(gameBoard);
setUpInput();
function setUpInput() {
  window.addEventListener('keydown', handleUserInput, { once: true })
}
function handleUserInput(e) {
  switch (e.key) {
    case 'ArrowUp':
      moveUp();
      break;
    case 'ArrowDown':
      moveDown()
      break;
    case 'ArrowLeft':
      moveLeft()
      break;
    case 'ArrowRight':
      moveRight()
      break;
    default:
      setUpInput()
      return
  }
  game.cells.forEach(cell => cell.mergeTiles())
  setUpInput()
}

function moveUp() {
  slideTiles(game.cellsByColumn)
}
function moveDown() {
  slideTiles(game.cellsByColumn.map(column => [...column].reverse()))
}
function moveLeft() {
  slideTiles(game.cellsByRow)
}
function moveRight() {
  slideTiles(game.cellsByRow.map(row => [...row].reverse()))
}

function slideTiles(cells) {
  cells.forEach(group => {
    for (let i = 1; i < group.length; i++) {
      const cell = group[i];
      if (cell.tile == null) continue;
      let lastValidCell;
      for (let j = i - 1; j >= 0; j--) {
        const moveToCell = group[j];
        if (!moveToCell.canAccept(cell.tile)) break
        lastValidCell = moveToCell
      }

      if (lastValidCell != null) {
        if (lastValidCell.tile != null) {
          lastValidCell.mergeTile = cell.tile
        }
        else {
          lastValidCell.tile = cell.tile
        }
        cell.tile = null
      }
    }
  });
}