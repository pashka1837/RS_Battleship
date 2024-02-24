import { WebSocket, MessageEvent } from "ws";
import { PositionT, unvisitedCellsT } from "./bot.types.js";
import {
  botReg,
  botCreateGame,
  botAttack,
  botTurn,
} from "./bot_controllers/index.js";
import { generateField } from "./logic.js";

const unvisitedCells: unvisitedCellsT = generateField();

const cellsToCheck: PositionT[] = [];
const bot = {
  id: null,
  gameId: null,
  name: null,
};

export default function botController(
  res: MessageEvent,
  botWs: WebSocket,
  existingBotId?: string
) {
  const message = res.data as string;
  const msgParsed = JSON.parse(message);
  const data = msgParsed.data ? JSON.parse(msgParsed.data) : msgParsed.data;
  const type = msgParsed.type;

  switch (type) {
    case "reg":
      botReg(existingBotId, bot, data);
      break;

    case "create_game":
      botCreateGame(bot, data, botWs);
      break;

    case "attack":
      if (!botAttack(bot, data, unvisitedCells, cellsToCheck)) break;
      break;

    case "turn":
      if (!botTurn(bot, data, unvisitedCells, cellsToCheck, botWs)) break;
      break;

    case "finish":
      botWs.close();
      break;

    default:
      break;
  }
}
