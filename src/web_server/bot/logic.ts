import { random } from "../../utils/utils.js";
import { PositionT, VisitedCellsT } from "./bot.types.js";

export function addCellsToCheck(
  x: number,
  y: number,
  cellsAr: PositionT[],
  visitedCells: VisitedCellsT
) {
  const startX = x - 1 >= 0 ? x - 1 : 0;
  let startY = y - 1 >= 0 ? y - 1 : 0;
  for (let i = 0; i < 3; i++) {
    for (let z = 0; z < 3; z++) {
      const cellToAdd = {
        x: startX + z,
        y: startY,
      };
      if (visitedCells.has(JSON.stringify(cellToAdd))) continue;
      if (cellToAdd.x === x && cellToAdd.y === y) continue;
      cellsAr.push({ x: startX + z, y: startY });
    }
    startY++;
  }
  return cellsAr;
}

export function getNextCell(cellsAr: PositionT[], visitedCells: VisitedCellsT) {
  let curCell = cellsAr.pop();
  while (visitedCells.has(JSON.stringify(curCell))) {
    curCell = cellsAr.pop();
  }
  console.log("supposing cell", curCell, cellsAr);
  return curCell || null;
}

export function generate_attack(visitedCells: VisitedCellsT) {
  const position = {
    x: random(10),
    y: random(10),
  };
  while (visitedCells.has(JSON.stringify(position))) {
    position.x = random(10);
    position.y = random(10);
  }
  console.log("generated attack", position);
  visitedCells.add(JSON.stringify(position));
  return { x: position.x, y: position.y };
}
