import { WebSocket } from "ws";
import db from "../../db/db.js";
import { createResponse } from "../../utils/utils.js";
// import turn_controller from "./turn_controller.js";

export default function add_ships_controller(curWs: WebSocket, data: any) {
  console.log("add_ships");

  const curUser = db.ws_users_Map.get(curWs);
  if (curUser.id !== data.indexPlayer) {
    console.log(`hey`);
    return;
  }
  const curGame = db.addGamePlayers(data, curWs);

  if (curGame.players.size !== 2) return false;

  curGame.players.forEach((player, id) => {
    const resData = {
      ships: player.ships,
      currentPlayerIndex: id,
    };
    const response = createResponse("start_game", resData);
    player.playerWs.send(response);
  });
  return true;
  // turn_controller(curGame.gameId);
}
