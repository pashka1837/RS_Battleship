import { WebSocket } from "ws";

import { createResponse, random } from "../../../utils/utils.js";
import ships from "../ships.js";

export default function botCreateGame(bot: any, data: any, botWs: WebSocket) {
  bot.gameId = data.idGame;
  const reqData = {
    gameId: bot.gameId,
    ships: ships[random(ships.length)],
    indexPlayer: bot.id,
  };
  const req = createResponse("add_ships", reqData);
  botWs.send(req);
}
