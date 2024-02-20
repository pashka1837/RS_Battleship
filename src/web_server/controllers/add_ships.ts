import { WebSocket } from "ws";
import db from "../../db/db.js";
import { createResponse } from "../../utils/utils.js";

export default function add_ships_controller(curWs: WebSocket, data: any) {
  console.log("add_ships");

  const curUser = db.ws_users_Map.get(curWs);
  if (curUser.id !== data.indexPlayer) {
    console.log(`hey`);
    return;
  }
  const curGame = db.addGamePlayers(data, curWs);

  if (curGame.players.size !== 2) return;

  curGame.players.forEach((player, id) => {
    const resData = {
      ships: player.ships,
      currentPlayerIndex: id,
    };
    const response = createResponse("start_game", resData);
    player.playerWs.send(response);
  });

  // db.ws_users_Map.forEach((user, ws) => {
  //   if (curGame.players.has(user.id)) {
  //     const curPlayer = curGame.players.get(user.id);
  //     const resData = {
  //       ships: curPlayer.ships,
  //       currentPlayerIndex: user.id,
  //     };
  //     const response = createResponse("start_game", resData);
  //     ws.send(response);
  //   }
  // });
}
