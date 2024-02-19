import { WebSocket } from "ws";
import db from "../../db/db.js";
import { createResponse, random } from "../../utils/utils.js";

export default function add_ships_controller(curWs: WebSocket, data: any) {
  console.log("add_ships");

  const curUser = db.ws_users_Map.get(curWs);
  if (curUser.id !== data.indexPlayer) {
    console.log(`hey`);
    return;
  }
  const curGame = db.addGamePlayers(data);

  if (curGame.players.size !== 2) return;

  const turn = [...curGame.players.values()][random()].playerId;

  db.ws_users_Map.forEach((user, ws) => {
    if (curGame.players.has(user.id)) {
      const curPlayer = curGame.players.get(user.id);
      const resData = {
        ships: curPlayer.ships,
        currentPlayerIndex: turn,
      };
      const response = createResponse("start_game", resData);
      ws.send(response);
    }
  });
}
