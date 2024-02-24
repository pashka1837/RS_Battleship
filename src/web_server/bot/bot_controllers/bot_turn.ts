import { WebSocket } from "ws";
import { PositionT, unvisitedCellsT } from "../bot.types.js";
import { generateAttack, getNextCell } from "../logic.js";
import { createResponse } from "../../../utils/utils.js";

export default function botTurn(
  bot: any,
  data: any,
  unvisitedCells: unvisitedCellsT,
  cellsToCheck: PositionT[],
  botWs: WebSocket
) {
  if (data.currentPlayer !== bot.id) return false;

  const nextCell =
    getNextCell(cellsToCheck, unvisitedCells) || generateAttack(unvisitedCells);
  const { x, y } = nextCell;
  const reqData = {
    gameId: bot.gameId,
    x,
    y,
    indexPlayer: bot.id,
  };
  const req = createResponse("attack", reqData);
  setTimeout(() => botWs.send(req), 1000);
  return true;
}
