import { WebSocket, MessageEvent } from "ws";
import { createResponse, random } from "../../utils/utils.js";
import ships from "./ships.js";
import { addCellsToCheck, generate_attack, getNextCell } from "./logic.js";
import { PositionT, VisitedCellsT } from "./bot.types.js";

const visitedCells: VisitedCellsT = new Set();
const cellsToCheck: PositionT[] = [];
const bot = {
  id: null,
  gameId: null,
  name: null,
};

export default function bot_controller(
  res: MessageEvent,
  botWs: WebSocket,
  existingBotId?: string
) {
  const message = res.data as string;
  const msgParsed = JSON.parse(message);
  const data = msgParsed.data ? JSON.parse(msgParsed.data) : msgParsed.data;
  const type = msgParsed.type;
  console.log("bot's action");
  switch (type) {
    case "reg":
      {
        if (!existingBotId) {
          bot.id = data.index;
          process.send({ botId: bot.id });
        } else {
          bot.id = data.index;
          bot.name = data.name;
        }
      }
      break;
    case "create_game":
      {
        bot.gameId = data.idGame;
        const reqData = {
          gameId: bot.gameId,
          ships: ships[random(ships.length)],
          indexPlayer: bot.id,
        };
        const req = createResponse("add_ships", reqData);
        botWs.send(req);
      }
      break;
    case "attack":
      {
        if (data.currentPlayer !== bot.id) break;

        const position = {
          x: data.position.x,
          y: data.position.y,
        };

        const attacked_position = JSON.stringify(position);
        visitedCells.add(attacked_position);

        if (data.status === "shot") {
          addCellsToCheck(position.x, position.y, cellsToCheck, visitedCells);
        }
      }
      break;

    case "turn":
      {
        if (data.currentPlayer !== bot.id) break;

        const nextCell =
          getNextCell(cellsToCheck, visitedCells) ||
          generate_attack(visitedCells);
        const { x, y } = nextCell;
        const reqData = {
          gameId: bot.gameId,
          x,
          y,
          indexPlayer: bot.id,
        };
        const req = createResponse("attack", reqData);
        setTimeout(() => botWs.send(req), 1000);
      }
      break;

    case "finish":
      botWs.close();
      break;

    default:
      console.log("kek");
  }
}
