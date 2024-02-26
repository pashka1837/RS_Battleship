import { PositionT, unvisitedCellsT } from "../botTypes.js";
import { addCellsToCheck } from "../logic.js";

export default function botAttack(
  bot: any,
  data: any,
  unvisitedCells: unvisitedCellsT,
  cellsToCheck: PositionT[]
) {
  if (data.currentPlayer !== bot.id) return false;

  const position = {
    x: data.position.x,
    y: data.position.y,
  };

  unvisitedCells.delete(`${position.x}${position.y}`);

  if (data.status === "shot") {
    addCellsToCheck(position.x, position.y, cellsToCheck, unvisitedCells);
  }
  return true;
}
