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
async function handleUserInput(e) {
  switch (e.key) {
    case 'ArrowUp':
      if (!canMoveUp()) {
        setUpInput();
        return
      }
      await moveUp();
      break;
    case 'ArrowDown':
      if (!canMoveDown()) {
        setUpInput();
        return
      }
      await moveDown()
      break;
    case 'ArrowLeft':
      if (!canMoveLeft()) {
        setUpInput();
        return
      }
      await moveLeft()
      break;
    case 'ArrowRight':
      if (!canMoveRight()) {
        setUpInput();
        return
      }
      await moveRight()
      break;
    default:
      setUpInput()
      return
  }
  game.cells.forEach(cell => cell.mergeTiles())
  const newTile = new Tile(gameBoard);
  game.randomEmptyCell().tile = newTile;
  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
      alert('Game Over')
    })
    return
  }
  setUpInput()
}

function moveUp() {
  return slideTiles(game.cellsByColumn)
}
function moveDown() {
  return slideTiles(game.cellsByColumn.map(column => [...column].reverse()))
}
function moveLeft() {
  return slideTiles(game.cellsByRow)
}
function moveRight() {
  return slideTiles(game.cellsByRow.map(row => [...row].reverse()))
}

async function slideTiles(cells) {
  cells.flatMap(group => {
    const promises = [];
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
        promises.push(cell.tile.waitForTransition())
        if (lastValidCell.tile != null) {
          lastValidCell.mergeTile = cell.tile
        }
        else {
          lastValidCell.tile = cell.tile
        }
        cell.tile = null
      }
    }
    return promises
  });
}

function canMoveUp() {
  return canMove(game.cellsByColumn)
}
function canMoveDown() {
  return canMove(game.cellsByColumn.map(column => [...column].reverse()))
}
function canMoveLeft() {
  return canMove(game.cellsByRow)
}
function canMoveRight() {
  return canMove(game.cellsByRow.map(row => [...row].reverse()))
}
function canMove(cells) {
  return cells.some(group => {
    return group.some((cell, index) => {
      if (index === 0) return false;
      if (cell.tile == null) return false;
      const moveToCell = group[index - 1];
      return moveToCell.canAccept(cell.tile)
    })
  })
}