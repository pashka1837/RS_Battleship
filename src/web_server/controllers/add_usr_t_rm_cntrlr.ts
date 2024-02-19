import { WebSocket } from "ws";
import db from "../../db/db.js";
import update_room_controller from "./update_room_controller.js";
import { createResponse } from "../../utils/utils.js";
import { randomUUID } from "node:crypto";

export default function add_usr_t_rm_cntrlr(
  enterRoomID: string,
  curWS: WebSocket
) {
  console.log("add_user_to_room");

  const curUser = db.ws_users_Map.get(curWS);
  const curRoom = db.addUserToRoom(curUser, enterRoomID);

  update_room_controller();

  const newGame = {
    gameId: randomUUID(),
    players: [],
  };

  db.ws_users_Map.forEach((user, ws) => {
    if (
      user.id === curRoom.roomUsers[0].id ||
      user.id === curRoom.roomUsers[1].id
    ) {
      const response = createResponse("create_game", {
        idGame: newGame.gameId,
        idPlayer: user.id,
      });
      newGame.players.push(user.id);
      ws.send(response);
    }
  });
}
