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

  const addUser = db.ws_users_Map.get(curWS);
  const curRoom = db.addUserToRoom(addUser, enterRoomID, curWS);

  db.getRoomsMap.delete(enterRoomID);
  if (addUser.roomId) db.getRoomsMap.delete(addUser.roomId);

  update_room_controller();

  const newGame = {
    gameId: randomUUID(),
  };
  db.addNewGame(newGame);

  curRoom.roomUsers.forEach((roomUser) => {
    const { id, ws } = roomUser;
    const u = db.getUsersMap.get(id);
    u.roomId = "";

    const response = createResponse("create_game", {
      idGame: newGame.gameId,
      idPlayer: id,
    });
    ws.send(response);
  });
}
