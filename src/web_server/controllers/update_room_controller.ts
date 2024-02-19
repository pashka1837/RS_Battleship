import db from "../../db/db.js";
import { WebSocket } from "ws";
import { createResponse } from "../../utils/utils.js";

export default function update_room_controller(curWS?: WebSocket) {
  console.log("update_room");
  db.ws_users_Map.forEach((user, ws) => {
    const emptyRooms = db.getEmptyRooms(user.id);
    const response = createResponse("update_room", emptyRooms);
    ws.send(response);
  });
}
