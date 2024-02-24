import { random } from "../../utils/utils.js";
import { PositionT, unvisitedCellsT } from "./bot.types.js";

export function addCellsToCheck(
  x: number,
  y: number,
  cellsAr: PositionT[],
  unvisitedCells: unvisitedCellsT
) {
  let startX = x;
  let startY = y;
  startX = startX - 2 > 0 ? x - 2 : 0;
  startY = startY - 2 > 0 ? y - 2 : 0;

  for (let i = 0; i < 4; i++, startX++) {
    const cellToAdd = {
      x: startX,
      y: y,
    };

    if (!unvisitedCells.has(`${cellToAdd.x}${cellToAdd.y}`)) continue;
    if (cellToAdd.x === x && cellToAdd.y === y) continue;
    cellsAr.push(cellToAdd);
  }
  for (let i = 0; i < 4; i++, startY++) {
    const cellToAdd = {
      x: x,
      y: startY,
    };
    if (!unvisitedCells.has(`${cellToAdd.x}${cellToAdd.y}`)) continue;
    if (cellToAdd.x === x && cellToAdd.y === y) continue;
    cellsAr.push(cellToAdd);
  }
}

export function getNextCell(
  cellsAr: PositionT[],
  unvisitedCells: unvisitedCellsT
) {
  let curCell = cellsAr.shift();
  if (!curCell) return null;
  while (!unvisitedCells.has(`${curCell.x}${curCell.y}`)) {
    if (!cellsAr.length) return null;
    curCell = cellsAr.shift();
  }
  return curCell || null;
}

export function generateAttack(unvisitedCells: unvisitedCellsT) {
  const unVisitedCellsArray = [...unvisitedCells.values()];
  const nextCell = unVisitedCellsArray[random(unVisitedCellsArray.length)];
  unvisitedCells.delete(nextCell);
  return { x: parseInt(nextCell[0]), y: parseInt(nextCell[1]) };
}

export function generateField() {
  const fieldSet: unvisitedCellsT = new Set();
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      fieldSet.add(`${x}${y}`);
    }
  }
  return fieldSet;
}
