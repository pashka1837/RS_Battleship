import db from "../../db/db.js";
import { WebSocket } from "ws";

export default function update_room_controller(curWS?: WebSocket) {
  console.log("update_room");
  db.ws_users_Map.forEach((user, ws) => {
    const response = {
      type: "update_room",
      data: db.getEmptyRooms(user.id),
      id: 0,
    };
    const jsonResponse = JSON.stringify({
      ...response,
      data: JSON.stringify(response.data),
    });
    ws.send(jsonResponse);
  });
}
